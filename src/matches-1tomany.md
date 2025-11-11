---
toc: false
---
# One-to-Many Matches

This page shows all transactions that have been matched on a one-to-many basis.

```js
const matches1tomany = FileAttachment("data/matches_1to_many.csv").csv({typed: true});
```

```js
const uniqueMatches = new Set(matches1tomany.map(d => d.row_id_out)).size;
const totalAmount = [...new Set(matches1tomany.map(d => d.match_id))].reduce((sum, matchId) => {
  const matchRows = matches1tomany.filter(d => d.match_id === matchId);
  return sum + Math.abs(matchRows[0].amount_out);
}, 0);
const avgAmount = totalAmount / uniqueMatches;
```

<div class="grid grid-cols-3">
  <div class="card">
    <h2>Unique Outflows Matched</h2>
    <span class="big">${uniqueMatches.toLocaleString()}</span>
  </div>  <div class="card">
    <h2>Total Amount</h2>
    <span class="big">$${(totalAmount / 1000).toFixed(0)}K</span>
  </div>
  <div class="card">
    <h2>Average Amount</h2>
    <span class="big">$${(avgAmount / 1000).toFixed(0)}K</span>
  </div>
</div>

## Matched Transactions

```js
const search = view(Inputs.text({placeholder: "Search transactions..."}));
```

```js
const dateOutFilter = view(Inputs.text({placeholder: "Filter Out Date..."}));
const amountOutFilter = view(Inputs.text({placeholder: "Filter Out Amount..."}));
const accountOutFilter = view(Inputs.text({placeholder: "Filter Out Account..."}));
const dateInFilter = view(Inputs.text({placeholder: "Filter In Date..."}));
const amountInFilter = view(Inputs.text({placeholder: "Filter In Amount..."}));
const accountInFilter = view(Inputs.text({placeholder: "Filter In Account..."}));
const matchIdFilter = view(Inputs.text({placeholder: "Filter Match ID..."}));
```

${search} <span style="margin-left: 1rem; font-weight: bold;">${tableData.length.toLocaleString()} results</span>

<div style="display: grid; grid-template-columns: 50px 80px 100px 120px 150px 100px 120px 150px; gap: 8px; margin: 10px 0; font-size: 12px;">
  <div></div>
  <div style="text-align: center;">${matchIdFilter}</div>
  <div style="text-align: center;">${dateOutFilter}</div>
  <div style="text-align: right;">${amountOutFilter}</div>
  <div style="text-align: right;">${accountOutFilter}</div>
  <div style="text-align: center;">${dateInFilter}</div>
  <div style="text-align: right;">${amountInFilter}</div>
  <div style="text-align: right;">${accountInFilter}</div>
</div>

```js
const tableData = matches1tomany
  .filter(d => {
    if (!search) return true;
    const term = search.toLowerCase();    return (
      String(d.date_out).toLowerCase().includes(term) ||
      String(d.date_in).toLowerCase().includes(term) ||
      String(d.amount_out).toLowerCase().includes(term) ||
      String(d.amount_in).toLowerCase().includes(term) ||
      String(d.account_id_out).toLowerCase().includes(term) ||
      String(d.account_id_in).toLowerCase().includes(term) ||
      String(d.match_id).toLowerCase().includes(term)
    );
  })  .filter(d => {
    return (
      (!dateOutFilter || String(d.date_out).toLowerCase().includes(dateOutFilter.toLowerCase())) &&
      (!amountOutFilter || String(d.amount_out).toLowerCase().includes(amountOutFilter.toLowerCase())) &&
      (!accountOutFilter || String(d.account_id_out).toLowerCase().includes(accountOutFilter.toLowerCase())) &&
      (!dateInFilter || String(d.date_in).toLowerCase().includes(dateInFilter.toLowerCase())) &&
      (!amountInFilter || String(d.amount_in).toLowerCase().includes(amountInFilter.toLowerCase())) &&
      (!accountInFilter || String(d.account_id_in).toLowerCase().includes(accountInFilter.toLowerCase())) &&
      (!matchIdFilter || String(d.match_id).toLowerCase().includes(matchIdFilter.toLowerCase()))
    );  })
  .sort((a, b) => {
    // First sort by match_id, then by date_out, then by date_in
    if (a.match_id !== b.match_id) return a.match_id - b.match_id;
    if (a.date_out !== b.date_out) return new Date(b.date_out) - new Date(a.date_out);
    return new Date(b.date_in) - new Date(a.date_in);
  })
  .map((d, i) => ({ index: i + 1, ...d }));
```

```js
Inputs.table(tableData, {
  columns: ["index", "match_id", "date_out", "amount_out", "account_id_out", "date_in", "amount_in", "account_id_in"],
  header: {
    index: "#",
    match_id: "Match ID",
    date_out: "Out Date",
    amount_out: "Out Amount", 
    account_id_out: "Out Account",
    date_in: "In Date",
    amount_in: "In Amount",
    account_id_in: "In Account"
  },  format: {
    index: d => d,
    match_id: d => d,
    amount_out: (d, i) => {
      const currentRow = tableData[i];
      const isFirstInGroup = i === 0 || tableData[i-1].match_id !== currentRow.match_id;
      return isFirstInGroup ? Number(d).toLocaleString("en-US", {style: "currency", currency: "USD"}) : "";
    },
    amount_in: d => Number(d).toLocaleString("en-US", {style: "currency", currency: "USD"}),
    account_id_out: (d, i) => {
      const currentRow = tableData[i];
      const isFirstInGroup = i === 0 || tableData[i-1].match_id !== currentRow.match_id;
      return isFirstInGroup ? String(d) : "";
    },
    account_id_in: d => String(d),
    date_out: (d, i) => {
      const currentRow = tableData[i];
      const isFirstInGroup = i === 0 || tableData[i-1].match_id !== currentRow.match_id;
      if (!isFirstInGroup) return "";
      const date = new Date(d);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    date_in: d => {
      const date = new Date(d);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
  align: {
    index: "center",
    match_id: "center",
    date_out: "center",
    amount_out: "right",
    account_id_out: "right",
    date_in: "center", 
    amount_in: "right",
    account_id_in: "right"
  },
  width: {
    index: 50,
    match_id: 80,
    date_out: 100,
    amount_out: 120,
    account_id_out: 150,
    date_in: 100,
    amount_in: 120,
    account_id_in: 150
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