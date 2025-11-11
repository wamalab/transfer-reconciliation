---
toc: false
---
# Raw Data

This page shows all bank transactions from the raw data.

```js
const bank_transactions = FileAttachment("data/bank_transactions.csv").csv({typed: true});
```

```js
const totalTransactions = bank_transactions.length;
const totalInflows = bank_transactions.reduce((sum, d) => sum + (d.amount > 0 ? d.amount : 0), 0);
const totalOutflows = bank_transactions.reduce((sum, d) => sum + (d.amount < 0 ? Math.abs(d.amount) : 0), 0);
```

<div class="grid grid-cols-3">
  <div class="card">
    <h2>Total Transactions</h2>
    <span class="big">${totalTransactions.toLocaleString()}</span>
  </div>  <div class="card">
    <h2>Total Inflows</h2>
    <span class="big">$${(totalInflows / 1000000000).toFixed(1)}B</span>
  </div>
  <div class="card">
    <h2>Total Outflows</h2>
    <span class="big">$${(totalOutflows / 1000000000).toFixed(1)}B</span>
  </div>
</div>

## Raw Data

```js
const search = view(Inputs.text({placeholder: "Search transactions..."}));
```

```js
const indexFilter = view(Inputs.text({placeholder: "Filter #..."}));
const dateFilter = view(Inputs.text({placeholder: "Filter Date..."}));
const amountFilter = view(Inputs.text({placeholder: "Filter Amount..."}));
const accountFilter = view(Inputs.text({placeholder: "Filter Account..."}));
```

${search} <span style="margin-left: 1rem; font-weight: bold;">${tableData.length.toLocaleString()} results</span>

<div style="display: grid; grid-template-columns: 100px 120px 150px 200px; gap: 8px; margin: 10px 0; font-size: 12px;">
  <div style="text-align: center;">${indexFilter}</div>
  <div style="text-align: center;">${dateFilter}</div>
  <div style="text-align: right;">${amountFilter}</div>
  <div style="text-align: right;">${accountFilter}</div>
</div>

```js
const tableData = bank_transactions
  .filter(d => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      String(d.index).toLowerCase().includes(term) ||
      String(d.date).toLowerCase().includes(term) ||
      String(d.amount).toLowerCase().includes(term) ||
      String(d.account_id).toLowerCase().includes(term)
    );
  })
  .filter(d => {
    return (
      (!indexFilter || String(d.index).toLowerCase().includes(indexFilter.toLowerCase())) &&
      (!dateFilter || String(d.date).toLowerCase().includes(dateFilter.toLowerCase())) &&
      (!amountFilter || String(d.amount).toLowerCase().includes(amountFilter.toLowerCase())) &&
      (!accountFilter || String(d.account_id).toLowerCase().includes(accountFilter.toLowerCase()))
    );
  })
  .map((d, i) => ({...d, rowNumber: i + 1}));
```

```js
Inputs.table(tableData, {
  columns: [
    "rowNumber",
    "date", 
    "amount",
    "account_id"
  ],
  header: {
    rowNumber: "#",
    date: "Date",
    amount: "Amount", 
    account_id: "Account"
  },
  format: {
    rowNumber: d => d,
    date: d => {
      if (d instanceof Date) {
        return d.toISOString().split('T')[0];
      }
      const date = new Date(d);
      return isNaN(date) ? d : date.toISOString().split('T')[0];
    },
    amount: d => d3.format("$,.2f")(d),
    account_id: d => d
  },
  align: {
    rowNumber: "center",
    date: "center", 
    amount: "right",
    account_id: "right"
  },
  width: {
    rowNumber: 100,
    date: 120,
    amount: 150,
    account_id: 200
  },
  rows: 25
})
```

<style>
h1 {
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
}

.big {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--theme-foreground-focus);
}

table tbody tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.05);
}

table tbody tr:nth-child(odd) {
  background-color: transparent;
}
</style>