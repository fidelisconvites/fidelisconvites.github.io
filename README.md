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
Grotesque** no display e **DM Sans** no corpo — as mesmas famílias do site que
serviu de referência.

## Paletas

O botão no topo direito alterna **Entardecer**, **Areia** e **Azul claro**. Cada
uma é um bloco de custom properties em `:root[data-theme="…"]`; a escolha fica no
`localStorage` e, na primeira visita, quem prefere tema escuro começa em Azul
claro.

Trocar de paleta troca a **arte**, não só as cores — cada uma tem a sua cena no
pôster e o seu recorte de colinas:

| Paleta     | Quem leva o convite                        |
| ---------- | ------------------------------------------ |
| Entardecer | o convite alado                            |
| Areia      | uma pipa caixa com o convite na linha      |
| Azul claro | o pombo-correio puxando a fita             |

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
