A budget-vs-spend row for the budgets screen and category drill-downs. The bar self-colors: green under budget, amber near the limit, oxblood over.

```jsx
<BudgetMeter label="Groceries" spent={842} limit={900} />
<BudgetMeter label="Dining" spent={586} limit={500} />   {/* over → oxblood */}
```

`warnAt` sets the amber threshold (default 0.85). Currency/locale via Intl.
