# Contributing to Stoa

Stoa is the design system behind aisocratic.org and its sibling apps. It is
small on purpose: one typed token source, one generator, a handful of
primitives. Changes that grow it should make a consumer's life easier, not
give the package more surface.

## Working on it

```bash
pnpm install
pnpm verify        # typecheck + build + unit tests
pnpm site:dev      # the gallery, at http://localhost:3000
```

Tokens live in `src/tokens/*.ts` and nowhere else. `pnpm build` regenerates
`dist/css/*.css` and `dist/tokens.json`; never edit those by hand. The
rationale comments in the token files are the design principles — keep them
current when you change a value.

## Rules that tests enforce

- No font binary is ever committed (`tests/no-font-binaries.test.ts`).
- Every text role clears its WCAG bar in both modes (`tests/contrast.test.ts`).
- `TYPE_SCALE` in `cn()` is derived from the token source, so adding a step
  is one edit (`tests/cn-type-scale.test.ts`).
- Every release has a `CHANGELOG.md` entry (`tests/changelog.test.ts`).

## Releasing

1. Add a `## [x.y.z]` section to `CHANGELOG.md`.
2. `pnpm version <patch|minor|major>` — commits and tags `vx.y.z`.
3. `git push --follow-tags`. The `release` workflow verifies the tag matches
   `package.json`, runs `pnpm verify` and the gallery smoke test, publishes to
   npm with provenance, and creates the GitHub release.
