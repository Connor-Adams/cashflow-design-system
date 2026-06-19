/* Cashflow dashboard — a 12-col bento grid: KPI stat row, period banner,
 * business/personal splits, net-spend-by-category bars, budget pacing pills. */

const DS = window.CashflowDesignSystem_2cf89d
const Icon2 = window.CFIcon

function Tile({ span = 12, children, style }) {
  return (
    <div style={{ gridColumn: `span ${span}`, ...style }}>{children}</div>
  )
}

function PanelHead({ title, desc, icon }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <Icon2 name={icon} size={18} color="var(--muted-foreground)" />}
        <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--foreground)' }}>{title}</h2>
      </div>
      {desc && <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--muted-foreground)' }}>{desc}</p>}
    </div>
  )
}

function Panel({ children, style }) {
  return (
    <div style={{ borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', background: 'var(--card)', boxShadow: 'var(--shadow)', padding: 18, height: '100%', boxSizing: 'border-box', ...style }}>
      {children}
    </div>
  )
}

function DashboardScreen({ onNavigate }) {
  const D = window.CFData
  const { StatCard, Badge, Button, Alert, CategoryPill, AmountText } = DS
  const fmt = (n) => (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-CA', { minimumFractionDigits: 0 })

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--foreground)' }}>Dashboard</h1>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--muted-foreground)' }}>Totals stay in each currency. Filter by currency and date range.</p>
      </div>

      {/* Filter strip */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, margin: '14px 0 18px', padding: 12, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'color-mix(in oklch, var(--muted) 25%, transparent)' }}>
        <FilterChip label="CAD" icon="Coins" />
        <FilterChip label="This month" icon="Calendar" />
        {['Last month', 'Quarter', 'YTD', 'All time'].map((q) => <QuickRange key={q} label={q} />)}
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--muted)', fontSize: 13, color: 'var(--foreground)' }}>
          Showing <strong>CAD</strong> <span style={{ color: 'var(--muted-foreground)' }}>·</span> <strong>Jun 2026</strong>
        </span>
      </div>

      {/* Bento grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16, gridAutoRows: 'minmax(min-content, auto)' }}>
        {/* KPI stat row */}
        {D.stats.map((s) => (
          <Tile key={s.label} span={4}><StatCard {...s} style={{ height: '100%' }} /></Tile>
        ))}

        {/* Review banner */}
        <Tile span={12}>
          <Alert variant="warning" title={`${D.reviewQueue.length} transactions flagged for review`}
            action={<Button size="sm" variant="primary" onClick={() => onNavigate('transactions')}>Open review</Button>}>
            Waiting on category, split, or business decisions before they roll into your totals.
          </Alert>
        </Tile>

        {/* Net spend by category */}
        <Tile span={7}>
          <Panel>
            <PanelHead title="Net spend by category" desc="Click a bar to open those transactions. Payments and transfers are excluded." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {D.categories.map((c) => (
                <button key={c.name} onClick={() => onNavigate('transactions')} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 72px', alignItems: 'center', gap: 12, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                  <CategoryPill category={String(c.name).toLowerCase()} label={c.name} size="sm" />
                  <span style={{ height: 18, borderRadius: 4, background: 'var(--gradient-hero)', width: `${c.pct}%`, opacity: 0.85 }} />
                  <span style={{ textAlign: 'right', justifySelf: 'end' }}><AmountText value={-c.amount} decimals={0} size="sm" /></span>
                </button>
              ))}
            </div>
          </Panel>
        </Tile>

        {/* Activity KPIs */}
        <Tile span={5}>
          <Panel>
            <PanelHead title="Activity" icon="Activity" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {D.kpis.map((k, i) => (
                <div key={k.label} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderTop: i ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--muted-foreground)' }}>{k.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{k.hint}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', fontFamily: 'var(--font-mono)' }}>{k.value}</span>
                    {k.delta && <Badge variant="secondary">{k.delta}</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </Tile>

        {/* Business vs personal — income */}
        <Tile span={6}><SplitPanel title="Income · business vs personal" icon="Wallet" biz={D.biz.incomeBiz} personal={D.biz.incomePersonal} bizVal="$3,740" personalVal="$6,100" /></Tile>
        <Tile span={6}><SplitPanel title="Spend · business vs personal" icon="ShoppingBag" biz={D.biz.spendBiz} personal={D.biz.spendPersonal} bizVal="$1,137" personalVal="$3,075" /></Tile>

        {/* Budget pacing */}
        <Tile span={12}>
          <Panel>
            <PanelHead title="Budget progress + pacing" desc="Spend so far against each budget. The tick marks where you'd be if perfectly paced." />
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
              {D.budgets.map((b) => <BudgetPill key={b.label} b={b} fmt={fmt} />)}
            </div>
          </Panel>
        </Tile>
      </div>
    </div>
  )
}

function FilterChip({ label, icon }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 'var(--radius-md)', border: '1px solid color-mix(in oklch, var(--primary) 24%, var(--border))', background: 'var(--card)', fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>
      <Icon2 name={icon} size={14} color="var(--muted-foreground)" />{label}
    </span>
  )
}

function QuickRange({ label }) {
  const [hover, setHover] = React.useState(false)
  return (
    <button type="button" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      minHeight: 32, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', padding: '5px 12px',
      fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', cursor: 'pointer',
      background: hover ? 'var(--muted)' : 'color-mix(in oklch, var(--muted) 50%, transparent)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)',
    }}>{label}</button>
  )
}

function SplitPanel({ title, icon, biz, personal, bizVal, personalVal }) {
  return (
    <Panel>
      <PanelHead title={title} icon={icon} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        <FocusCard label="Business" value={bizVal} tone="business" />
        <FocusCard label="Personal" value={personalVal} tone="personal" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}>
        <span>Business {biz}%</span><span>Personal {personal}%</span>
      </div>
      <div style={{ display: 'flex', height: 14, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <span style={{ width: `${biz}%`, background: 'var(--chart-business)' }} />
        <span style={{ width: `${personal}%`, background: 'var(--positive)' }} />
      </div>
    </Panel>
  )
}

function FocusCard({ label, value, tone }) {
  const isBiz = tone === 'business'
  return (
    <div style={{
      borderRadius: 'var(--radius-lg)', padding: 14,
      border: `1px solid color-mix(in srgb, ${isBiz ? 'var(--chart-business)' : 'var(--positive)'} 44%, var(--border))`,
      boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${isBiz ? 'var(--chart-business)' : 'var(--positive)'} 18%, transparent)`,
      background: 'color-mix(in oklch, var(--background) 60%, transparent)',
    }}>
      <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--muted-foreground)' }}>{label}</p>
      <p style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', fontFamily: 'var(--font-mono)' }}>{value}</p>
    </div>
  )
}

function BudgetPill({ b, fmt }) {
  const fill = b.tone === 'over' ? 'var(--destructive)' : b.tone === 'warn' ? 'var(--primary)' : 'var(--positive)'
  return (
    <article style={{ flexShrink: 0, minWidth: 210, maxWidth: 240, display: 'flex', flexDirection: 'column', gap: 6, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'color-mix(in oklch, var(--muted) 50%, transparent)', padding: 12 }}>
      <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <strong style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{b.label}</strong>
        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>{b.pct}%</span>
      </header>
      <div style={{ position: 'relative', height: 6, width: '100%', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--muted)' }}>
        <span style={{ display: 'block', height: '100%', width: `${Math.min(100, b.pct)}%`, background: fill }} />
        <span style={{ position: 'absolute', top: 0, bottom: 0, width: 1, left: `${b.elapsed}%`, background: 'color-mix(in oklch, var(--foreground) 60%, transparent)' }} />
      </div>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{fmt(b.spent)} / {fmt(b.target)} <span style={{ opacity: 0.7 }}>CAD</span></p>
    </article>
  )
}

window.CFDashboard = DashboardScreen
