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

  /* ── desenho botânico em linha, para a peça de convite ───────────── */

  /* Gota apontando para cima, com a raiz na origem: serve de pétala e de folha. */
  const gota = (L, w) =>
    `M0 0 C${(-w).toFixed(1)} ${(-L * 0.34).toFixed(1)},` +
    `${(-w * 0.92).toFixed(1)} ${(-L * 0.76).toFixed(1)},0 ${(-L).toFixed(1)} ` +
    `C${(w * 0.92).toFixed(1)} ${(-L * 0.76).toFixed(1)},` +
    `${w.toFixed(1)} ${(-L * 0.34).toFixed(1)},0 0 Z`;

  const folha = (pai, { x, y, L, giro = 0 }) => {
    const g = el('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${giro.toFixed(1)})` }, pai);
    el('path', { class: 'traco', d: gota(L, L * 0.27) }, g);
    el('path', { class: 'traco nervura', d: `M0 -${(L * 0.12).toFixed(1)} L0 -${(L * 0.88).toFixed(1)}` }, g);
    return g;
  };

  const flor = (pai, { x, y, r, petalas = 5, giro = 0 }) => {
    const g = el('g', { transform: `translate(${x} ${y}) rotate(${giro})` }, pai);
    for (let i = 0; i < petalas; i++) {
      el('path', { class: 'traco', d: gota(r, r * 0.5), transform: `rotate(${(i * 360 / petalas).toFixed(1)})` }, g);
    }
    for (let i = 0; i < petalas; i++) {
      const a = i * 360 / petalas + 180 / petalas;
      el('path', { class: 'traco estame', d: `M0 0 L0 -${(r * 0.36).toFixed(1)}`, transform: `rotate(${a.toFixed(1)})` }, g);
    }
    el('circle', { class: 'miolo', r: (r * 0.14).toFixed(1) }, g);
    return g;
  };

  /* Rosa: um miolo em espiral aberta, cercado por pétalas soltas. */
  const rosa = (pai, { x, y, escala = 1, giro = 0 }) => {
    const g = el('g', { transform: `translate(${x} ${y}) rotate(${giro}) scale(${escala})` }, pai);
    el('path', { class: 'traco', d: 'M1 1 C4 -2,8 0,8 4 C8 9,2 12,-3 10 C-10 7,-12 -1,-8 -8 C-3 -15,7 -17,14 -11 C21 -4,20 8,13 15' }, g);
    el('path', { class: 'traco', d: 'M-14 11 C-22 3,-21 -11,-11 -18' }, g);
    el('path', { class: 'traco', d: 'M-8 -20 C2 -25,14 -22,20 -13' }, g);
    el('path', { class: 'traco', d: 'M22 -9 C27 1,26 13,18 19' }, g);
    el('path', { class: 'traco', d: 'M15 21 C6 26,-6 24,-13 16' }, g);
    return g;
  };

  const baga = (pai, { x, y, giro = 0, escala = 1 }) => {
    const g = el('g', { transform: `translate(${x} ${y}) rotate(${giro}) scale(${escala})` }, pai);
    el('path', { class: 'traco', d: 'M0 0 C2 -5,1 -10,-1 -14 M0 0 C-3 -4,-5 -8,-5 -13 M0 0 C3 -4,6 -7,8 -11' }, g);
    [[-1, -15], [-5.5, -14], [8.6, -12]].forEach(([bx, by]) =>
      el('circle', { class: 'baga', cx: bx, cy: by, r: 1.9 }, g));
    return g;
  };

  /* Ramo: um caule quadrático com folhas alternadas ao longo dele. */
  const ramo = (pai, { x, y, giro = 0, comp = 60, folhas = 5, escala = 1, curva = 0.34 }) => {
    const g = el('g', { transform: `translate(${x} ${y}) rotate(${giro}) scale(${escala})` }, pai);
    const P1 = [comp * curva, -comp * 0.5];
    const P2 = [comp * curva * 0.45, -comp];

    el('path', { class: 'traco caule', d: `M0 0 Q${P1[0].toFixed(1)} ${P1[1].toFixed(1)} ${P2[0].toFixed(1)} ${P2[1].toFixed(1)}` }, g);

    for (let i = 1; i <= folhas; i++) {
      const t = i / (folhas + 0.55);
      const u = 1 - t;
      const px = 2 * u * t * P1[0] + t * t * P2[0];
      const py = 2 * u * t * P1[1] + t * t * P2[1];
      const tx = 2 * u * P1[0] + 2 * t * (P2[0] - P1[0]);
      const ty = 2 * u * P1[1] + 2 * t * (P2[1] - P1[1]);
      const tangente = Math.atan2(ty, tx) * 180 / Math.PI + 90;
      const lado = i % 2 ? -1 : 1;
      folha(g, { x: px, y: py, L: comp * 0.29 * (1 - t * 0.4), giro: tangente + lado * 44 });
    }
    return g;
  };

  /* ── a cena do postal ───────────────────────────────────────────────
     Cada paleta tem a sua: quem leva o convite muda junto com o papel. */
  const cenario = (() => {
    const palco = $('.flyer-wrap');
    const longe = $('.hill--far path');
    const perto = $('.hill--near path');

    const moldura = (tilt, vb = '0 0 340 250') => {
      const svg = el('svg', { class: 'flyer', viewBox: vb, 'aria-hidden': 'true' });
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

    /* ── As peças de convite ────────────────────────────────────────
       Mesmo papel, mesma caligrafia; o que muda é o ornamento botânico
       e o texto. Cada paleta leva a sua. */

    const pecaConvite = ({ ornamento, olho, nomes, data, pe, pos, grao, remate }) => {
      const svg = moldura('-3deg', '0 0 300 390');
      svg.classList.add('flyer--convite');

      const clip = el('clipPath', { id: 'recorte-convite' }, svg.querySelector('defs'));
      el('rect', { x: 22, y: 14, width: 256, height: 362 }, clip);

      const cartao = el('g', { class: 'convite' }, svg);
      el('rect', { class: 'convite__papel', x: 22, y: 14, width: 256, height: 362, fill: 'url(#papel)' }, cartao);

      const jardim = el('g', { class: 'convite__jardim', 'clip-path': 'url(#recorte-convite)' }, cartao);
      ornamento(jardim);

      /* grão de papel: o mesmo ruído que dá textura ao pôster, bem mais fraco */
      if (grao) {
        const f = el('filter', { id: 'grao-convite', x: '0%', y: '0%', width: '100%', height: '100%' },
                     svg.querySelector('defs'));
        el('feTurbulence', { type: 'fractalNoise', baseFrequency: '.9', numOctaves: '3' }, f);
        el('feColorMatrix', { type: 'saturate', values: '0' }, f);
        el('rect', { class: 'convite__grao', x: 22, y: 14, width: 256, height: 362, filter: 'url(#grao-convite)' }, cartao);
      }

      const escreve = (classe, x, y, texto) => {
        const t = el('text', { class: `${classe} surge`, x, y, 'text-anchor': 'middle' }, cartao);
        t.textContent = texto;
      };

      olho.forEach((linha, i) => escreve('convite__olho', 150, pos.olho + i * 14, linha));
      escreve('convite__nome', pos.n1x, pos.n1, nomes[0]);
      escreve('convite__e', pos.ex, pos.e, '&');
      escreve('convite__nome', pos.n2x, pos.n2, nomes[1]);
      if (pos.regua) el('path', { class: 'convite__regua surge', d: `M118 ${pos.regua} L182 ${pos.regua}` }, cartao);
      escreve('convite__data', 150, pos.data, data);
      if (pe) escreve('convite__pe', 150, pos.pe, pe);

      if (remate) remate(cartao);

      /* a escrita surge depois dos traços, de cima para baixo */
      [...cartao.querySelectorAll('.surge')].forEach((n, i) => {
        n.style.animationDelay = `${(1.3 + i * 0.1).toFixed(2)}s`;
      });

      return svg;
    };

    /* — Jardim: buquê transbordando o canto de cima, eco no pé — */
    const jardimCanto = (j) => {
      ramo(j, { x: 128, y: 24, giro: 112, comp: 84, folhas: 6 });
      ramo(j, { x: 100, y: 66, giro: 58, comp: 96, folhas: 7 });
      ramo(j, { x: 28, y: 84, giro: -82, comp: 66, folhas: 5 });
      ramo(j, { x: 62, y: 142, giro: -24, comp: 88, folhas: 6 });
      ramo(j, { x: 40, y: 30, giro: 22, comp: 62, folhas: 5 });
      ramo(j, { x: 150, y: 58, giro: 130, comp: 72, folhas: 5 });
      ramo(j, { x: 160, y: 28, giro: 118, comp: 66, folhas: 5 });
      rosa(j, { x: 60, y: 66, escala: 1.65, giro: -12 });
      rosa(j, { x: 24, y: 132, escala: 1.0, giro: 34 });
      flor(j, { x: 112, y: 36, r: 19, giro: 14 });
      flor(j, { x: 30, y: 98, r: 13, giro: -22 });
      flor(j, { x: 134, y: 90, r: 11, giro: 42 });
      flor(j, { x: 80, y: 20, r: 10, giro: -8 });
      flor(j, { x: 174, y: 50, r: 9, giro: 24 });
      baga(j, { x: 50, y: 162, giro: 16 });
      baga(j, { x: 148, y: 56, giro: -44 });
      baga(j, { x: 20, y: 60, giro: 8 });

      ramo(j, { x: 258, y: 330, giro: 168, comp: 72, folhas: 6 });
      ramo(j, { x: 278, y: 356, giro: -112, comp: 58, folhas: 5 });
      ramo(j, { x: 236, y: 362, giro: -168, comp: 48, folhas: 4 });
      rosa(j, { x: 268, y: 364, escala: 1.2, giro: 172 });
      flor(j, { x: 234, y: 378, r: 13, giro: -16 });
      flor(j, { x: 276, y: 320, r: 10, giro: 30 });
      baga(j, { x: 228, y: 340, giro: -156 });
    };

    /* — Arco: uma guirlanda aberta por cima dos nomes — */
    const arcoFlorido = (j) => {
      const cx = 150, cy = 150, rx = 98, ry = 92;
      const ponto = (a) => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
      const tangente = (a) => Math.atan2(ry * Math.cos(a), -rx * Math.sin(a)) * 180 / Math.PI;

      const n = 30;
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const a = Math.PI + t * Math.PI;
        const [px, py] = ponto(a);
        const lado = i % 2 ? 1 : -1;
        folha(j, { x: px, y: py, L: 12 + 7 * Math.sin(t * Math.PI), giro: tangente(a) + 90 + lado * 54 });
      }
      [0.1, 0.32, 0.5, 0.68, 0.9].forEach((t, k) => {
        const [px, py] = ponto(Math.PI + t * Math.PI);
        flor(j, { x: px, y: py, r: k === 2 ? 15 : 10.5, giro: t * 200 });
      });
      rosa(j, { x: cx - rx + 4, y: cy - 12, escala: 1.25, giro: -28 });
      rosa(j, { x: cx + rx - 4, y: cy - 12, escala: 1.1, giro: 208 });
      baga(j, { x: cx - 54, y: cy - 74, giro: -34 });
      baga(j, { x: cx + 56, y: cy - 72, giro: 36 });

      ramo(j, { x: 150, y: 352, giro: 104, comp: 42, folhas: 4 });
      ramo(j, { x: 150, y: 352, giro: -104, comp: 42, folhas: 4 });
      flor(j, { x: 150, y: 350, r: 8.5 });
    };

    /* — Moldura: fio duplo, cantos guarnecidos e lacre no pé — */
    const molduraFina = (j) => {
      const E = 46, D = 254, T = 42, B = 348;
      const fio = (d, extra = '') => el('path', { class: `traco fio ${extra}`, d }, j);

      /* o fio externo abre no topo, no pé e no meio das laterais */
      fio(`M${E} ${T} L118 ${T}`);
      fio(`M182 ${T} L${D} ${T}`);
      fio(`M${E} ${B} L118 ${B}`);
      fio(`M182 ${B} L${D} ${B}`);
      fio(`M${E} ${T} L${E} 176`);
      fio(`M${E} 214 L${E} ${B}`);
      fio(`M${D} ${T} L${D} 176`);
      fio(`M${D} 214 L${D} ${B}`);
      fio(`M${E + 5} ${T + 5} L${D - 5} ${T + 5} L${D - 5} ${B - 5} L${E + 5} ${B - 5} Z`, 'fio--fino');

      /* guarnição dos quatro cantos, espelhada */
      const canto = (x, y, ex, ey) => {
        const g = el('g', { transform: `translate(${x} ${y}) scale(${ex} ${ey})` }, j);
        ramo(g, { x: 4, y: 4, giro: 133, comp: 48, folhas: 4, escala: .82 });
        ramo(g, { x: 4, y: 4, giro: 168, comp: 34, folhas: 3, escala: .76 });
        ramo(g, { x: 4, y: 4, giro: 98, comp: 32, folhas: 3, escala: .74 });
        flor(g, { x: 11, y: 11, r: 7.5 });
        el('circle', { class: 'baga', cx: 3, cy: 3, r: 2 }, g);
      };
      canto(E, T, 1, 1);
      canto(D, T, -1, 1);
      canto(E, B, 1, -1);
      canto(D, B, -1, -1);

      /* folhas rompendo as laterais, na folga do fio */
      [[E, 1], [D, -1]].forEach(([x, lado]) => {
        const g = el('g', { transform: `translate(${x} 195) scale(${lado} 1)` }, j);
        folha(g, { x: 0, y: 0, L: 17, giro: 78 });
        folha(g, { x: 0, y: 0, L: 13, giro: 116 });
        el('circle', { class: 'baga', cx: 2, cy: -9, r: 2 }, g);
      });

      /* ramo e botão no topo */
      ramo(j, { x: 150, y: T, giro: 92, comp: 40, folhas: 4, escala: .95 });
      ramo(j, { x: 150, y: T, giro: -92, comp: 40, folhas: 4, escala: .95 });
      flor(j, { x: 150, y: T, r: 10 });
      baga(j, { x: 150, y: T - 13, giro: 0, escala: .8 });

      /* divisor entre os nomes e a data */
      fio('M100 280 L134 280 M166 280 L200 280');
      folha(j, { x: 139, y: 280, L: 10, giro: -92 });
      folha(j, { x: 161, y: 280, L: 10, giro: 92 });
      el('rect', { class: 'losango', x: 146, y: 276, width: 8, height: 8, transform: 'rotate(45 150 280)' }, j);

      /* ramos pequenos ladeando o lacre, no pé */
      ramo(j, { x: 128, y: B, giro: -104, comp: 26, folhas: 3, escala: .8 });
      ramo(j, { x: 172, y: B, giro: 104, comp: 26, folhas: 3, escala: .8 });
    };

    /* o lacre entra por último, depois da escrita: é o que fecha a peça */
    const lacre = (cartao) => {
      const g = el('g', { class: 'convite__lacre surge', transform: 'translate(150 348) rotate(-7)' }, cartao);
      el('circle', { class: 'lacre__cera', r: 15.5 }, g);
      el('circle', { class: 'lacre__borda', r: 11.5 }, g);
      const t = el('text', { class: 'lacre__letra', y: 5.4, 'text-anchor': 'middle' }, g);
      t.textContent = 'F';
    };

    const convite = () => pecaConvite({
      ornamento: jardimCanto,
      olho: ['COM ALEGRIA CONVIDAMOS', 'PARA O NOSSO CASAMENTO'],
      nomes: ['Alice', 'Otávio'],
      data: '12 · DEZEMBRO · 2026',
      pos: { olho: 176, n1x: 130, n1: 246, ex: 126, e: 268, n2x: 172, n2: 300, regua: 324, data: 344 }
    });

    const conviteArco = () => pecaConvite({
      ornamento: arcoFlorido,
      olho: ['CONVITE DE CASAMENTO'],
      nomes: ['Beatriz', 'Henrique'],
      data: '04 · ABRIL · 2026',
      pos: { olho: 118, n1x: 150, n1: 202, ex: 150, e: 226, n2x: 150, n2: 262, regua: 292, data: 312 }
    });

    const conviteMoldura = () => pecaConvite({
      ornamento: molduraFina,
      olho: ['GUARDE A DATA', 'DO NOSSO CASAMENTO'],
      nomes: ['Lívia', 'Caio'],
      data: '27 · SETEMBRO · 2026',
      pe: 'ÀS DEZESSETE HORAS',
      grao: true,
      remate: lacre,
      pos: { olho: 112, n1x: 150, n1: 190, ex: 150, e: 214, n2x: 150, n2: 250, regua: null, data: 302, pe: 320 }
    });

    const cenas = {
      entardecer: {
        desenha: convite,
        longe: 'M0 220 L0 148 C 130 96 250 84 360 106 C 452 124 536 128 600 114 L600 220 Z',
        perto: 'M0 200 L0 128 C 150 44 330 38 470 82 C 520 98 566 104 600 100 L600 200 Z'
      },
      areia: {
        desenha: conviteArco,
        longe: 'M0 220 L0 160 C 90 108 172 104 252 132 C 332 160 420 92 510 100 C 546 103 576 112 600 122 L600 220 Z',
        perto: 'M0 200 L0 150 C 80 92 162 96 242 136 C 322 176 400 132 480 112 C 526 101 566 104 600 112 L600 200 Z'
      },
      azul: {
        desenha: conviteMoldura,
        longe: 'M0 220 L0 176 C 150 150 300 142 450 152 C 512 156 562 162 600 168 L600 220 Z',
        perto: 'M0 200 L0 166 C 120 128 262 124 402 142 C 472 151 546 158 600 156 L600 200 Z'
      }
    };

    /* Os traços do desenho botânico se fazem sozinhos: só dá para medir o
       comprimento de um path depois que ele está no documento. */
    const parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desenhar = (raiz) => {
      if (!raiz || parado) return;
      const tracos = raiz.querySelectorAll('.traco');
      if (!tracos.length) return;
      // o passo é proporcional: o desenho inteiro sai em ~1,4s, seja qual for
      // o número de traços, em vez de arrastar por vários segundos
      const passo = 1400 / tracos.length;
      tracos.forEach((p, i) => {
        const L = p.getTotalLength();
        if (!L) return;
        p.style.strokeDasharray = L;
        p.animate(
          [{ strokeDashoffset: L }, { strokeDashoffset: 0 }],
          { duration: 520, delay: 340 + i * passo, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'both' }
        );
      });
    };

    return {
      aplicar(id) {
        const c = cenas[id] || cenas.entardecer;
        longe?.setAttribute('d', c.longe);
        perto?.setAttribute('d', c.perto);
        // elemento novo a cada troca: a animação de chegada reinicia sozinha
        palco?.replaceChildren(c.desenha());
        desenhar(palco);
      }
    };
  })();

  /* ── um céu só ──────────────────────────────────────────────────────
     As duas camadas de nuvens estão declaradas no HTML, lado a lado, para
     nascerem no mesmo instante — sincronizá-las depois seria frágil. Aqui
     só ancoramos a de dentro às coordenadas do viewport, de modo que a
     nuvem atravesse a borda do cartão em vez de sumir nela. */
  (function ceu() {
    const poster = $('.poster');
    if (!poster || !$('.sky--poster')) return;

    /* getBoundingClientRect() erraria aqui: a entrada do cartão anima um
       transform, e a medida sairia deslocada. offsetLeft/offsetTop dão a
       posição de layout, que nenhum transform contamina. */
    let pendente = 0;
    const medir = () => {
      pendente = 0;
      let x = 0, y = 0;
      for (let n = poster; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
      poster.style.setProperty('--poster-left', `${x - scrollX}px`);
      poster.style.setProperty('--poster-top', `${y - scrollY}px`);
    };
    const agendar = () => { if (!pendente) pendente = requestAnimationFrame(medir); };

    medir();
    addEventListener('resize', agendar);
    addEventListener('scroll', agendar, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(agendar).observe(poster);
    document.fonts?.ready.then(medir);
  })();

  /* ── paletas de papel ──────────────────────────────────────────────── */
  (function paletas() {
    const botao = $('#palette');
    const nome = $('#palette-name');
    if (!botao || !nome) return;

    const opcoes = [
      { id: 'entardecer', rotulo: 'Entardecer', cor: '#ffffff' },
      { id: 'areia',      rotulo: 'Areia',      cor: '#eae3c6' },
      { id: 'azul',       rotulo: 'Azul claro', cor: '#038daa' }
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
  const abrirZap = $('#abrir-zap');

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
    // no modo WhatsApp a conversa fica a um clique
    if (abrirZap) abrirZap.hidden = modo !== 'zap';
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
