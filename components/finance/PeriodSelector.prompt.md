The date-range control every ledger view needs — preset periods with an optional custom range, in a compact popover.

```jsx
const [period, setPeriod] = React.useState('this-month')
const [range, setRange] = React.useState({})
<PeriodSelector value={period} onValueChange={setPeriod} custom={range} onCustomChange={setRange} />
```

Presets: this month, last 30 days, this quarter, year to date, this year, custom. Override with `presets`. Selecting "Custom range" reveals from/to date inputs. `size="sm|default"`.
