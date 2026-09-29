# Pebbles and Poofs: A Neural Network Learns a Game I Invented

A population of 1,000 "spouts" learns to play a simple physics game through neuroevolution. Each spout slides along the bottom of a pond and can fire a puff of air upward. Its job is to keep a drifting bubble aloft and steer it through a goal, using only a few puffs. Nobody tells the spouts how; the ones that score best pass their brains on to the next generation.

[![Pebbles and Poofs: AI evolves a neural network to solve a game (watch on YouTube)](https://img.youtube.com/vi/PJhkjt6iBnA/hqdefault.jpg)](https://youtu.be/PJhkjt6iBnA)

**[Watch: Pebbles and Poofs, AI Evolves a Neural Network to Solve a Game](https://youtu.be/PJhkjt6iBnA)**

## The game

- Each spout gets its own bubble, which starts at a random spot near the top of the pond and slowly sinks.
- The spout moves left and right and can fire one **poof** at a time. A poof travels upward, and when it hits, it pushes the bubble directly away from the spout, so where the spout stands decides which way the bubble flies. Each hit scores 200 points.
- **Goals:** knocking the bubble out through the **top goal** scores 1,000 points. Sending it out through either **side goal** scores 1,500, because side goals are harder to reach. Each goal brings a new bubble.
- **Losing:** a spout's run ends if the bubble sinks to the bottom, leaves the pond anywhere other than a goal, or is hit more than 6 times, or if the spout runs into the pond's edge.

## How the spouts learn

The learning algorithm is **NEAT** (NeuroEvolution of Augmenting Topologies). Instead of training one network, it evolves a population of them, mutating both weights and structure, and groups similar networks into species so new strategies have time to develop.

**What each spout senses (3 inputs):** its own position, how far the bubble is to its left or right, and how high the bubble is. These feed a starting hidden layer of 16 nodes, which NEAT then grows and rewires.

**What it can do (3 outputs):** move left, move right, or poof. Movement fires above 0.75 and a poof fires above 0.85, which makes the network commit before it spends a poof.

**Fitness:** `1 + score² + time alive / 20`. Squaring the score makes goals worth far more than simply surviving.

The panel on the left shows the best spout's neural network live, with its three output values labeled. An output turns red when it crosses its firing threshold, so you can watch the "decision" happen.

## What I built on top of the NEAT template

The neural-network core started from Code Bullet's [NEAT Template (JavaScript)](https://github.com/Code-Bullet/NEAT-Template-JavaScript). Everything about the game is mine:

- **The game:** `spout.js`, `bubble.js`, and `poof.js`. Bubble physics with gravity and drag, poof collisions, goals, and scoring.
- **Brain visualization:** labeled inputs and outputs, with threshold highlighting in `neuro.js` (the template's genome, renamed and extended).
- **Tuning:** a pre-seeded hidden layer, firing thresholds, bump limits, and a fitness function tuned so spouts learn to aim for goals.
- **Look:** each spout, bubble, and poof shares a color inherited from its parent, so family lines are visible on screen.

`ConnectionGene.js` and `ConnectionHistory.js` are unchanged from the template. `Node.js`, `Species.js`, and `population.js` are modified.

## Running it

It is plain JavaScript using [p5.js](https://p5js.org/), with no build step. Because it loads an image, open it through a local web server rather than by double-clicking `index.html`:

```bash
python -m http.server 8000
```

Then browse to <http://localhost:8000>. The VS Code **Live Server** extension also works.

## Credits

- NEAT template by [Code Bullet](https://github.com/Code-Bullet/NEAT-Template-JavaScript). The original repository does not include a license; its files are credited here and remain his work.
- NEAT algorithm: Kenneth O. Stanley and Risto Miikkulainen, *Evolving Neural Networks through Augmenting Topologies* (2002).
- [p5.js](https://p5js.org/) (LGPL 2.1).

Game design, code, and tuning by Matthew Rogers, 2023.
