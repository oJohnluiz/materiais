---
name: animacao-em-codigo
description: Cria animações e vídeos (cenas 3D, aulas animadas, motion graphics, reels verticais) inteiramente em código, com HTML, canvas e CSS, e exporta em MP4 com Playwright e ffmpeg. Use quando o pedido for "faz uma animação", "cria um vídeo", "anima essa ideia" ou "transforma isso numa aula animada".
---

# Animação em código

Você transforma uma frase em um vídeo pronto, sem After Effects e sem Blender. Tudo é uma página HTML que desenha cada quadro a partir do tempo `t`, e um script grava os quadros e monta o MP4.

## 1. Entenda o pedido (no máximo 2 perguntas)

Se faltar, pergunte só:
- Formato: vertical 1080x1920 (Reels/TikTok/Shorts, padrão) ou horizontal 1920x1080 (YouTube).
- Duração: o padrão é 10 segundos.

Se o pedido for claro, não pergunte nada e comece.

## 2. Planeje as cenas antes do código

Escreva uma lista curta, com o tempo de cada cena, por exemplo:
- 0–3s: a cidade aparece em linhas e vai acendendo.
- 3–7s: câmera anda pela rua, chuva e neon refletindo no chão.
- 7–10s: um carro passa com o farol acendendo o asfalto.

Mostre a lista e siga, a menos que a pessoa queira mudar.

## 3. Construa a animação (regras)

Crie a pasta `animacao/` com `index.html`, `render.js` e `README.md`.

O `index.html`:
- Tem o tamanho exato do vídeo (`width`/`height` no body e no canvas).
- Expõe `window.TOTAL` (duração em segundos) e `window.render(t)`, que desenha o quadro do tempo `t`.
- **Não usa** `requestAnimationFrame`, `Date.now()`, `Math.random()` solto nem transições CSS automáticas. Tudo depende só de `t`. Para aleatoriedade, use um gerador com semente fixa (ex.: `let s=7; const rnd=()=>(s=s*16807%2147483647)/2147483647;`).
- Inclui um modo de pré-visualização: se a URL tiver `?play`, roda `render` em loop com o relógio, só para olhar no navegador.

Técnicas que deixam bonito:
- **3D sem biblioteca**: projeção em perspectiva `x' = cx + f*x/z`, `y' = cy - f*(y-alturaCamera)/z`; desenhe do mais longe para o mais perto.
- **Neon**: `ctx.shadowBlur` + `ctx.shadowColor` com a cor do letreiro, e `globalCompositeOperation='lighter'` para o brilho somar.
- **Chão molhado**: desenhe as luzes de novo espelhadas (`y → -y`) num canvas separado, aplique `filter='blur(6px)'` e cole por cima do chão algumas vezes, um pouco deslocado para baixo.
- **Chuva**: centenas de riscos finos cuja posição vem de `(y0 + velocidade*t) % altura`.
- **Neblina**: misture a cor de cada objeto com a cor do céu conforme a distância.
- **Movimento**: use easing (`easeOutCubic`, `easeInOutCubic`), nunca movimento linear em textos e cards.
- **Texto na tela**: uma linha por vez, fonte grossa, sombra escura, sempre a pelo menos 60px da borda.
- **Aula animada**: congele a cena, escureça o fundo e desenhe setas, ângulos e rótulos por cima, um de cada vez.

## 4. Grave o vídeo

`render.js` (Node + Playwright):

```js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/index.html');
  await p.evaluate(() => document.fonts.ready);
  const total = await p.evaluate(() => TOTAL), fps = 30;
  require('fs').mkdirSync(__dirname + '/frames', { recursive: true });
  for (let i = 0; i < Math.ceil(total * fps); i++) {
    await p.evaluate(t => render(t), i / fps);
    await p.screenshot({ path: `${__dirname}/frames/${String(i).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  await b.close();
})();
```

Depois:

```bash
npm i playwright && npx playwright install chromium
node render.js
ffmpeg -y -framerate 30 -i frames/%05d.jpg -c:v libx264 -crf 18 -pix_fmt yuv420p video.mp4
```

Se a pessoa mandar um áudio (narração ou música), junte com `-i audio.m4a -c:a aac -shortest`.

## 5. Confira antes de entregar

- Tire 4 ou 5 prints em tempos diferentes (`render(t)` + screenshot) e olhe: texto cortado, coisa sobrando na borda, cena vazia.
- Corrija e só então grave o vídeo inteiro.
- Entregue o `video.mp4` e diga em uma frase como mudar algo (ex.: "troque a cor do neon na linha 12").

## 6. Pedidos de mudança

"Coloca um carro passando", "deixa mais lento", "muda pra aula": altere só o que foi pedido, mostre um print do quadro novo e grave de novo.
