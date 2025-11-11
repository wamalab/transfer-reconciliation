---
toc: false
---
<div class="hero">
  <h1>Bank Transfer Reconciliation</h1>
  <p style="margin: 0.5rem 0 0 0; color: var(--theme-foreground-alt); font-size: 1.1rem;">
    Match all outgoing transactions to their corresponding incoming transactions.
  </p>
</div>

## Reconciliation Summary

```js
const transactions = FileAttachment("data/bank_transactions.csv").csv({typed: true});
const matches1to1 = FileAttachment("data/matches_1to1.csv").csv({typed: true});
const matches1toMany = FileAttachment("data/matches_1to_many.csv").csv({typed: true});
const matchesMany1 = FileAttachment("data/matches_many_to_1.csv").csv({typed: true});
const unmatched = FileAttachment("data/unmatched_out.csv").csv({typed: true});
```

```js
const totalTransactions = transactions.length;
const totalOutgoing = transactions.filter(d => d.amount < 0).length;
// Count unique outflows matched - use correct column names for each dataset
const unique1to1Matches = new Set(matches1to1.map(d => d.index_out)).size;
const unique1toManyMatches = new Set(matches1toMany.map(d => d.row_id_out)).size;
const uniqueManyto1Matches = new Set(matchesMany1.map(d => d.row_id_out)).size;
const totalUnmatched = unmatched.length;
const totalUniqueMatched = unique1to1Matches + unique1toManyMatches + uniqueManyto1Matches;
```

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Total Transactions</h2>
    <span class="big">${totalTransactions.toLocaleString()}</span>
  </div>
  <div class="card">
    <h2>Outgoing Transactions</h2>
    <span class="big">${totalOutgoing.toLocaleString()}</span>
  </div>
  <div class="card">
    <h2>Total Outgoing Matched</h2>
    <span class="big">${totalUniqueMatched.toLocaleString()}</span>
  </div>
  <div class="card">
    <h2>Match Rate</h2>
    <span class="big">${((totalUniqueMatched / totalOutgoing) * 100).toFixed(1)}%</span>
  </div>
</div>

<div class="grid grid-cols-4">
  <div class="card">
    <h2>1-to-1 Matches</h2>
    <span class="big">${unique1to1Matches.toLocaleString()}</span>
  </div>
  <div class="card">
    <h2>1-to-Many Matches</h2>
    <span class="big">${unique1toManyMatches.toLocaleString()}</span>
  </div>
  <div class="card">
    <h2>Many-to-1 Matches</h2>
    <span class="big">${uniqueManyto1Matches.toLocaleString()}</span>
  </div>
  <div class="card">
    <h2>Total Outgoing Unmatched</h2>
    <span class="big">${totalUnmatched.toLocaleString()}</span>
  </div>
</div>

---

## Navigate to Other Pages

<div class="nav-grid">
  <div class="nav-card">
    <h3>📊 One-to-One Matches</h3>
    <p>View transactions with perfect 1:1 matching patterns</p>
    <a href="./matches-1to1" class="nav-link">Explore 1-to-1 Matches →</a>
  </div>

<div class="nav-card">
    <h3>📊 One-to-Many Matches</h3>
    <p>Single outgoing transactions matched to multiple incoming</p>
    <a href="./matches-1tomany" class="nav-link">Explore 1-to-Many →</a>
  </div>

<div class="nav-card">
    <h3>📊 Many-to-One Matches</h3>
    <p>Multiple outgoing transactions matched to single incoming</p>
    <a href="./matches-manyto1" class="nav-link">Explore Many-to-1 →</a>
  </div>

<div class="nav-card">
    <h3>📊 Unmatched Transactions</h3>
    <p>Outgoing transactions that could not be matched with any incoming transactions</p>
    <a href="./unmatched" class="nav-link">View Unmatched →</a>
  </div>

<div class="nav-card">
    <h3>📊 Raw Bank Data</h3>
    <p>Complete dataset of all bank transactions</p>
    <a href="./raw-data" class="nav-link">Browse Raw Data →</a>
  </div>

<div class="nav-card">
    <h3>📋 Reconciliation Report</h3>
    <p>Comprehensive analysis and methodology documentation</p>
    <a href="./report" class="nav-link">View Report →</a>
  </div>
</div>

---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

.big {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--theme-foreground-focus);
}

/* Navigation cards styling */
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.nav-card {
  background: var(--theme-background-alt);
  border: 1px solid var(--theme-foreground-faintest);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-color: var(--theme-foreground-focus);
}

.nav-card h3 {
  margin: 0 0 0.75rem 0;
  color: var(--theme-foreground-focus);
  font-size: 1.25rem;
  font-weight: 700;
}

.nav-card p {
  margin: 0 0 1.25rem 0;
  color: var(--theme-foreground-alt);
  font-size: 0.9rem;
  line-height: 1.5;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  color: var(--theme-foreground-focus);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  background: var(--theme-background);
  border: 1px solid var(--theme-foreground-focus);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: var(--theme-foreground-focus);
  color: var(--theme-background);
  transform: translateX(4px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .nav-card {
    padding: 1rem;
  }
}

</style>
