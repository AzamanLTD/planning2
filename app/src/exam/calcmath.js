// Scientific calculator engine: tokenizer + shunting-yard + RPN evaluator.
// Supports: + - * / ^ %, unary minus, parentheses, sin cos tan (radians),
// ln, log (base 10), sqrt, x^2, 1/x, constants pi and e, Ans memory.

export function evaluate(expr, ans = 0) {
  const tokens = tokenize(expr, ans);
  const rpn = toRPN(tokens);
  return evalRPN(rpn);
}

const FUNCS = new Set(["sin", "cos", "tan", "ln", "log", "sqrt"]);

function tokenize(input, ans) {
  const out = [];
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < input.length && /[0-9.]/.test(input[j])) j++;
      const numStr = input.slice(i, j);
      if ((numStr.match(/\./g) || []).length > 1) throw new Error("bad number");
      out.push({ type: "num", value: parseFloat(numStr) });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      let j = i;
      while (j < input.length && /[a-zA-Z]/.test(input[j])) j++;
      let word = input.slice(i, j).toLowerCase();
      i = j;
      if (word === "pi") { out.push({ type: "num", value: Math.PI }); continue; }
      if (word === "e") { out.push({ type: "num", value: Math.E }); continue; }
      if (word === "ans") { out.push({ type: "num", value: ans }); continue; }
      if (FUNCS.has(word)) { out.push({ type: "func", value: word }); continue; }
      throw new Error("unknown: " + word);
    }
    if (c === "+" || c === "\u2212" || c === "-") {
      const prev = out[out.length - 1];
      const isUnary = !prev || (prev.type === "op") || (prev.type === "lparen");
      out.push({ type: "op", value: isUnary ? "u-" : "-", prec: isUnary ? 4 : 1, right: isUnary });
      i++;
      continue;
    }
    if (c === "*" || c === "\u00d7") { out.push({ type: "op", value: "*", prec: 2 }); i++; continue; }
    if (c === "/" || c === "\u00f7") { out.push({ type: "op", value: "/", prec: 2 }); i++; continue; }
    if (c === "^") { out.push({ type: "op", value: "^", prec: 3, right: true }); i++; continue; }
    if (c === "(") { out.push({ type: "lparen" }); i++; continue; }
    if (c === ")") { out.push({ type: "rparen" }); i++; continue; }
    throw new Error("bad char: " + c);
  }
  return out;
}

function toRPN(tokens) {
  const out = [];
  const stack = [];
  for (const t of tokens) {
    if (t.type === "num") { out.push(t); continue; }
    if (t.type === "func") { stack.push(t); continue; }
    if (t.type === "op") {
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.type === "op" && (top.prec > t.prec || (top.prec === t.prec && !t.right))) {
          out.push(stack.pop());
        } else if (top.type === "func" && t.value !== "^") {
          out.push(stack.pop());
        } else break;
      }
      stack.push(t);
      continue;
    }
    if (t.type === "lparen") { stack.push(t); continue; }
    if (t.type === "rparen") {
      while (stack.length && stack[stack.length - 1].type !== "lparen") out.push(stack.pop());
      if (!stack.length) throw new Error("parens");
      stack.pop();
      if (stack.length && stack[stack.length - 1].type === "func") out.push(stack.pop());
      continue;
    }
  }
  while (stack.length) {
    const s = stack.pop();
    if (s.type === "lparen") throw new Error("parens");
    out.push(s);
  }
  return out;
}

function evalRPN(rpn) {
  const st = [];
  for (const t of rpn) {
    if (t.type === "num") { st.push(t.value); continue; }
    if (t.type === "func") {
      const a = st.pop();
      if (a === undefined) throw new Error("missing operand");
      st.push(applyFunc(t.value, a));
      continue;
    }
    if (t.value === "u-") {
      const a = st.pop();
      if (a === undefined) throw new Error("missing operand");
      st.push(-a);
      continue;
    }
    const b = st.pop();
    const a = st.pop();
    if (a === undefined || b === undefined) throw new Error("missing operand");
    switch (t.value) {
      case "+": st.push(a + b); break;
      case "-": st.push(a - b); break;
      case "*": st.push(a * b); break;
      case "/": st.push(a / b); break;
      case "^": st.push(Math.pow(a, b)); break;
      default: throw new Error("bad op");
    }
  }
  if (st.length !== 1) throw new Error("incomplete");
  const r = st[0];
  if (!isFinite(r)) return r;
  return Math.abs(r) < 1e-12 ? 0 : r;
}

function applyFunc(f, a) {
  switch (f) {
    case "sin": return Math.sin(a);
    case "cos": return Math.cos(a);
    case "tan": return Math.tan(a);
    case "ln": return Math.log(a);
    case "log": return Math.log10(a);
    case "sqrt": return Math.sqrt(a);
    default: throw new Error("bad func");
  }
}

export function fmtNum(n) {
  if (n === Infinity) return "Infinity";
  if (n === -Infinity) return "-Infinity";
  if (Number.isNaN(n)) return "Error";
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-9 && n !== 0)) return n.toExponential(6);
  return parseFloat(n.toPrecision(12)).toString();
}
