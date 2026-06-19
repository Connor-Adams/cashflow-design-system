/* Cashflow transactions — filter pills, a summary stat row, tabs, and the
 * data table with merchant avatars, category badges, and money-colored amounts. */

const DS2 = window.CashflowDesignSystem_2cf89d
const Icon3 = window.CFIcon

function TransactionsScreen({ onNavigate }) {
  const D = window.CFData
  const { StatCard, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Tabs, Badge, LetterAvatar, Button, CategoryPill, AmountText } = DS2
  const [tab, setTab] = React.useState('all')
  const [reviewOnly, setReviewOnly] = React.useState(false)

  const rows = D.transactions.filter((t) => {
    if (tab === 'business' && !t.biz) return false
    if (tab === 'personal' && t.biz) return false
    if (reviewOnly && t.status !== 'review') return false
    return true
  })

  const spend = D.transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0)
  const income = D.transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const fmt = (n) => (n < 0 ? '-' : '+') + '$' + Math.abs(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--foreground)' }}>Transactions</h1>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--muted-foreground)' }}>Every charge, credit, and transfer across your accounts.</p>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '16px 0' }}>
        <StatCard label="Net spend" value={'$' + Math.abs(spend + income).toLocaleString('en-CA', { minimumFractionDigits: 0 })} hint="In current filters" metricKind="neutral" />
        <StatCard label="Total out" value={'$' + Math.abs(spend).toLocaleString('en-CA', { minimumFractionDigits: 0 })} hint={`${D.transactions.filter(t=>t.amount<0).length} charges`} delta="-8%" metricKind="spend" />
        <StatCard label="Total in" value={'$' + income.toLocaleString('en-CA', { minimumFractionDigits: 0 })} hint={`${D.transactions.filter(t=>t.amount>0).length} credits`} delta="+3%" metricKind="gain" />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Tabs items={[{ value: 'all', label: 'All' }, { value: 'business', label: 'Business' }, { value: 'personal', label: 'Personal' }]} value={tab} onValueChange={setTab} />
        <button type="button" onClick={() => setReviewOnly((v) => !v)} aria-pressed={reviewOnly} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 34, borderRadius: 'var(--radius-md)', padding: '6px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
          border: `1px solid ${reviewOnly ? 'color-mix(in oklch, var(--primary) 40%, var(--border))' : 'var(--border)'}`,
          background: reviewOnly ? 'var(--accent)' : 'var(--card)', color: reviewOnly ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
        }}>
          <Icon3 name="Inbox" size={15} /> Needs review
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="sm"><Icon3 name="SlidersHorizontal" size={15} />Filters</Button>
          <Button variant="primary" size="sm"><Icon3 name="Plus" size={15} />Add</Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 96 }}>Date</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead style={{ textAlign: 'right' }}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((t) => (
            <TableRow key={t.id}>
              <TableCell style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{t.date.slice(5)}</TableCell>
              <TableCell>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <LetterAvatar text={t.merchant} size="sm" />
                  <span style={{ fontWeight: 600 }}>{t.merchant}</span>
                  {t.biz && <Badge variant="outline">Business</Badge>}
                </span>
              </TableCell>
              <TableCell style={{ color: 'var(--muted-foreground)' }}>{t.account}</TableCell>
              <TableCell><CategoryPill category={String(t.category).toLowerCase()} label={t.category} size="sm" /></TableCell>
              <TableCell>
                {t.status === 'review'
                  ? <Badge variant="default">Review</Badge>
                  : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--muted-foreground)' }}><Icon3 name="Check" size={14} color="var(--positive)" />Cleared</span>}
              </TableCell>
              <TableCell style={{ textAlign: 'right' }}><AmountText value={t.amount} size="sm" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {rows.length === 0 && (
        <div style={{ marginTop: 12 }}>
          {React.createElement(DS2.EmptyState, { title: 'No transactions match these filters', description: 'Try clearing the review filter or switching tabs.' })}
        </div>
      )}
    </div>
  )
}

window.CFTransactions = TransactionsScreen
