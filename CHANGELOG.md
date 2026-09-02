# Changelog

All notable changes to `@aisocratic/stoa`. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow semver.

## [0.1.0] — 2026-09-02

First extraction from aisocratic.org.

### Added
- Typed token source (`src/tokens`): semantic colours in light and dark, the
  nine-step golden-ratio type scale, the φ radius ladder, three font roles as
  app-filled slots, the page-shell measure, and brand constants.
- Generated outputs: `tailwind.css` (Tailwind v4 theme), `tokens.css` (plain
  custom properties), `tokens.json`, and a React-Native-shaped `native` export.
- `cn()` with the type-scale-aware `tailwind-merge`, and the shared control
  variants (`controlBase`, `controlSize`, `controlColor`, `fieldVariants`).
- React primitives: Section family, Button, Badge, Card, Input, Textarea,
  Label, Select, Dialog, Sheet, Popover, Tooltip, Tabs, DropdownMenu,
  ScrollArea, Progress, Avatar, Checkbox, Switch, Command, Table, Alert,
  Skeleton, Spinner, EmptyState, Collapsible, Sonner toaster.
- Brand: `LogoMark`, `Wordmark`.
- Semantic status tokens (`--status-success` … `--status-accent`); `Badge`
  tones now use them instead of raw palette classes.
- Theme selectors that serve next-themes (`.dark`), a `data-theme` attribute,
  and OS preference from one stylesheet.
- Docs, an installable Claude Code skill, and a gallery site.

### Changed (vs the source codebase)
- Display face is Newsreader 200 (OFL). The previous licensed face is not
  shipped and no font binary ever will be.
- No `--font-mono` alias: use `font-body` or `font-code`.
