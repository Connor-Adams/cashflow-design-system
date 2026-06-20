'use client'

import * as React from 'react'
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  AmountText,
  StatCard,
} from '@connor-adams/designsystem'

export function Showcase() {
  return (
    <section
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      {/* Buttons */}
      <Card style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 200 }}>
        <CardHeader style={{ padding: 0, marginBottom: 4 }}>
          <CardTitle style={{ fontSize: 'var(--text-body-sm)', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--muted-foreground)', fontWeight: 500 }}>
            Button
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Button variant="primary" size="sm">Pay now</Button>
          <Button variant="secondary" size="sm">Cancel</Button>
          <Button variant="ghost" size="sm">Learn more</Button>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 180 }}>
        <CardHeader style={{ padding: 0, marginBottom: 4 }}>
          <CardTitle style={{ fontSize: 'var(--text-body-sm)', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--muted-foreground)', fontWeight: 500 }}>
            Badge
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Badge variant="default">Brand</Badge>
          <Badge variant="success">Paid</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="outline">Pending</Badge>
        </CardContent>
      </Card>

      {/* StatCard */}
      <StatCard
        label="Monthly spend"
        value="$4,218"
        delta="-$340"
        metricKind="spend"
        style={{ minWidth: 180 }}
      />

      {/* AmountText */}
      <Card style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 180 }}>
        <CardHeader style={{ padding: 0, marginBottom: 4 }}>
          <CardTitle style={{ fontSize: 'var(--text-body-sm)', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--muted-foreground)', fontWeight: 500 }}>
            AmountText
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <AmountText value={1250.00} direction="in" size="lg" />
          <AmountText value={89.99} direction="out" size="lg" />
          <AmountText value={0} direction="zero" size="lg" />
        </CardContent>
      </Card>
    </section>
  )
}
