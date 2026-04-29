const board = document.getElementById("gameBoard");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function equationHTML(text) {
  return `<div class="equation-face"><div class="math-inner">${text}</div></div>`;
}

function svgArrow(x, yStart, direction, length) {
  const headLength = 5;
  const headWidth = 3;

  const yTip = direction === "up"
    ? yStart - length
    : yStart + length;

  const shaftEnd = direction === "up"
    ? yTip + headLength
    : yTip - headLength;

  // thin shaft
  const line = `
    <line
      x1="${x}" y1="${yStart}"
      x2="${x}" y2="${shaftEnd}"
      stroke="black"
      stroke-width="1.4"
      stroke-linecap="round"
    />
  `;

  // sharper triangular head
  const head = direction === "up"
    ? `
      <polygon
        points="
          ${x},${yTip}
          ${x - headWidth},${yTip + headLength}
          ${x + headWidth},${yTip + headLength}
        "
        fill="black"
      />
    `
    : `
      <polygon
        points="
          ${x},${yTip}
          ${x - headWidth},${yTip - headLength}
          ${x + headWidth},${yTip - headLength}
        "
        fill="black"
      />
    `;

  return line + head;
}

function portraitCard({ f, equilibria, ticks = [], samples, yMin = -2, yMax = 2 })
 {
  const width = 180;
  const height = 260;

  const lineX = 78;
  const arrowX = 112;

  const top = 18;
  const bottom = 242;

  function toPixel(y) {
    return bottom - ((y - yMin) / (yMax - yMin)) * (bottom - top);
  }

  function arrowLength(value) {
    const absVal = Math.abs(value);
    return Math.min(18 * Math.sqrt(absVal), 20);
  }

  const phaseLine = `
    <line x1="${lineX}" y1="${top}" x2="${lineX}" y2="${bottom}"
      stroke="black" stroke-width="2.5" stroke-linecap="round" />
  `;

  const arrows = samples.map((y) => {
    const value = f(y);
    if (Math.abs(value) < 1e-8) return "";

    const direction = value > 0 ? "up" : "down";
    const len = arrowLength(value);

    return svgArrow(arrowX, toPixel(y), direction, len);
  }).join("");

  const dots = equilibria.map((eq) => {
    const py = toPixel(eq.value);
    return `
      <circle cx="${lineX}" cy="${py}" r="5.5" fill="black" />
     
	<text
  	x="${lineX - 12}"
  	y="${py + 5}"
  	text-anchor="end"

        font-family="Times New Roman, Times, serif"
        font-size="18">${eq.label}</text>
    `;
  }).join("");

const equilibriumMarks = equilibria.map((eq) => {
  const py = toPixel(eq.value);

  return `
    <line
      x1="${lineX - 5}" y1="${py}"
      x2="${lineX + 5}" y2="${py}"
      stroke="black"
      stroke-width="1.4"
    />
  `;
}).join("");

const tickMarks = ticks.map((t) => {
  const py = toPixel(t.value);

  return `
    <line
      x1="${lineX - 5}" y1="${py}"
      x2="${lineX + 5}" y2="${py}"
      stroke="black"
      stroke-width="1.2"
    />
  `;
}).join("");

const tickLabels = ticks.map((t) => {
  const py = toPixel(t.value);

  return `
    <text
      x="${lineX - 12}"
 	y="${py + 5}" text-anchor="end"
      font-family="Times New Roman, Times, serif"
      font-size="16"
      fill="#555"
    >${t.label}</text>
  `;
}).join("");

  return `
    <div class="portrait-face">
      <svg viewBox="0 0 ${width} ${height}">
        ${phaseLine}
        ${arrows}
        ${dots}
	${tickLabels}
	${tickMarks}
	${tickLabels}
      </svg>
    </div>
  `;
}

const pairs = [

{
  pairId: "saddle-2d",
  equation: "\\( \\begin{aligned}\\dot{x}&=x \\\\ \\dot{y}&=-y \\end{aligned}\\)",
  image: "portraits/saddle.png"
},
{
  pairId: "stable-node-2d",
  equation: "\\( \\begin{aligned} \\dot{x}&=x \\\\ \\dot{y}&=-2y \\end{aligned} \\)",
  image: "portraits/stable-node.png"
},
{
  pairId: "unstable-node-2d",
  equation: "\\( \\begin{aligned}\\dot{x}&=x \\\\ \\dot{y}&=2y \\end{aligned}\\)",
  image: "portraits/unstable-node.png"
},{
  pairId: "pendulum",
  equation: "\\( \\begin{aligned}\\dot{x}&=y\\\\ \\dot{y}&=-\\sin x \\end{aligned}\\)",
  image: "portraits/pendulum-stream.png"
},
{
  pairId: "spiral-2d",
  equation: "\\( \\begin{aligned} \\dot{x}&=y \\\\ \\dot{y}&=-x-0.5y \\end{aligned} \\)",
  image: "portraits/damped-oscillator-k-0-5.png"
},


{
  pairId: "center-2d",
  equation: "\\( \\begin{aligned}\\dot{x}&=y \\\\ \\dot{y}&=-x \\end{aligned}\\)",
  image: "portraits/center.png"
},
{
  pairId: "y2",
  equation: "\\(y'  = y^2\\)",
  portrait: portraitCard({
    f: (y) => y * y,
    equilibria: [
      { value: 0, label: "0" }
    ],
ticks: [
    { value: 1, label: "1" }
  ],
    samples: [
      -1.7, -1.2, -0.8, -0.4,
       0.4, 0.8, 1.2, 1.7
    ]
  })
},
  {
    pairId: "logistic",
    equation: "\\( y'  = y(1 − y)\\)",
    portrait: portraitCard({
      f: (y) => y * (1 - y),
      equilibria: [
        { value: 1, label: "1" },
        { value: 0, label: "0" }
      ],
ticks: [
  ],
      samples: [
  -0.2, -0.5, -0.8, -1.2, -1.7,
   0.15, 0.35, 0.5, 0.65, 0.85,
   1.2, 1.7
]
    })
  },{
  pairId: "minus-fifth",
  equation: "\\( y' = y(1 - y) - \\frac{1}{5} \\)",
  portrait: portraitCard({
    f: (y) => y * (1 - y) - 0.2,
    equilibria: [
      { value: 0.724, label: "0.72" },
      { value: 0.276, label: "0.28" }
    ],
    ticks: [
      { value: 0, label: "0" },
      { value: 1, label: "1" }
    ],
    samples: [
      -1.8, -1.3, -0.9, -0.5,
       0.1, 0.25, 0.4, 0.6, 0.75, 0.9,
       1.3, 1.8
    ]
  })
},

{
  pairId: "cubic",
  equation: "\\(y' = y(1 − y^2)\\)",
  portrait: portraitCard({
    f: (y) => y * (1 - y * y),
    equilibria: [
      { value: 1, label: "1" },
      { value: 0, label: "0" },
      { value: -1, label: "-1" }
    ],
    ticks: [
    ],
    samples: [
      -1.8, -1.3, -0.8, -0.3,
       0.3, 0.8, 1.3, 1.8
    ]
  })
},



{
  pairId: "y(2-y)",
equation: "\\( y'  = y(2 - y) \\)",  
  portrait: portraitCard({
    f: (y) => y * (2 - y),
    yMin: -2.2,
    yMax: 2.4,
    equilibria: [
      { value: 2, label: "2" },
      { value: 0, label: "0" }
    ],
ticks: [
    { value: 1, label: "1" }
  ],
    samples: [
      -0.3, -0.7, -1.2, -1.8,
       0.2, 0.6, 1.0, 1.4, 1.8,
       2.3
    ]
  })
},
{
  pairId: "minus-quarter",
equation: "\\( y'  = y(1 - y) - \\frac{1}{4} \\)",  
  portrait: portraitCard({
    f: (y) => y * (1 - y) - 0.25,
    equilibria: [
     { value: 0.5, label: "½" }
    ],
ticks: [
    { value: 0, label: "0" },
    { value: 1, label: "1" }
  ],
    samples: [
      -1.8, -1.3, -0.9, -0.5,
       0.1, 0.3, 0.7, 0.9,
       1.3, 1.8
    ]
  })
},
{
  pairId: "minus-third",
  equation: "\\( y' = y(1 - y) - \\frac{1}{3} \\)",
  portrait: portraitCard({
    f: (y) => y * (1 - y) - 1/3,
    equilibria: [ ],
ticks: [
    { value: 0, label: "0" },
    { value: 1, label: "1" }
  ],
    samples: [
      -1.8, -1.3, -0.9, -0.5,
       0.1, 0.3, 0.5, 0.7, 0.9,
       1.3, 1.8
    ]
  })
},
  {
    pairId: "minus-y",
    equation: "\\(y'  = −y\\)",
    portrait: portraitCard({
      f: (y) => -y,
      equilibria: [
        { value: 0, label: "0" }
      ],
ticks: [
    { value: 1, label: "1" }
  ],
      samples: [
        -1.7, -1.25, -0.8, -0.35,
         0.35, 0.8, 1.25, 1.7
      ]
    })
  }
];

const PAIRS_PER_GAME = 6;
let pairsThisRound = [];


function buildDeck() {
  const cards = [];

  pairsThisRound = shuffle(pairs).slice(0, PAIRS_PER_GAME);

  for (const pair of pairsThisRound) {
    cards.push({
      pairId: pair.pairId,
      kind: "equation",
      content: equationHTML(pair.equation),
      flipped: false,
      matched: false
    });

    if (pair.portrait) {
      cards.push({
        pairId: pair.pairId,
        kind: "portrait",
        content: pair.portrait,
        flipped: false,
        matched: false
      });
    }

    if (pair.image) {
      cards.push({
        pairId: pair.pairId,
        kind: "image",
        content: `<img src="${pair.image}" style="width:100%; height:100%; object-fit:contain;">`,
        flipped: false,
        matched: false
      });
    }
  }

  return shuffle(cards);
}


let deck = [];
let flippedIndices = [];
let lockBoard = false;
let matches = 0;

function updateStatus() {
  statusEl.textContent =
    matches === pairsThisRound.length
      ? `You won! ${matches} / ${pairsThisRound.length}`
      : `Matches: ${matches} / ${pairsThisRound.length}`;
}

function renderBoard() {
  board.innerHTML = "";

  deck.forEach((card, index) => {
    const btn = document.createElement("button");
    btn.className = "card";

    if (card.flipped) btn.classList.add("is-flipped");
    if (card.matched) btn.classList.add("is-matched");

    btn.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">ODE</div>
        <div class="card-face card-front">${card.content}</div>
      </div>
    `;

    btn.onclick = () => handleClick(index);
    board.appendChild(btn);
  });

  updateStatus();
if (window.MathJax) {
  MathJax.typeset();
}
}

function handleClick(i) {
  if (lockBoard) return;

  const card = deck[i];
  if (card.flipped || card.matched) return;

  card.flipped = true;
  flippedIndices.push(i);
  renderBoard();

  if (flippedIndices.length < 2) return;

  lockBoard = true;

  const [a, b] = flippedIndices;
  const c1 = deck[a];
  const c2 = deck[b];

  const match = c1.pairId === c2.pairId && c1.kind !== c2.kind;

  if (match) {
    c1.matched = true;
    c2.matched = true;
    matches++;
    flippedIndices = [];
    lockBoard = false;
    renderBoard();
    return;
  }

  setTimeout(() => {
    c1.flipped = false;
    c2.flipped = false;
    flippedIndices = [];
    lockBoard = false;
    renderBoard();
  }, 800);
}

function resetGame() {
  deck = buildDeck();
  flippedIndices = [];
  lockBoard = false;
  matches = 0;
  renderBoard();
}

resetBtn.onclick = resetGame;
resetGame();