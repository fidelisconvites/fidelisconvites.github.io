# Fidelis Convites

Landing de tela única no formato de um cartão-postal: o pôster ilustrado à
esquerda, a franquia postal e o formulário à direita. Estrutura e linguagem de
interação inspiradas em [atmosphereconf.org](https://atmosphereconf.org/).

## Rodar

Qualquer servidor estático serve — não há build:

```bash
python3 -m http.server 8777
```

Depois abra <http://127.0.0.1:8777/>.

## Arquivos

| Arquivo            | O que guarda                                              |
| ------------------ | --------------------------------------------------------- |
| `index.html`       | Marcação e as ilustrações em SVG (convite alado, carimbo)  |
| `assets/style.css` | Paletas, layout, tipografia e toda a coreografia           |
| `assets/app.js`    | Cenas, selos, paletas, formulário, máscara e paralaxe      |
| `assets/img/`      | Logos oficiais (marinho, azul claro e areia)               |

## Identidade

As cores saem do logo oficial em `assets/img/`: marinho `#2F4A6F`, azul claro
`#97B2CE`, areia `#C4B4A6` e o off-white `#F6F5F1`. A paleta Entardecer sai do
mesmo tronco, puxada para o sol baixo de fim de tarde. O brasão aparece na marca do
topo, no favicon e como o primeiro desenho do selo. Tipografia: **Bricolage
Alfa Slab One** na manchete, um slab de cartaz setentista;
**Playfair Display** na marca, nos títulos de seção e no selo, conversando com
o serif do brasão; **Parisienne** na caligrafia dos convites; **DM Sans** no
corpo.

As três paletas são retrô, com as cores tiradas de `flyer-bg-blue.png`:
magenta `#951B52`, laranja `#EC6623` e oliva `#585A21`.

| Paleta     | Dupla                                   |
| ---------- | --------------------------------------- |
| Entardecer | laranja queimado + magenta sobre creme  |
| Areia      | abacate + mostarda sobre aveia          |
| Azul claro | turquesa + laranja, sobre o deserto     |

Na manchete, "Para" leva sombra deslocada — o truque de cartaz que data a peça.
As três palavras têm tokens próprios (`--titulo-1/2/3` e `--titulo-2-sombra`),
então cada paleta rege o seu contraste.

## Paletas

O botão no topo direito alterna **Entardecer**, **Areia** e **Azul claro**. Cada
uma é um bloco de custom properties em `:root[data-theme="…"]`; a escolha fica no
`localStorage` e, na primeira visita, quem prefere tema escuro começa em Azul
claro.

Trocar de paleta troca a **arte**, não só as cores — cada uma tem a sua cena no
pôster e o seu recorte de colinas:

| Paleta     | Cenário                                    | Quem leva o convite                   |
| ---------- | ------------------------------------------ | ------------------------------------- |
| Entardecer | céu liso de fim de tarde                   | o convite alado                       |
| Areia      | céu liso                                   | uma pipa caixa com o convite na linha |
| Azul claro | a foto `assets/bg-desert.png`              | o pombo-correio puxando a fita        |

Só a paleta Azul claro veste o fundo com foto. O PNG tem o céu recortado — é só
a paisagem, metade da imagem em transparência — o que permite empilhar assim:

| Camada          | z-index | O quê                                  |
| --------------- | ------- | -------------------------------------- |
| `body`          | —       | o céu, em degradê                      |
| `.sky`          | 0       | as nuvens                              |
| `.fundo`        | 1       | o deserto recortado                    |
| `.stage`        | 2       | o cartão                               |
| `.topbar`       | 3       | a marca                                |

Com o deserto por cima das nuvens, elas passam atrás dos cactos e das mesas e
somem ao cruzar o horizonte, sem precisar de máscara. A imagem entra inteira,
encaixada pela largura (`100% auto`) e ancorada embaixo, então nada se perde nas
laterais e a vegetação assenta na base da página.

O degradê do céu usa os tons medidos na foto original: `#01718a` no zênite,
`#038daa` (o azul da marca), `#2da6bb` no meio e `#6bb6bb` na bruma do
horizonte. A terracota de acento também saiu da imagem.

Sobre esse céu a marca vai branca: a logo é uma cor sólida sobre transparência,
então `filter: brightness(0) invert(1)` basta, sem precisar de outro arquivo.

A pipa é desenhada por projeção axonométrica: dois vetores horizontais e a
altura geram os quatro cantos, e daí saem as velas, as varas e os tirantes.

## Selos

O selo é um botão: cada clique carimba o desenho seguinte da cartela — o brasão
oficial, o monograma entre ramos de louro, alianças entrelaçadas, ramalhete de
primavera e os quinze anos. Os desenhos são montados em SVG por `app.js`; o serrilhado do papel é um
`path` único, o que deixa a sombra acompanhar cada dente.

## Movimento

O céu é **um só**. As nuvens estão declaradas duas vezes no HTML — uma camada
no fundo e outra dentro do pôster — para que nasçam no mesmo instante e andem
em fase. A de dentro é ancorada às coordenadas do viewport (medidas por
`offsetLeft`/`offsetTop`, imunes ao `transform` da entrada do cartão) e
recortada pelo pôster, de modo que a nuvem atravessa a borda em vez de sumir
nela. A deriva é só `transform`, para o quadro sair da CPU.

A entrada é escalonada: o cartão pousa, o conteúdo sobe em sequência, o convite
chega voando, o carimbo entinta e o selo é prensado. Em repouso, as nuvens
atravessam o céu, as penas batem devagar e a cena do pôster segue o cursor de
leve. Tudo isso é desligado em `prefers-reduced-motion: reduce`, e as nuvens
então descansam em posições fixas.

## Formulário

Alterna entre e-mail e WhatsApp — troca rótulo, `type`, `inputmode`,
`autocomplete` e placeholder, valida conforme o modo e aplica máscara
`(00) 00000-0000` no telefone. Não há back-end: o envio mostra o estado de
confirmação com um lacre e um link para corrigir o endereço.

O WhatsApp do ateliê (`wa.me/5587999617324`, com a mensagem já escrita) está no
link do rodapé e, no modo WhatsApp, num botão dentro da confirmação.
