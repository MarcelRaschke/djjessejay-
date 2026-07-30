
# djjessejay.ch
djjessejay.ch
@dependabot
## M10-4 Import your data

- [Notion · Obsidian · Paperclip Data Mythos](import-your-data.html)

## M10-46 Anthropic Mythos

- [Anthropic Mythos · IP Codex](anthropic-mythos.html)
- [Cloudflare Worker Assistent](workers/anthropic-mythos-assistant.js)

## M10-72 Recurring Anthropic Mythos

- [Recurring Anthropic Mythos · IP Codex](recurring-anthropic-mythos.html)
- [Recurring Cloudflare Worker Assistent](workers/recurring-anthropic-mythos-assistant.js)

## Cloudflare Pages

Der Workflow [`cloudflare-pages.yml`](.github/workflows/cloudflare-pages.yml) veröffentlicht
den statischen Inhalt bei jedem Push auf `main` im Cloudflare-Pages-Projekt
`djjessejay`. Er zeigt vor dem Deployment mit `git remote -v`, aus welchem
Git-Repository der Build stammt.

Für das Deployment müssen im GitHub-Repository die Actions-Secrets
`CLOUDFLARE_API_TOKEN` (mit Pages-Schreibzugriff) und
`CLOUDFLARE_ACCOUNT_ID` hinterlegt sein. Cloudflare Pages selbst ist kein
Git-Remote; der Workflow lädt den ausgecheckten Stand mit Wrangler hoch.
