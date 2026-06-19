import * as React from 'react'

/**
 * Raised surface — the app's default elevation unit. White `--card` fill,
 * `--border` hairline, `rounded-lg`, light `--shadow`. Compose with the
 * sub-parts; keep elevation light (no heavy drop shadows).
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export declare function Card(props: CardProps): React.JSX.Element
export declare function CardHeader(props: CardProps): React.JSX.Element
export declare function CardTitle(props: CardProps): React.JSX.Element
export declare function CardDescription(props: CardProps): React.JSX.Element
export declare function CardContent(props: CardProps): React.JSX.Element
