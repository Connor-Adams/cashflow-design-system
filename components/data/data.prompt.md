One-line: Cashflow's data-display set — StatCard (money-aware KPI), Table, Tabs, and LetterAvatar (categorical identity chip).

```jsx
<StatCard label="Net spend" value="$4,210" hint="This month" delta="-8%" metricKind="spend" />
<StatCard label="Income" value="$9,800" delta="+3%" metricKind="gain" />

<Table>
  <TableHeader>
    <TableRow><TableHead>Merchant</TableHead><TableHead>Amount</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>Whole Foods</TableCell><TableCell>-$84.20</TableCell></TableRow>
  </TableBody>
</Table>

<Tabs items={[{value:'all',label:'All'},{value:'biz',label:'Business'}]} value={tab} onValueChange={setTab} />
<LetterAvatar text="Whole Foods" size="md" />
```

CRITICAL — money semantics on StatCard: pass `metricKind="spend"` for cost metrics (up = bad = red) and `metricKind="gain"` for income/savings (up = good = green). `neutral` keeps the delta muted (counts, transfers). Arrows ▲▼— and color come from this logic — never hardcode the delta color.
