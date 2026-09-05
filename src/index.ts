/**
 * The barrel exports only modules whose dependencies are required peers or
 * plain dependencies. Bundlers resolve the whole module graph before
 * tree-shaking, so a barrel that re-exported `sonner.tsx` would break every
 * consumer without `next-themes`. Everything with an optional peer is
 * reachable as `@aisocratic/design/components/<name>` only.
 */
export { cn, TYPE_SCALE } from "./cn.js"
export { controlBase, controlSize, controlColor, fieldVariants } from "./control-variants.js"
export * from "./tokens/index.js"

/* The page skeleton and the site chrome. */
export { Section, SectionHeading, RuledHeading, PageHero } from "./components/section.js"
export { SiteHeader, navLinkClass, type NavItem } from "./components/site-header.js"
export { SiteFooter, type FooterColumn } from "./components/site-footer.js"

/* The admin chrome. */
export { AdminShell, type AdminNavGroup, type AdminNavItem } from "./components/admin-shell.js"
export { PageHeader } from "./components/page-header.js"
export { PageToolbar } from "./components/page-toolbar.js"
export { StickyBar, stickyRailClass } from "./components/sticky-bar.js"
export { Breadcrumbs, type BreadcrumbItem } from "./components/breadcrumbs.js"
export { SegmentedControl, type SegmentedControlOption } from "./components/segmented-control.js"
export { MetricCard } from "./components/metric-card.js"

/* Tables. `DataTable` itself is a subpath (it composes Select and Checkbox). */
export {
  TableShell,
  ResultsSummary,
  SortIcon,
  SortableHeaderCell,
  SortableHeaderContent,
  useTableSort,
  tableHeadRow,
  tableHeadCell,
  tableBodyRow,
  tableBodyCell,
  type SortDirection,
} from "./components/table-parts.js"
export { PaginationControls } from "./components/pagination.js"
export { RowActions, RowAction } from "./components/row-actions.js"
export { FilterChip, FilterToolbar, FilterRail } from "./components/filters.js"

/* Forms. `SelectField`, `ToggleField` and `ConfirmDialog` are subpaths. */
export { FieldWrapper, useFieldIds, TextField, SearchField, labelClass, type TextFieldProps } from "./components/field.js"
export { FormSection, FormActions, ChoiceCard } from "./components/form-section.js"

/* Primitives. */
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
export {
  providerGlyphs,
  providerLabels,
  GoogleGlyph,
  AppleGlyph,
  GithubGlyph,
  MicrosoftGlyph,
  LinkedinGlyph,
  XGlyph,
  KeyGlyph,
  type ProviderId,
} from "./brand/provider-glyphs.js"
