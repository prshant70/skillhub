# Disabled workflows

These workflows came from upstream (`iflytek/skillhub`). GitHub Actions only
executes workflows in `.github/workflows/`, so parking them here disables all of
them without deleting anything.

They are disabled because this fork has none of the secrets, registries, or
external services they expect, and several are tied to the upstream community
rather than to the code.

## Re-enabling one

```bash
git mv .github/workflows-disabled/<name>.yml .github/workflows/<name>.yml
```

Check the workflow's `secrets:` and registry references before re-enabling.

## Triage

**Re-enable first — genuine CI value**

| Workflow | Needs before re-enabling |
|---|---|
| `pr-tests.yml` | nothing; backend + frontend tests |
| `pr-e2e.yml` | nothing; Playwright |
| `pr-scripts.yml` | nothing; shell script lint |
| `pr-helm-chart.yml` | nothing; chart lint |
| `pr-cli.yml` | only if we keep the CLI |
| `pr-scanner-image.yml` | scanner image build target |
| `security.yml` | review the scheduled trigger and any code-scanning setup |

**Re-enable later — needs our own registry / hosting**

| Workflow | Needs before re-enabling |
|---|---|
| `publish-images.yml` | our container registry + credentials |
| `publish-chart.yml` | our chart repository |
| `deploy-docs.yml` | our docs hosting (currently GitHub Pages at `/skillhub/`) |
| `pr-batch-test-deploy.yml` | `workflow_dispatch` only; deploy target |

**Probably delete — upstream community automation, not applicable here**

`claim-issue-reward.yml`, `statistic-member-reward.yml`, `issue-triage.yml`,
`issue-backlog-rescore.yml` (upstream's contributor reward and LLM issue triage
programs), `deepwiki.yml` (external DeepWiki service), `release-notes.yml` and
`release-cli.yml` (upstream release and npm publishing), `riscv64-images.yml`
(riscv64 builds we do not ship).

Their supporting Deno scripts live in `.github/scripts/` and can go at the same
time.
