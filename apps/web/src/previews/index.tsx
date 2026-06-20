'use client'
import * as React from 'react'
import {
  // core
  Accordion,
  Avatar,
  Badge,
  Button,
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Kbd,
  Link,
  Progress,
  Separator,
  Spinner,
  Text,
  // data
  LetterAvatar,
  StatCard,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Tabs,
  // feedback
  Alert,
  EmptyState,
  Skeleton, SkeletonText,
  // finance
  AccountCard,
  AmountText,
  BudgetMeter,
  CategoryBreakdown,
  CategoryPill,
  ImportDropzone,
  MoneyInput,
  PeriodSelector,
  Sparkline,
  // forms
  Checkbox,
  Combobox,
  Input,
  Label,
  NativeSelect,
  RadioGroup,
  Slider,
  Stepper,
  Switch,
  Textarea,
  ToggleGroup,
  // navigation
  Breadcrumb,
  Pagination,
  // overlays
  Dialog,
  DropdownMenu,
  Toast,
  Tooltip,
} from '@connor-adams/designsystem'

// ---------------------------------------------------------------------------
// Controlled wrappers — defined as named function components so hooks are valid
// (module is already 'use client')
// ---------------------------------------------------------------------------

function TabsPreview(): React.JSX.Element {
  const [value, setValue] = React.useState('month')
  return (
    <Tabs
      items={[
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'quarter', label: 'Quarter' },
        { value: 'year', label: 'Year' },
      ]}
      value={value}
      onValueChange={setValue}
    />
  )
}

function PeriodSelectorPreview(): React.JSX.Element {
  const [value, setValue] = React.useState('this-month')
  return <PeriodSelector value={value} onValueChange={setValue} />
}

function PaginationPreview(): React.JSX.Element {
  const [page, setPage] = React.useState(3)
  return <Pagination page={page} pageCount={10} onPageChange={setPage} siblingCount={1} />
}

// ---------------------------------------------------------------------------
// slug → representative live preview. One curated render per component.
// (Storybook holds the exhaustive variant matrices; this is the docs-site showcase.)
// ---------------------------------------------------------------------------
export const previews: Record<string, React.ReactNode> = {
  // --- core -----------------------------------------------------------------
  accordion: (
    <Accordion
      items={[
        { value: 'billing', title: 'Billing & Payments', content: 'Manage your payment methods, view past invoices, and update billing information.' },
        { value: 'security', title: 'Security Settings', content: 'Configure two-factor authentication, review active sessions, and set password policies.' },
        { value: 'notifications', title: 'Notifications', content: 'Choose which events trigger email or push notifications for your account.' },
      ]}
      type="single"
      collapsible
      defaultValue="billing"
    />
  ),

  avatar: (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar name="Connor Adams" size="sm" />
      <Avatar name="Connor Adams" size="md" status="online" />
      <Avatar name="Connor Adams" size="lg" ring status="away" />
    </div>
  ),

  badge: (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Paid</Badge>
      <Badge variant="destructive">Overdue</Badge>
      <Badge variant="outline">Pending</Badge>
      <Badge variant="count">12</Badge>
    </div>
  ),

  button: (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Add transaction</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="destructive" size="sm">Delete</Button>
    </div>
  ),

  card: (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader>
        <CardTitle>Monthly Summary</CardTitle>
        <CardDescription>Your spending overview for June 2025.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 'var(--text-body)' }}>
          Total expenses: $3,240.00
        </p>
      </CardContent>
    </Card>
  ),

  kbd: (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Kbd>⌘K</Kbd>
      <Kbd>⌘⇧P</Kbd>
      <Kbd>Esc</Kbd>
    </div>
  ),

  link: (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Link href="#">View transactions</Link>
      <Link href="#" muted>Learn more</Link>
      <Link href="#" subtle>See details</Link>
    </div>
  ),

  progress: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
      <Progress value={60} />
      <Progress value={74} tone="warning" label="Dining" showValue />
      <Progress value={100} tone="success" />
    </div>
  ),

  separator: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
      <Separator />
      <Separator label="or continue with" />
    </div>
  ),

  spinner: (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Spinner size="sm" tone="muted" />
      <Spinner size="default" tone="primary" />
      <Spinner size="lg" />
    </div>
  ),

  text: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text variant="headline">Monthly Budget Overview</Text>
      <Text variant="body" tone="muted">Last updated 2 hours ago</Text>
      <Text variant="body" tone="positive" weight="semibold">+$340.00</Text>
      <Text variant="body" tone="negative" weight="semibold">-$85.20</Text>
    </div>
  ),

  // --- data -----------------------------------------------------------------
  // letter-avatar:
  'letter-avatar': (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <LetterAvatar text="TD Bank" size="sm" />
      <LetterAvatar text="Acme Corp" size="md" />
      <LetterAvatar text="Scotiabank" size="lg" />
      <LetterAvatar text="Royal Bank" size="xl" />
    </div>
  ),

  // stat-card:
  'stat-card': (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <StatCard label="Total Spending" value="$3,240.00" delta="+$340" metricKind="spend" />
      <StatCard label="Total Income" value="$8,500.00" delta="+$650" metricKind="gain" hint="vs. last month" />
    </div>
  ),

  table: (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Jun 15</TableCell>
          <TableCell>Whole Foods Market</TableCell>
          <TableCell>Groceries</TableCell>
          <TableCell>−$94.32</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jun 14</TableCell>
          <TableCell>Acme Corp Payroll</TableCell>
          <TableCell>Income</TableCell>
          <TableCell>+$4,250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jun 13</TableCell>
          <TableCell>Netflix Subscription</TableCell>
          <TableCell>Subscriptions</TableCell>
          <TableCell>−$18.99</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),

  tabs: <TabsPreview />,

  // --- feedback -------------------------------------------------------------
  alert: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 420 }}>
      <Alert variant="info" title="Heads up">
        Your bank connection will expire in 3 days. Reconnect to keep syncing.
      </Alert>
      <Alert variant="success" title="Import complete">
        147 transactions imported successfully.
      </Alert>
    </div>
  ),

  // empty-state:
  'empty-state': (
    <EmptyState
      title="No transactions yet"
      description="Connect a bank account to start importing your transactions."
    />
  ),

  skeleton: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
      <Skeleton h={24} w="60%" />
      <SkeletonText lines={3} />
    </div>
  ),

  // --- finance --------------------------------------------------------------
  // account-card:
  'account-card': (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 380 }}>
      <AccountCard
        name="TD Everyday Chequing"
        institution="TD"
        mask="4321"
        balance={4820.5}
        currency="CAD"
        locale="en-CA"
        kind="chequing"
        status="synced"
      />
      <AccountCard
        name="Scotiabank Visa"
        institution="Scotia"
        mask="7788"
        balance={-1480.25}
        kind="credit"
        status="synced"
      />
    </div>
  ),

  // amount-text:
  'amount-text': (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
      <AmountText value={4250} currency="CAD" locale="en-CA" direction="in" colored showSign />
      <AmountText value={-94.32} currency="CAD" locale="en-CA" direction="out" colored showSign />
    </div>
  ),

  // budget-meter:
  'budget-meter': (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
      <BudgetMeter label="Groceries" spent={320} limit={500} currency="CAD" locale="en-CA" />
      <BudgetMeter label="Dining Out" spent={445} limit={500} currency="CAD" locale="en-CA" />
      <BudgetMeter label="Entertainment" spent={620} limit={400} currency="CAD" locale="en-CA" />
    </div>
  ),

  // category-breakdown:
  'category-breakdown': (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <CategoryBreakdown
        title="Net spend by category"
        subtitle="This month · transfers excluded"
        trend={[12, 9, 14, 11, 18, 16, 22]}
        currency="CAD"
        locale="en-CA"
        rows={[
          { category: 'groceries', amount: -842 },
          { category: 'dining', amount: -586 },
          { category: 'transport', amount: -418 },
          { category: 'subscriptions', amount: -214 },
          { category: 'utilities', amount: -176 },
        ]}
      />
    </div>
  ),

  // category-pill:
  'category-pill': (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <CategoryPill category="groceries" />
      <CategoryPill category="income" />
      <CategoryPill category="dining" />
      <CategoryPill category="transport" />
      <CategoryPill category="subscriptions" />
    </div>
  ),

  // import-dropzone:
  'import-dropzone': (
    <ImportDropzone accept=".csv,.ofx,.qfx" hint="CSV, OFX or QFX · up to 10MB" />
  ),

  // money-input:
  'money-input': (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 240 }}>
      <MoneyInput currency="CAD" locale="en-CA" defaultValue={1250} direction="in" />
      <MoneyInput currency="CAD" locale="en-CA" defaultValue={94.32} direction="out" />
    </div>
  ),

  // period-selector:
  'period-selector': <PeriodSelectorPreview />,

  sparkline: (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
      <Sparkline data={[3, 7, 4, 9, 6, 11, 8]} width={96} height={28} area dot strokeWidth={2} />
      <Sparkline data={[11, 9, 8, 6, 5, 3, 2]} width={96} height={28} area dot strokeWidth={2} tone="negative" />
    </div>
  ),

  // --- forms ----------------------------------------------------------------
  checkbox: (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Checkbox />
      <Checkbox defaultChecked />
      <Checkbox indeterminate />
      <Checkbox disabled />
    </div>
  ),

  combobox: (
    <Combobox
      options={[
        { value: 'checking', label: 'Checking', hint: '••4521' },
        { value: 'savings', label: 'Savings', hint: '••8830' },
        { value: 'credit', label: 'Credit Card', hint: '••1234' },
        { value: 'investment', label: 'Investment', hint: '••9977' },
      ]}
      placeholder="Search accounts…"
      defaultValue="savings"
    />
  ),

  input: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 280 }}>
      <Input placeholder="Enter a value…" />
      <Input defaultValue="Hello, world" />
      <Input invalid defaultValue="bad input" />
    </div>
  ),

  label: (
    <Label htmlFor="acct-preview">
      Account name
      <Input id="acct-preview" placeholder="e.g. My Checking" />
    </Label>
  ),

  // native-select:
  'native-select': (
    <NativeSelect
      options={[
        { value: 'food', label: 'Food & Dining' },
        { value: 'transport', label: 'Transportation' },
        { value: 'housing', label: 'Housing' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'health', label: 'Health & Wellness' },
      ]}
    />
  ),

  // radio-group:
  'radio-group': (
    <RadioGroup
      options={[
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'yearly', label: 'Yearly' },
      ]}
      defaultValue="monthly"
    />
  ),

  slider: (
    <div style={{ maxWidth: 280 }}>
      <Slider min={0} max={100} defaultValue={40} showValue />
    </div>
  ),

  stepper: <Stepper defaultValue={3} min={0} max={20} />,

  switch: (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Switch />
      <Switch defaultChecked />
      <Switch size="sm" defaultChecked />
      <Switch disabled />
    </div>
  ),

  textarea: (
    <Textarea
      placeholder="Add a note…"
      defaultValue="Transfer to savings for upcoming vacation fund."
      style={{ maxWidth: 320 }}
    />
  ),

  // toggle-group:
  'toggle-group': (
    <ToggleGroup
      items={[
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
        { value: 'chart', label: 'Chart' },
      ]}
      defaultValue="list"
    />
  ),

  // --- navigation -----------------------------------------------------------
  breadcrumb: (
    <Breadcrumb
      items={[
        { label: 'Home', href: '/' },
        { label: 'Accounts', href: '/accounts' },
        { label: 'Transactions' },
      ]}
    />
  ),

  pagination: <PaginationPreview />,

  // --- overlays -------------------------------------------------------------
  dialog: (
    // `transform` establishes a containing block so the Dialog's position:fixed
    // scrim is contained to this preview cell instead of covering the whole page.
    <div style={{ position: 'relative', height: 280, overflow: 'hidden', borderRadius: 'var(--radius-md)', transform: 'translateZ(0)' }}>
      <Dialog
        open
        title="Confirm action"
        description="This action cannot be undone. Are you sure you want to continue?"
      />
    </div>
  ),

  // dropdown-menu:
  'dropdown-menu': (
    <DropdownMenu
      trigger={
        <button
          type="button"
          style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--card)', cursor: 'pointer' }}
        >
          Options ▾
        </button>
      }
      items={[
        { label: 'Edit', shortcut: '⌘E', onSelect: () => {} },
        { label: 'Duplicate', shortcut: '⌘D', onSelect: () => {} },
        { separator: true },
        { label: 'Share', onSelect: () => {} },
        { separator: true },
        { label: 'Delete', danger: true, onSelect: () => {} },
      ]}
      align="start"
    />
  ),

  toast: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Toast variant="success" title="Transaction imported">
        142 transactions were added to your account.
      </Toast>
      <Toast variant="warning" title="Budget exceeded">
        You have exceeded your monthly dining budget by $24.
      </Toast>
    </div>
  ),

  tooltip: (
    <Tooltip content="Helpful information" side="top">
      <button
        type="button"
        style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--card)', cursor: 'pointer' }}
      >
        Hover me
      </button>
    </Tooltip>
  ),
}
