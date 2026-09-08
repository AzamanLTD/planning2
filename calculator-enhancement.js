(() => {
  'use strict';

  const DEG = Math.PI / 180;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  function tokenize(input) {
    return input
      .replace(/[×·]/g, '*').replace(/[÷]/g, '/').replace(/[−–]/g, '-')
      .replace(/π/g, 'pi').replace(/√/g, 'sqrt')
      .replace(/\s+/g, '')
      .replace(/\^/g, '^');
  }

  function evaluate(input) {
    let x = tokenize(input);
    if (!x) throw new Error('empty');
    if (!/^[0-9a-zA-Z_+\-*/().,^]+$/.test(x)) throw new Error('characters');

    const names = new Map([
      ['pi', Math.PI], ['e', Math.E],
      ['sin', (v) => Math.sin(v * DEG)], ['cos', (v) => Math.cos(v * DEG)],
      ['tan', (v) => Math.tan(v * DEG)], ['asin', (v) => Math.asin(v) / DEG],
      ['acos', (v) => Math.acos(v) / DEG], ['atan', (v) => Math.atan(v) / DEG],
      ['sqrt', Math.sqrt], ['abs', Math.abs], ['ln', Math.log],
      ['log', Math.log10], ['exp', Math.exp],
    ]);

    let pos = 0;
    const peek = () => x.slice(pos);
    const eat = (re) => {
      const m = peek().match(re);
      if (!m) return null;
      pos += m[0].length;
      return m[0];
    };
    const primary = () => {
      if (eat(/^\+/)) return primary();
      if (eat(/^-/)) return -primary();
      if (eat(/^\(/)) {
        const v = expression();
        if (!eat(/^\)/)) throw new Error('paren');
        return v;
      }
      const name = eat(/^[A-Za-z]+/);
      if (name) {
        if (name === 'pi' || name === 'e') return names.get(name);
        const fn = names.get(name);
        if (!fn || typeof fn !== 'function') throw new Error('name');
        if (!eat(/^\(/)) throw new Error('fn');
        const v = expression();
        if (!eat(/^\)/)) throw new Error('paren');
        return fn(v);
      }
      const num = eat(/^\d+(?:\.\d*)?|^\.\d+/);
      if (!num) throw new Error('number');
      return Number(num);
    };
    const power = () => {
      const a = primary();
      if (eat(/^\^/)) return Math.pow(a, power());
      return a;
    };
    const term = () => {
      let v = power();
      for (;;) {
        if (eat(/^\*/)) v *= power();
        else if (eat(/^\//)) v /= power();
        else break;
      }
      return v;
    };
    function expression() {
      let v = term();
      for (;;) {
        if (eat(/^\+/)) v += term();
        else if (eat(/^-/)) v -= term();
        else break;
      }
      return v;
    }

    const result = expression();
    if (pos !== x.length || !Number.isFinite(result)) throw new Error('invalid');
    return result;
  }

  function graphExpression(input, x) {
    let expr = tokenize(input)
      .replace(/\bx\b/g, `(${x})`)
      .replace(/([0-9.)])(pi|e|x)/g, '$1*$2')
      .replace(/(pi|e)(\d|\()/g, '$1*$2');
    return evaluate(expr);
  }

  function install(panel) {
    if (!panel || panel.dataset.azmCalcReady === '1') return;
    panel.dataset.azmCalcReady = '1';
    const head = panel.querySelector('.panel-head');
    const close = panel.querySelector('#closeCalc');
    panel.innerHTML = `${head?.outerHTML || '<div class="panel-head"><b>Calculator</b></div>'}
      <div class="azm-calc-tabs" role="tablist" aria-label="Calculator modes">
        <button type="button" class="azm-calc-tab active" data-mode="calculate" role="tab" aria-selected="true">Calculate</button>
        <button type="button" class="azm-calc-tab" data-mode="graph" role="tab" aria-selected="false">Graph</button>
      </div>
      <section data-calc-view="calculate">
        <input id="calcDisplay" class="calc-display mono" aria-label="Calculator expression" autocomplete="off" inputmode="decimal">
        <div class="azm-calc-memory" aria-label="Calculator shortcuts">
          <button type="button" data-insert="sin(">sin</button><button type="button" data-insert="cos(">cos</button><button type="button" data-insert="tan(">tan</button><button type="button" data-insert="sqrt(">√</button><button type="button" data-insert="^">xʸ</button><button type="button" data-insert="pi">π</button>
        </div>
        <div class="calc-grid">${['7','8','9','÷','4','5','6','×','1','2','3','−','0','.','(',')','+','⌫','=','C'].map(v => `<button class="calc-key" type="button" data-calc="${v}">${v}</button>`).join('')}</div>
        <p class="small azm-calc-help">Angles use degrees. Supported functions include sin, cos, tan, inverse trig, √, abs, ln, log, exp, π and e.</p>
      </section>
      <section data-calc-view="graph" hidden>
        <label class="small" for="azmGraphExpr">Function</label>
        <input id="azmGraphExpr" class="text-input mono" value="sin(x)" aria-label="Graph function" spellcheck="false">
        <div class="azm-graph-controls"><label class="small">X min <input id="azmXMin" class="text-input" value="-10" inputmode="decimal"></label><label class="small">X max <input id="azmXMax" class="text-input" value="10" inputmode="decimal"></label><button id="azmPlot" type="button" class="btn primary-action">Plot</button></div>
        <canvas id="azmGraph" class="azm-graph" width="700" height="420" aria-label="Function graph"></canvas>
        <p id="azmGraphStatus" class="small" aria-live="polite">Enter a function in x and choose Plot.</p>
      </section>`;

    panel.querySelector('#closeCalc')?.addEventListener('click', () => panel.remove());
    const display = panel.querySelector('#calcDisplay');
    let expression = '';
    const setDisplay = () => { display.value = expression; };
    panel.querySelectorAll('[data-insert]').forEach(btn => btn.addEventListener('click', () => { expression += btn.dataset.insert; setDisplay(); display.focus(); }));
    panel.querySelectorAll('[data-calc]').forEach(btn => btn.addEventListener('click', () => {
      const v = btn.dataset.calc;
      if (v === 'C') expression = '';
      else if (v === '⌫') expression = expression.slice(0, -1);
      else if (v === '=') { try { expression = String(evaluate(expression)); } catch (_) { expression = 'Error'; } }
      else expression = expression === 'Error' ? v : expression + v;
      setDisplay();
      display.focus();
    }));
    display.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        try { expression = String(evaluate(display.value)); } catch (_) { expression = 'Error'; }
        setDisplay();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        close.click();
      }
    });

    const canvas = panel.querySelector('#azmGraph');
    const ctx = canvas.getContext('2d');
    const status = panel.querySelector('#azmGraphStatus');
    function plot() {
      const xmin = Number(panel.querySelector('#azmXMin').value);
      const xmax = Number(panel.querySelector('#azmXMax').value);
      const fn = panel.querySelector('#azmGraphExpr').value.trim();
      if (!Number.isFinite(xmin) || !Number.isFinite(xmax) || xmax <= xmin || xmax - xmin > 200 || !fn) {
        status.textContent = 'Use a valid X range (maximum span 200).'; return;
      }
      const w = canvas.width, h = canvas.height, mid = h / 2;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#d7dce1';
      const yMin = -10, yMax = 10;
      const pxX = x => (x - xmin) / (xmax - xmin) * w;
      const pxY = y => h - (y - yMin) / (yMax - yMin) * h;
      ctx.beginPath();
      ctx.moveTo(pxX(0), 0); ctx.lineTo(pxX(0), h);
      ctx.moveTo(0, pxY(0)); ctx.lineTo(w, pxY(0)); ctx.stroke();
      ctx.strokeStyle = '#18212a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      let drawing = false, good = 0;
      for (let i = 0; i < w; i += 2) {
        const x = xmin + (xmax - xmin) * i / (w - 1);
        let y;
        try { y = graphExpression(fn, x); } catch (_) { y = NaN; }
        if (!Number.isFinite(y) || Math.abs(y) > 1000) { drawing = false; continue; }
        const py = pxY(clamp(y, yMin, yMax));
        if (!drawing) ctx.moveTo(i, py); else ctx.lineTo(i, py);
        drawing = true; good += 1;
      }
      ctx.stroke();
      status.textContent = good ? `Plotted ${fn} for x from ${xmin} to ${xmax}. Y-axis shown from −10 to 10.` : 'The function could not be plotted in this range.';
    }
    panel.querySelector('#azmPlot').addEventListener('click', plot);
    panel.querySelector('#azmGraphExpr').addEventListener('keydown', e => { if (e.key === 'Enter') plot(); });
    document.dispatchEvent(new CustomEvent('azm-calculator-ready'));
    setDisplay();
    display.focus();
  }

  const observer = new MutationObserver(() => install(document.getElementById('calculatorPanel')));
  observer.observe(document.body, { childList: true, subtree: true });
  install(document.getElementById('calculatorPanel'));
})();
