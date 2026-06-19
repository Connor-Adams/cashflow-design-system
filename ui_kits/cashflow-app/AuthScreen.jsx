/* Cashflow login — centered auth card with the demo-account shortcut, mirroring
 * the app's AuthPage (email/password tabs + "Continue with demo account"). */

const DS3 = window.CashflowDesignSystem_2cf89d
const Icon4 = window.CFIcon

function AuthScreen({ onLogin }) {
  const { Card, Button, Label, Input } = DS3
  const [tab, setTab] = React.useState('signin')
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--background)', position: 'relative', overflow: 'hidden' }}>
      {/* faint living-gradient wash */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(60% 55% at 18% 22%, color-mix(in oklch, var(--gradient-hero-from) 16%, transparent), transparent 70%), radial-gradient(55% 55% at 82% 78%, color-mix(in oklch, var(--gradient-hero-to) 14%, transparent), transparent 70%)' }} />
      <Card style={{ width: '100%', maxWidth: 400, display: 'grid', gap: 18, padding: 28, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="../../assets/logo/cashflow-mark-192.png" alt="" width="44" height="44" style={{ borderRadius: 11 }} />
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--muted-foreground)' }}>Household ledger</div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--foreground)' }}>Cashflow</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[['signin', 'Sign in'], ['signup', 'Create account']].map(([v, l]) => (
            <button key={v} type="button" onClick={() => setTab(v)} style={{
              padding: '9px 12px', borderRadius: 'var(--radius-lg)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
              border: `1px solid ${tab === v ? 'color-mix(in srgb, var(--primary) 55%, var(--border))' : 'var(--border)'}`,
              background: tab === v ? 'color-mix(in srgb, var(--primary) 14%, var(--card))' : 'var(--card)',
              color: 'var(--foreground)',
            }}>{l}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <Label>Email<Input type="email" defaultValue="dev@cashflow.local" /></Label>
          <Label>Password<Input type="password" defaultValue="cashflow-demo" /></Label>
          <Button variant="primary" onClick={onLogin} style={{ width: '100%' }}>{tab === 'signin' ? 'Sign in' : 'Create account'}</Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted-foreground)', fontSize: 12 }}>
          <span style={{ flex: 1, height: 1, background: 'var(--border)' }} /> or <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <Button variant="secondary" onClick={onLogin} style={{ width: '100%', borderColor: 'color-mix(in srgb, var(--positive) 42%, var(--border))', background: 'color-mix(in srgb, var(--positive) 12%, var(--card))' }}>
          <Icon4 name="Play" size={16} color="var(--positive)" /> Continue with demo account
        </Button>
      </Card>
    </div>
  )
}

window.CFAuth = AuthScreen
