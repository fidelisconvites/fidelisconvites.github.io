/* Fidelis Convites — comportamento da papelaria */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, pai) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (pai) pai.appendChild(n);
    return n;
  };

  /* Uma pena: folha alongada apontando para -x, com a raiz na origem. */
  const pena = (L, w) =>
    `M0 0 C${(-0.32 * L).toFixed(1)} ${-w},${(-0.72 * L).toFixed(1)} ${(-0.62 * w).toFixed(1)},${-L} 0 ` +
    `C${(-0.72 * L).toFixed(1)} ${(0.62 * w).toFixed(1)},${(-0.32 * L).toFixed(1)} ${w},0 0Z`;

  /* Leque de penas preso a um ponto — serve de asa e de cauda. */
  const leque = (pai, plano, classe) => {
    const g = el('g', { class: classe }, pai);
    plano.forEach(([ang, L, w]) => el('path', { d: pena(L, w), transform: `rotate(${ang})` }, g));
    return g;
  };

  /* ── os selos da coleção ───────────────────────────────────────────
     Clicar no selo troca o desenho, como quem escolhe outro na cartela. */
  (function selos() {
    const arte = $('#stamp-art');
    const valor = $('#stamp-value');
    const palavra = $('#stamp-word');
    const botao = $('#stamp-btn');
    if (!arte || !botao) return;

    const CX = 66;

    /* — o brasão oficial da casa — */
    const brasao = (g) => {
      el('image', {
        class: 'stamp__brasao',
        href: 'assets/img/LOGO%20FIDELIS%20OFICIAL%20MARINHO%20FUNDO%20TRANSPARENTE.png',
        x: 21, y: 32, width: 90, height: 90
      }, g);
    };

    /* — monograma entre dois ramos de louro — */
    const louro = (g) => {
      const cy = 76, raio = 42, abertura = 56, folhas = 7;

      [90, 270].forEach((centro) => {
        for (let i = 0; i < folhas; i++) {
          const t = i / (folhas - 1);
          const ang = centro - abertura + t * abertura * 2;
          const afilar = 0.62 + 0.38 * Math.sin(t * Math.PI);

          g.appendChild(el('ellipse', {
            class: 'folha', cx: CX, cy: cy - raio,
            rx: (5.4 * afilar).toFixed(2), ry: (11.6 * afilar).toFixed(2),
            transform: `rotate(${ang.toFixed(2)} ${CX} ${cy})`
          }));

          if (i % 2 === 1) {
            g.appendChild(el('circle', {
              class: 'baga', cx: CX, cy: cy - raio + 12.5, r: 1.8,
              transform: `rotate(${(ang - 8).toFixed(2)} ${CX} ${cy})`
            }));
          }
        }
      });

      const m = el('text', { class: 'stamp__monogram', x: CX, y: 96, 'text-anchor': 'middle' });
      m.textContent = 'F';
      g.appendChild(m);
    };

    /* — duas alianças entrelaçadas — */
    const aliancas = (g) => {
      g.appendChild(el('circle', { class: 'aro aro--b', cx: 78, cy: 72, r: 22 }));
      g.appendChild(el('circle', { class: 'aro aro--a', cx: 54, cy: 84, r: 22 }));
      // o arco que passa por cima costura um anel no outro
      g.appendChild(el('path', { class: 'aro aro--a', d: 'M72 71.4 A22 22 0 0 1 72 96.6' }));

      // brilhante no aro de cima
      g.appendChild(el('rect', {
        class: 'brilho', x: 74, y: 46, width: 8, height: 8, rx: 1.4,
        transform: 'rotate(45 78 50)'
      }));
      g.appendChild(el('path', { class: 'faisca', d: 'M96 44 v8 M92 48 h8' }));
    };

    /* — ramalhete de primavera — */
    const buque = (g) => {
      g.appendChild(el('path', {
        class: 'haste',
        d: 'M66 122 C62 102 54 84 50 66 M66 122 C66 100 66 80 66 56 M66 122 C70 102 78 84 84 68'
      }));
      [[46, 108, -28], [84, 104, 26]].forEach(([x, y, r]) => {
        g.appendChild(el('ellipse', { class: 'folha', cx: x, cy: y, rx: 5, ry: 10.5,
          transform: `rotate(${r} ${x} ${y})` }));
      });

      [[50, 62, 12.5], [66, 50, 14.5], [84, 64, 12.5]].forEach(([x, y, raio]) => {
        for (let k = 0; k < 5; k++) {
          g.appendChild(el('ellipse', {
            class: 'petala', cx: x, cy: y - raio * 0.58,
            rx: raio * 0.36, ry: raio * 0.6,
            transform: `rotate(${k * 72} ${x} ${y})`
          }));
        }
        g.appendChild(el('circle', { class: 'miolo', cx: x, cy: y, r: raio * 0.26 }));
      });

      g.appendChild(el('path', { class: 'fita', d: 'M55 116 C62 112 70 112 77 116 M60 118 l-6 7 M72 118 l6 7' }));
    };

    /* — quinze anos — */
    const quinze = (g) => {
      g.appendChild(el('path', { class: 'coroa', d: 'M44 50 L52 38 L60 48 L66 32 L72 48 L80 38 L88 50 Z' }));
      [48, 66, 84].forEach((x, i) => {
        g.appendChild(el('circle', { class: 'baga', cx: x, cy: i === 1 ? 28 : 35, r: 2.4 }));
      });
      const n = el('text', { class: 'stamp__monogram stamp__monogram--num', x: CX, y: 108, 'text-anchor': 'middle' });
      n.textContent = '15';
      g.appendChild(n);
      g.appendChild(el('path', { class: 'regua', d: 'M40 118 h52' }));
    };

    const desenhos = [
      { id: 'brasao',   arte: brasao,   valor: 'COLEÇÃO 2026', palavra: 'fidelis convites', diz: 'o brasão oficial da casa' },
      { id: 'louro',    arte: louro,    valor: 'FEITO À MÃO',  palavra: 'um a um',          diz: 'monograma entre ramos de louro' },
      { id: 'aliancas', arte: aliancas, valor: 'NOIVOS',       palavra: 'para sempre',      diz: 'duas alianças entrelaçadas' },
      { id: 'buque',    arte: buque,    valor: 'PRIMAVERA',    palavra: 'feito à mão',      diz: 'um ramalhete de primavera' },
      { id: 'quinze',   arte: quinze,   valor: '15 ANOS',      palavra: 'debutantes',       diz: 'o quinze sob uma coroa' }
    ];

    let atual = 0;

    const desenhar = () => {
      const d = desenhos[atual];
      arte.replaceChildren();
      arte.style.animation = 'none';
      void arte.getBoundingClientRect();   // força o reinício do esmaecer
      arte.style.animation = '';
      arte.dataset.art = d.id;
      d.arte(arte);
      valor.textContent = d.valor;
      palavra.textContent = d.palavra;
      botao.setAttribute('aria-label', `Selo: ${d.diz}. Clique para ver outro desenho.`);
    };

    desenhar();

    botao.addEventListener('click', () => {
      atual = (atual + 1) % desenhos.length;
      // reinicia o carimbo antes de trocar o desenho
      botao.classList.remove('is-pressing');
      void botao.offsetWidth;
      botao.classList.add('is-pressing');
      botao.closest('.stamp-wrap')?.classList.add('is-used');
      desenhar();
    });

    botao.addEventListener('animationend', (ev) => {
      if (ev.animationName === 'press') botao.classList.remove('is-pressing');
    });
  })();

  /* ── a cena do postal ───────────────────────────────────────────────
     Cada paleta tem a sua: quem leva o convite muda junto com o papel. */
  const cenario = (() => {
    const palco = $('.flyer-wrap');
    const longe = $('.hill--far path');
    const perto = $('.hill--near path');

    const moldura = (tilt) => {
      const svg = el('svg', { class: 'flyer', viewBox: '0 0 340 250', 'aria-hidden': 'true' });
      svg.style.setProperty('--tilt', tilt);
      const defs = el('defs', {}, svg);
      const asa = el('linearGradient', { id: 'asa', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      el('stop', { offset: 0, 'stop-color': 'var(--wing-1)' }, asa);
      el('stop', { offset: 1, 'stop-color': 'var(--wing-2)' }, asa);
      const papel = el('linearGradient', { id: 'papel', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
      el('stop', { offset: 0, 'stop-color': 'var(--letter-1)' }, papel);
      el('stop', { offset: 1, 'stop-color': 'var(--letter-2)' }, papel);
      return svg;
    };

    /* ── Bordô: o convite ganha asas ── */
    const convite = () => {
      const svg = moldura('-6deg');
      el('path', { class: 'flyer__trail', d: 'M8 214 C 74 210 108 186 132 156' }, svg);

      const plano = [[-30, 76, 8.6], [-17, 91, 9.8], [-4, 101, 10.2], [9, 97, 9.6], [22, 84, 8.6]];
      [false, true].forEach((espelha) => {
        const g = el('g', {
          class: 'flyer__wing',
          transform: espelha ? 'translate(226 102) scale(-1 1) rotate(-36)'
                             : 'translate(114 102) rotate(-36)'
        }, svg);
        const plume = leque(g, plano, 'flyer__plume');
        el('ellipse', { class: 'flyer__covert', cx: -16, cy: 1, rx: 19, ry: 13, transform: 'rotate(-4)' }, plume);
      });

      const carta = el('g', { class: 'flyer__letter' }, svg);
      el('rect', { x: 112, y: 84, width: 116, height: 80, rx: 7, fill: 'url(#papel)' }, carta);
      el('path', { class: 'flyer__flap', d: 'M112 91 L170 132 L228 91' }, carta);
      el('path', { class: 'flyer__crease', d: 'M112 160 L152 126 M228 160 L188 126' }, carta);
      el('circle', { class: 'flyer__seal', cx: 170, cy: 140, r: 15 }, carta);
      const m = el('text', { class: 'flyer__monogram', x: 170, y: 146, 'text-anchor': 'middle' }, carta);
      m.textContent = 'F';
      return svg;
    };

    /* ── Areia: uma pipa caixa, com o convite amarrado na linha ── */
    const pipa = () => {
      const svg = moldura('-11deg');
      svg.classList.add('flyer--pipa');

      /* Projeção axonométrica: duas arestas horizontais e a altura.
         Os cantos do topo são T (fundo), R (direita), F (frente) e L (esquerda). */
      const O = [166, 10];
      const a = [56, 29];
      const b = [-48, 25];
      const H = 150;
      const cantos = { T: [0, 0], R: [1, 0], F: [1, 1], L: [0, 1] };

      const v = (nome, h) => {
        const [ka, kb] = cantos[nome];
        return [
          (O[0] + ka * a[0] + kb * b[0]).toFixed(1),
          (O[1] + ka * a[1] + kb * b[1] + h).toFixed(1)
        ];
      };
      const face = (n1, n2, h1, h2) => `M${v(n1, h1)} L${v(n2, h1)} L${v(n2, h2)} L${v(n1, h2)} Z`;
      const aro = (h) => `M${v('T', h)} L${v('R', h)} L${v('F', h)} L${v('L', h)} Z`;
      const risco = (n1, h1, n2, h2) => `M${v(n1, h1)} L${v(n2, h2)}`;

      const celas = [[0, 58], [92, H]];          // as duas faixas de tecido
      const g = el('g', { class: 'flyer__kite' }, svg);

      // o tecido do fundo, que se adivinha por transparência
      celas.forEach(([h1, h2]) => {
        el('path', { class: 'pipa__vela pipa__vela--fundo', d: face('L', 'T', h1, h2) }, g);
        el('path', { class: 'pipa__vela pipa__vela--fundo', d: face('T', 'R', h1, h2) }, g);
      });

      // e o da frente, em duas luzes
      celas.forEach(([h1, h2]) => {
        el('path', { class: 'pipa__vela pipa__vela--frente-e', d: face('L', 'F', h1, h2) }, g);
        el('path', { class: 'pipa__vela pipa__vela--frente-d', d: face('F', 'R', h1, h2) }, g);
      });

      // as quatro varas de ponta a ponta
      ['T', 'R', 'F', 'L'].forEach((n) => el('path', { class: 'pipa__vara', d: risco(n, 0, n, H) }, g));

      // os aros de cada boca
      [0, 58, 92, H].forEach((h) => el('path', { class: 'pipa__aro', d: aro(h) }, g));

      // o cruzeiro da boca de cima e os tirantes dentro de cada faixa
      el('path', { class: 'pipa__tirante', d: risco('T', 0, 'F', 0) }, g);
      el('path', { class: 'pipa__tirante', d: risco('R', 0, 'L', 0) }, g);
      celas.forEach(([h1, h2]) => {
        [['L', 'F'], ['F', 'R']].forEach(([n1, n2]) => {
          el('path', { class: 'pipa__tirante', d: risco(n1, h1, n2, h2) }, g);
          el('path', { class: 'pipa__tirante', d: risco(n2, h1, n1, h2) }, g);
        });
      });

      // a linha desce até a mão de quem empina
      el('path', { class: 'pipa__linha', d: 'M170 187 C140 206 100 218 52 224' }, svg);

      // o convite vai amarrado no meio da linha
      el('path', { class: 'pipa__linha', d: 'M118 210 L114 218' }, svg);
      const carta = el('g', { class: 'flyer__letter' }, svg);
      el('rect', { x: 96, y: 218, width: 38, height: 25, rx: 3, fill: 'url(#papel)' }, carta);
      el('path', { class: 'flyer__flap', d: 'M96 220.5 L115 233.5 L134 220.5' }, carta);
      el('circle', { class: 'flyer__seal', cx: 115, cy: 234, r: 5 }, carta);
      return svg;
    };

    /* ── Noite: o pombo-correio traz o convite pela fita ── */
    const pombo = () => {
      const svg = moldura('-4deg');
      el('path', { class: 'flyer__trail', d: 'M12 206 C 70 202 106 186 130 166' }, svg);

      const g = el('g', { class: 'flyer__dove' }, svg);

      leque(el('g', { transform: 'translate(206 134) rotate(188)' }, g),
            [[-14, 46, 7], [0, 52, 7.6], [14, 47, 7]], 'pombo__cauda');

      el('path', {
        class: 'pombo__corpo',
        d: 'M118 122 C136 110 178 110 202 120 C210 124 215 128 216 134 ' +
           'C206 145 186 153 160 153 C136 153 118 145 112 134 C109 128 112 124 118 122 Z'
      }, g);
      el('circle', { class: 'pombo__corpo', cx: 107, cy: 120, r: 11 }, g);
      el('path', { class: 'pombo__bico', d: 'M97 118 L82 122 L97 126 Z' }, g);
      el('circle', { class: 'pombo__olho', cx: 104, cy: 116, r: 1.9 }, g);

      // penas quase paralelas: leque estreito lê como asa, não como crista
      const asa = el('g', { class: 'flyer__wing', transform: 'translate(170 130) rotate(121)' }, g);
      const plume = leque(asa, [[-9, 76, 12], [-4.5, 86, 12.5], [0, 94, 12.5], [4.5, 88, 12], [9, 78, 11.5]], 'flyer__plume');
      el('ellipse', { class: 'flyer__covert', cx: -20, cy: 1, rx: 24, ry: 14, transform: 'rotate(-3)' }, plume);

      el('path', { class: 'pombo__fita', d: 'M82 123 C66 140 60 160 70 176' }, g);
      const carta = el('g', { class: 'flyer__letter' }, g);
      el('rect', { x: 52, y: 174, width: 38, height: 26, rx: 3.5, fill: 'url(#papel)' }, carta);
      el('path', { class: 'flyer__flap', d: 'M52 176.5 L71 190 L90 176.5' }, carta);
      el('circle', { class: 'flyer__seal', cx: 71, cy: 191, r: 5.5 }, carta);
      return svg;
    };

    const cenas = {
      entardecer: {
        desenha: convite,
        longe: 'M0 220 L0 148 C 130 96 250 84 360 106 C 452 124 536 128 600 114 L600 220 Z',
        perto: 'M0 200 L0 128 C 150 44 330 38 470 82 C 520 98 566 104 600 100 L600 200 Z'
      },
      areia: {
        desenha: pipa,
        longe: 'M0 220 L0 160 C 90 108 172 104 252 132 C 332 160 420 92 510 100 C 546 103 576 112 600 122 L600 220 Z',
        perto: 'M0 200 L0 150 C 80 92 162 96 242 136 C 322 176 400 132 480 112 C 526 101 566 104 600 112 L600 200 Z'
      },
      azul: {
        desenha: pombo,
        longe: 'M0 220 L0 176 C 150 150 300 142 450 152 C 512 156 562 162 600 168 L600 220 Z',
        perto: 'M0 200 L0 166 C 120 128 262 124 402 142 C 472 151 546 158 600 156 L600 200 Z'
      }
    };

    return {
      aplicar(id) {
        const c = cenas[id] || cenas.entardecer;
        longe?.setAttribute('d', c.longe);
        perto?.setAttribute('d', c.perto);
        // elemento novo a cada troca: a animação de chegada reinicia sozinha
        palco?.replaceChildren(c.desenha());
      }
    };
  })();

  /* ── paletas de papel ──────────────────────────────────────────────── */
  (function paletas() {
    const botao = $('#palette');
    const nome = $('#palette-name');
    if (!botao || !nome) return;

    const opcoes = [
      { id: 'entardecer', rotulo: 'Entardecer', cor: '#f7e2c8' },
      { id: 'areia',      rotulo: 'Areia',      cor: '#ece4d7' },
      { id: 'azul',       rotulo: 'Azul claro', cor: '#e3eaf2' }
    ];

    const guardado = (() => {
      try { return localStorage.getItem('fidelis:paleta'); } catch { return null; }
    })();

    const escuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let atual = Math.max(0, opcoes.findIndex(o => o.id === (guardado || (escuro ? 'azul' : 'entardecer'))));

    const aplicar = () => {
      const o = opcoes[atual];
      document.documentElement.dataset.theme = o.id;
      nome.textContent = o.rotulo;
      cenario.aplicar(o.id);
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', o.cor);
      try { localStorage.setItem('fidelis:paleta', o.id); } catch { /* modo privado */ }
    };

    aplicar();
    botao.addEventListener('click', () => {
      atual = (atual + 1) % opcoes.length;
      aplicar();
    });
  })();

  /* ── e-mail ⇄ whatsapp ─────────────────────────────────────────────── */
  const seg = $('.seg');
  const campo = $('#contato');
  const rotulo = $('#rotulo');
  const erro = $('#erro');
  const form = $('#form');
  const done = $('#done');
  const doneLinha = $('#done-linha');

  const modos = {
    email: {
      rotulo: 'Seu e-mail',
      type: 'email',
      inputmode: 'email',
      autocomplete: 'email',
      placeholder: 'voce@exemplo.com',
      maxlength: '80',
      valida: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      recado: 'Confira o e-mail — parece que falta alguma coisa.',
      feito: 'O catálogo já está a caminho do seu e-mail.'
    },
    zap: {
      rotulo: 'Seu WhatsApp com DDD',
      type: 'tel',
      inputmode: 'tel',
      autocomplete: 'tel-national',
      placeholder: '(11) 91234-5678',
      maxlength: '16',
      valida: v => [10, 11].includes(v.replace(/\D/g, '').length),
      recado: 'Precisamos do DDD e do número completo.',
      feito: 'Mandamos o catálogo no seu WhatsApp agora mesmo.'
    }
  };

  let modo = 'email';

  const limpaErro = () => {
    erro.hidden = true;
    erro.textContent = '';
    campo.closest('.field').classList.remove('is-bad');
  };

  const trocar = (novo) => {
    if (novo === modo) return;
    modo = novo;
    const m = modos[modo];

    seg.dataset.mode = modo;
    seg.querySelectorAll('.seg__btn').forEach(b => {
      const ligado = b.dataset.mode === modo;
      b.classList.toggle('is-on', ligado);
      b.setAttribute('aria-selected', String(ligado));
    });

    rotulo.textContent = m.rotulo;
    campo.type = m.type;
    campo.inputMode = m.inputmode;
    campo.autocomplete = m.autocomplete;
    campo.placeholder = m.placeholder;
    campo.maxLength = Number(m.maxlength);
    campo.value = '';
    limpaErro();
    campo.focus();
  };

  seg.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.seg__btn');
    if (btn) trocar(btn.dataset.mode);
  });

  /* setas navegam entre as abas */
  seg.addEventListener('keydown', (ev) => {
    if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
    ev.preventDefault();
    const outro = modo === 'email' ? 'zap' : 'email';
    trocar(outro);
    seg.querySelector(`.seg__btn[data-mode="${outro}"]`).focus();
  });

  /* ── máscara do telefone ───────────────────────────────────────────── */
  const mascara = (bruto) => {
    const d = bruto.replace(/\D/g, '').slice(0, 11);
    if (!d) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    const corte = d.length <= 10 ? 6 : 7;
    return `(${d.slice(0, 2)}) ${d.slice(2, corte)}-${d.slice(corte)}`;
  };

  campo.addEventListener('input', () => {
    if (modo === 'zap') {
      const fim = campo.selectionStart === campo.value.length;
      campo.value = mascara(campo.value);
      if (fim) campo.setSelectionRange(campo.value.length, campo.value.length);
    }
    if (!erro.hidden) limpaErro();
  });

  /* ── envio ─────────────────────────────────────────────────────────── */
  const escondidos = ['.seg', '.field', '.note', '.cta'];

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const m = modos[modo];

    if (!m.valida(campo.value)) {
      erro.textContent = m.recado;
      erro.hidden = false;
      campo.closest('.field').classList.add('is-bad');
      campo.focus();
      return;
    }

    limpaErro();
    escondidos.forEach(sel => { $(sel, form).hidden = true; });
    doneLinha.textContent = m.feito;
    done.hidden = false;
    done.querySelector('.done__back').focus();
  });

  $('#refazer').addEventListener('click', () => {
    done.hidden = true;
    escondidos.forEach(sel => { $(sel, form).hidden = false; });
    campo.focus();
    campo.select();
  });

  /* ── paralaxe: a cena do postal segue o cursor de longe ────────────── */
  (function paralaxe() {
    const cartao = $('.card');
    const cena = $('.poster__scene');
    if (!cartao || !cena) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let pendente = 0;

    cartao.addEventListener('pointermove', (ev) => {
      if (pendente) return;
      pendente = requestAnimationFrame(() => {
        pendente = 0;
        const r = cartao.getBoundingClientRect();
        cena.style.setProperty('--px', ((ev.clientX - r.left) / r.width - 0.5).toFixed(3));
        cena.style.setProperty('--py', ((ev.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    });

    const repousar = () => {
      cena.style.setProperty('--px', '0');
      cena.style.setProperty('--py', '0');
    };
    cartao.addEventListener('pointerleave', repousar);
    cartao.addEventListener('pointercancel', repousar);
  })();

  /* ── Esc fecha a dica aberta ───────────────────────────────────────── */
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && document.activeElement?.classList.contains('tip')) {
      document.activeElement.blur();
    }
  });
})();
