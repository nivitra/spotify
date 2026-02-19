# 🎧 Project Vishwakarma — Spotify Algorithm Deconstruction

> **A LearnApart Initiative** · Building understanding through interactive demonstration

---

## What Is This?

An interactive, step-by-step deconstruction of **Spotify's recommendation engine** — built for classroom presentations, workshops, and self-study. No fluff. Pure mechanics.

This isn't a slideshow or a blog post. It's a **working demonstration** where you adjust weights, drag embeddings, simulate listening sessions, and watch algorithms respond in real-time.

---

## 🔧 The 10 Steps

| Step | Title | What You Do |
|:----:|-------|-------------|
| 01 | **The Problem** | Understand the scale: 600M users × 100M songs |
| 02 | **User-Item Matrix** | Click cells to build interaction data, see sparsity |
| 03 | **Matrix Factorization** | Drag the k-slider to control embedding dimensions |
| 04 | **Embedding Space** | Drag your user dot in 2D space, nearest songs update live |
| 05 | **Audio Analysis** | Adjust 5 feature sliders — songs rank by audio similarity |
| 06 | **NLP Pipeline** | Pick vibe tags or type descriptions — tag-based matching |
| 07 | **Fusion Layer** | Tune λ₁, λ₂, λ₃ weights + MMR diversity in real-time |
| 08 | **Skip Simulator** | Play/Skip/Save with live event log & taste profile updates |
| 09 | **Cold Start** | Pick 3+ artists — bootstrap a taste profile from nothing |
| 10 | **A/B Testing** | Set exploration rate, run experiment, see ship/kill verdict |

---

## 🚀 Quick Start

```bash
# Clone
git clone <repo-url>
cd Spotify

# Open — no build step, no dependencies
open index.html
```

Zero dependencies. Pure HTML + CSS + JavaScript. Works offline.

---

## 📁 Project Structure

```
Spotify/
├── index.html      # 10-step interactive demo (single page)
├── style.css       # Terminal Noir design system
├── script.js       # All interactive mechanics (~600 lines)
├── context.md      # High-level algorithm breakdown (source material)
├── tech.md         # Deep technical reference (source material)
└── README.md       # You're here
```

---

## 🎯 Core Concepts Demonstrated

### The Algorithm Trilogy
- **Collaborative Filtering** — Matrix factorization, user/item embeddings, dot-product predictions
- **Audio Analysis** — CNN-based feature extraction, cosine similarity matching
- **NLP Pipeline** — Web-crawled text embeddings, cultural signal processing

### System Mechanics
- **Implicit Feedback** — How plays, skips, saves generate signal weights
- **Fusion Layer** — Weighted combination with MMR diversity re-ranking
- **Cold Start Problem** — Bootstrapping recommendations from artist selection
- **A/B Testing** — Exploration vs. exploitation tradeoff simulation
- **The 30-Second Rule** — How skip timing affects signal strength

---

## 🏗️ About Project Vishwakarma

**Vishwakarma** is LearnApart's initiative to deconstruct the engineering behind products that billions of people use daily. Named after the divine architect of Hindu mythology, the project reverse-engineers systems to reveal the craft beneath the surface.

### Principles
1. **Interactive over passive** — Every concept has a hands-on demo
2. **Mechanics over marketing** — No buzzwords, only working systems
3. **Step-by-step over monolithic** — One concept at a time, in sequence
4. **Real data patterns** — Simulated with realistic distributions

---

## 📚 About LearnApart

**LearnApart** builds educational tools that make complex engineering concepts accessible through interactive demonstration. We believe understanding comes from doing, not just reading.

---

## 📖 References

- Koren, Y. (2009). *Matrix Factorization Techniques for Recommender Systems*
- van den Oord, A. (2013). *Deep Content-Based Music Recommendation*
- Spotify Engineering Blog — *How Discover Weekly Works*
- Covington, P. et al. (2016). *Deep Neural Networks for YouTube Recommendations*
- Carbonell, J. & Goldstein, J. (1998). *MMR: Maximal Marginal Relevance*

---

<p align="center">
  <strong>LearnApart</strong> · Project Vishwakarma v1.0<br>
  <em>Built to understand, not to impress.</em>
</p>
