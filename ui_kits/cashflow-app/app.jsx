/* Cashflow UI kit — root. Login → app shell with dashboard / transactions.
 * Theme toggle flips data-theme on <html> (the same single token layer). */

function CashflowApp() {
  const [authed, setAuthed] = React.useState(false)
  const [screen, setScreen] = React.useState('dashboard')
  const [theme, setTheme] = React.useState('light')

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  if (!authed) return <window.CFAuth onLogin={() => setAuthed(true)} />

  const Shell = window.CFShell
  return (
    <Shell
      active={screen}
      onNavigate={setScreen}
      theme={theme}
      onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      onLogout={() => setAuthed(false)}
    >
      {screen === 'transactions'
        ? <window.CFTransactions onNavigate={setScreen} />
        : <window.CFDashboard onNavigate={setScreen} />}
    </Shell>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<CashflowApp />)
