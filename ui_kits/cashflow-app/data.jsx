/* Mock data for the Cashflow UI kit. Demo-account style figures — a household
 * ledger in CAD with business/personal splits. */

window.CFData = {
  user: { name: 'Sam Rivera', household: 'Rivera household' },

  nav: [
    { id: 'today', label: 'Today', items: [
      { to: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { to: 'inbox', label: 'Inbox', icon: 'Inbox', badge: 7 },
      { to: 'chat', label: 'Chat', icon: 'MessageSquare' },
    ]},
    { id: 'money', label: 'Money', items: [
      { to: 'accounts', label: 'Accounts', icon: 'CreditCard' },
      { to: 'income', label: 'Income', icon: 'DollarSign' },
      { to: 'transactions', label: 'Transactions', icon: 'ReceiptText' },
      { to: 'receipts', label: 'Receipts', icon: 'Receipt' },
      { to: 'import', label: 'Import', icon: 'Upload' },
    ]},
    { id: 'planning', label: 'Planning', items: [
      { to: 'budgets', label: 'Budgets', icon: 'PiggyBank' },
      { to: 'planned', label: 'Planned', icon: 'CalendarClock' },
      { to: 'goals', label: 'Goals', icon: 'Target' },
      { to: 'scenarios', label: 'Scenarios', icon: 'GitCompare' },
    ]},
    { id: 'investments', label: 'Investments', items: [
      { to: 'portfolio', label: 'Portfolio', icon: 'LineChart' },
    ]},
    { id: 'insights', label: 'Insights & rules', items: [
      { to: 'rules', label: 'Rules', icon: 'BookOpenCheck' },
      { to: 'reports', label: 'Reports', icon: 'BarChart3' },
    ]},
  ],

  stats: [
    { label: 'Net spend', value: '$4,212', hint: 'This month · CAD', delta: '-8%', metricKind: 'spend' },
    { label: 'Income', value: '$9,840', hint: 'vs last month', delta: '+3%', metricKind: 'gain' },
    { label: 'Net worth', value: '$184,320', hint: 'Across 6 accounts', delta: '+1.9%', metricKind: 'gain' },
  ],

  kpis: [
    { label: 'Transactions', value: '312', hint: 'Rows in current filters', delta: '+24', metricKind: 'neutral' },
    { label: 'Merchants', value: '88', hint: 'Distinct merchants' },
    { label: 'Accounts', value: '6', hint: 'With activity in period' },
  ],

  categories: [
    { name: 'Groceries', amount: 1284, pct: 100 },
    { name: 'Dining', amount: 642, pct: 50 },
    { name: 'Transport', amount: 410, pct: 32 },
    { name: 'Subscriptions', amount: 268, pct: 21 },
    { name: 'Utilities', amount: 224, pct: 17 },
    { name: 'Shopping', amount: 196, pct: 15 },
  ],

  budgets: [
    { label: 'Groceries', spent: 1284, target: 1400, pct: 92, elapsed: 62, tone: 'warn' },
    { label: 'Dining', spent: 642, target: 600, pct: 107, elapsed: 62, tone: 'over' },
    { label: 'Transport', spent: 410, target: 700, pct: 59, elapsed: 62, tone: 'ok' },
    { label: 'Fun money', spent: 180, target: 500, pct: 36, elapsed: 62, tone: 'ok' },
  ],

  biz: { incomeBiz: 38, incomePersonal: 62, spendBiz: 27, spendPersonal: 73 },

  transactions: [
    { id: 1, date: '2026-06-18', merchant: 'Whole Foods Market', account: 'Amex Cobalt', category: 'Groceries', amount: -84.20, biz: false, status: 'cleared' },
    { id: 2, date: '2026-06-17', merchant: 'Payroll · Northwind Inc', account: 'TD Chequing', category: 'Income', amount: 4900.00, biz: false, status: 'cleared' },
    { id: 3, date: '2026-06-17', merchant: 'Netflix', account: 'Amex Cobalt', category: 'Subscriptions', amount: -20.99, biz: false, status: 'cleared' },
    { id: 4, date: '2026-06-16', merchant: 'Esso', account: 'Visa Infinite', category: 'Transport', amount: -71.40, biz: false, status: 'cleared' },
    { id: 5, date: '2026-06-16', merchant: 'Figma', account: 'Amex Cobalt', category: 'Software', amount: -18.00, biz: true, status: 'review' },
    { id: 6, date: '2026-06-15', merchant: 'The Coffee Bar', account: 'Amex Cobalt', category: 'Dining', amount: -6.75, biz: false, status: 'cleared' },
    { id: 7, date: '2026-06-15', merchant: 'Hydro One', account: 'TD Chequing', category: 'Utilities', amount: -142.10, biz: false, status: 'cleared' },
    { id: 8, date: '2026-06-14', merchant: 'Amazon.ca', account: 'Visa Infinite', category: 'Shopping', amount: -56.32, biz: false, status: 'review' },
    { id: 9, date: '2026-06-14', merchant: 'Client retainer · Atlas Co', account: 'Wealthsimple', category: 'Income', amount: 1200.00, biz: true, status: 'cleared' },
    { id: 10, date: '2026-06-13', merchant: 'Uber', account: 'Amex Cobalt', category: 'Transport', amount: -23.80, biz: false, status: 'cleared' },
  ],

  reviewQueue: [
    { date: '2026-06-16', merchant: 'Figma', account: 'Amex Cobalt', category: 'Software', amount: -18.00 },
    { date: '2026-06-14', merchant: 'Amazon.ca', account: 'Visa Infinite', category: null, amount: -56.32 },
  ],
}
