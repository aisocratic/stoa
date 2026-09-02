/**
 * The barrel exports only modules whose dependencies are required peers or
 * plain dependencies. Bundlers resolve the whole module graph before
 * tree-shaking, so a barrel that re-exported `sonner.tsx` would break every
 * consumer without `next-themes`. Everything with an optional peer is
 * reachable as `@aisocratic/stoa/components/<name>` only.
 */
export { cn, TYPE_SCALE } from "./cn.js"
export { controlBase, controlSize, controlColor, fieldVariants } from "./control-variants.js"
export * from "./tokens/index.js"

export { Section, SectionHeading, RuledHeading, PageHero } from "./components/section.js"
export { Button, buttonVariants } from "./components/button.js"
export { Badge, statusBadgeToneClasses, type BadgeProps, type BadgeTone } from "./components/badge.js"
export { Card, cardSurface } from "./components/card.js"
export { Input } from "./components/input.js"
export { Textarea } from "./components/textarea.js"
export { Skeleton, SkeletonTable } from "./components/skeleton.js"
export { Spinner } from "./components/spinner.js"
export { Alert, AlertTitle, AlertDescription } from "./components/alert.js"
export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "./components/table.js"
export { EmptyState } from "./components/empty-state.js"
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./components/collapsible.js"

export { LogoMark } from "./brand/logo-mark.js"
export { Wordmark } from "./brand/wordmark.js"
