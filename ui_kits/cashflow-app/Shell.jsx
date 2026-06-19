/* Cashflow app shell — 240px sticky sidebar (brand / collapsible nav / footer)
 * + top bar with command-palette trigger. Active nav link wears the faded
 * hero gradient fill plus a full-color gradient rail. */

const Icon = window.CFIcon

function Shell({ active, onNavigate, theme, onToggleTheme, onLogout, children }) {
  const D = window.CFData
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', background: 'var(--background)' }}>
      <Sidebar active={active} onNavigate={onNavigate} theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout} />
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar />
        <main style={{ margin: '0 auto', width: '100%', maxWidth: '80rem', flex: 1, padding: '20px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

function Sidebar({ active, onNavigate, theme, onToggleTheme, onLogout }) {
  const D = window.CFData
  return (
    <aside style={{
      position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', gap: 12,
      padding: 12, borderRight: '1px solid var(--border)', background: 'var(--card)', overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 8px' }}>
        <img src="../../assets/logo/cashflow-mark-192.png" alt="" width="40" height="40" style={{ borderRadius: 10 }} />
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--muted-foreground)' }}>Household ledger</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.01em' }}>Cashflow</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {D.nav.map((section) => (
          <div key={section.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px 12px 4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted-foreground)' }}>{section.label}</div>
            {section.items.map((item) => <NavLink key={item.to} item={item} active={active === item.to} onNavigate={onNavigate} />)}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <FooterButton icon={theme === 'dark' ? 'Sun' : 'Moon'} label={theme === 'dark' ? 'Light mode' : 'Dark mode'} onClick={onToggleTheme} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', fontSize: 14, color: 'var(--muted-foreground)' }}>
          <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{D.user.name}</span>
        </div>
        <FooterButton icon="LogOut" label="Log out" onClick={onLogout} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 8px 0', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>
          <span><span style={{ opacity: 0.7 }}>fe&nbsp;</span>2.4.1</span>
          <span><span style={{ opacity: 0.7 }}>be&nbsp;</span>2.4.1</span>
        </div>
      </div>
    </aside>
  )
}

function NavLink({ item, active, onNavigate }) {
  const [hover, setHover] = React.useState(false)
  const gradientFill = 'linear-gradient(135deg, color-mix(in oklch, var(--gradient-hero-from) 16%, transparent), color-mix(in oklch, var(--gradient-hero-to) 16%, transparent))'
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.to)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: 14, fontWeight: 600,
        fontFamily: 'var(--font-sans)', border: 'none', cursor: 'pointer', textAlign: 'left',
        transition: 'background 150ms, color 150ms',
        color: active ? 'var(--foreground)' : hover ? 'var(--zinc-50)' : 'var(--muted-foreground)',
        background: active ? gradientFill : hover ? 'var(--gradient-hero)' : 'transparent',
      }}
    >
      {active && <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--gradient-hero)', borderTopLeftRadius: 'inherit', borderBottomLeftRadius: 'inherit' }} />}
      <Icon name={item.icon} size={16} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge ? (
        <span style={{ minWidth: 20, textAlign: 'center', borderRadius: 999, padding: '1px 7px', fontSize: 12, fontWeight: 700, background: 'color-mix(in oklch, var(--primary) 18%, transparent)', color: active || hover ? 'inherit' : 'var(--foreground)' }}>{item.badge}</span>
      ) : null}
    </button>
  )
}

function FooterButton({ icon, label, onClick }) {
  const [hover, setHover] = React.useState(false)
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'flex-start',
        borderRadius: 'var(--radius-lg)', border: hover ? '1px solid transparent' : '1px solid var(--border)',
        padding: '8px 12px', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer',
        background: hover ? 'var(--gradient-hero)' : 'var(--card)', color: hover ? 'var(--zinc-50)' : 'var(--foreground)',
        transition: 'background 150ms, color 150ms',
      }}>
      <Icon name={icon} size={18} />
      {label}
    </button>
  )
}

function TopBar() {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--border)',
      background: 'color-mix(in oklch, var(--card) 92%, transparent)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 5,
    }}>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button type="button" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
          background: 'color-mix(in oklch, var(--background) 60%, transparent)', padding: '5px 8px', fontSize: 12, color: 'var(--muted-foreground)',
          fontFamily: 'var(--font-sans)', cursor: 'pointer',
        }}>
          <Icon name="Command" size={14} />
          <span>Search commands</span>
          <kbd style={{ marginLeft: 4, fontFamily: 'var(--font-mono)', fontSize: 10 }}>⌘K</kbd>
        </button>
        <IconButton name="Bell" />
        <IconButton name="MessageSquarePlus" />
      </div>
    </header>
  )
}

function IconButton({ name }) {
  const [hover, setHover] = React.useState(false)
  return (
    <button type="button" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34,
      borderRadius: 'var(--radius-md)', border: '1px solid transparent', background: hover ? 'var(--muted)' : 'transparent',
      color: 'var(--foreground)', cursor: 'pointer',
    }}>
      <Icon name={name} size={18} />
    </button>
  )
}

window.CFShell = Shell
