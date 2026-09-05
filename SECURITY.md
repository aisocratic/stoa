# Security Policy

## Reporting a vulnerability

Email **security@aisocratic.org**. Please do not open a public issue.

Include what you found, how to reproduce it, and what an attacker could do with
it. We aim to acknowledge within 72 hours.

## Trust model

AI Socratic Design is a client-side design-system package. It does not provide
authentication, authorization, data storage, network services, or server-side
input validation. Applications remain responsible for those security
boundaries.

Consumers should treat component props and token overrides as application input:

- Do not render untrusted HTML through component children.
- Validate URLs before passing them to navigation props.
- Keep React, Radix, and other peer dependencies on supported security releases.
- Review generated CSS and package provenance when upgrading.

## Supported versions

AI Socratic Design is pre-1.0. Security fixes land on `main` and in the next
release; there are no backports yet.
