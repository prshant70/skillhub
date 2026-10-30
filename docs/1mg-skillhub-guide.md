# 1mg SkillHub

1mg SkillHub is an internal registry for agent skills. A skill is a small package
of instructions and supporting files that teaches an AI agent how to do something in a particular way i.e. run a particular deploy, follow a review checklist, query a
specific system.

Instead of everyone keeping their own prompts in a scratch file, you publish a
skill once and anyone can install it into their agent.

The registry runs at **https://skillhub.1mg.com**.

---

## Getting access

Open https://skillhub.1mg.com and click **Login with Google**. Use your 1mg
account, the first sign-in creates your account.

Only `@1mg.com` Google accounts can sign in. Personal Gmail accounts are
rejected.

The **Admin Login** tab next to the OAuth tab is a username and password fallback for
platform administrators. Regular users will not need it.

### If sign-in fails

- **"Account is disabled"** - your account exists but has been turned off. Ask a
  platform admin to re-enable it.
- **Google says the app is blocked** - you are probably signed into a personal
  Google account in that browser profile. Sign out, or use a different profile.
- **Anything else** - note the error text and contact the platform team.

---

## Finding skills

Once you are in, there are three ways to find something.

**Search** is the main one. The search box matches skill names and descriptions.

**Browse** from the Skills page if you are not sure what you are looking for.

**Open-source catalogue** under the GitHub section lists skills discovered from
public GitHub repositories, reviewed before they appear.

Every skill has a detail page showing what it does, who published it, its
version history, and the exact command to install it.

### How skills are named

Skills use a two-part coordinate:

```
@namespace/skill-name
```

The namespace says who owns it. `@global` is the shared platform namespace that
everyone can see. Team namespaces look like `@platform-eng/deploy-checklist`.

You will need the full coordinate when installing, so copy it from the skill
page rather than typing it.

---

## Using skills in your agent

This is the part most people need. There are two ways to do it: let your agent
set itself up, or run the CLI yourself.

### Option 1: let your agent connect itself

This is the easiest route if you use Claude Code, Codex, or Cursor. Paste this
into your agent:

```
Connect 1mg SkillHub using https://skillhub.1mg.com/registry/skill.md
```

That URL serves a setup guide the agent reads and follows. It will install the
CLI, connect to the registry, and then be able to search and install skills when
you ask it to. After that you can just say things like "install the deploy
checklist skill from SkillHub".

You only need to do this once per machine.

### Option 2: use the CLI directly

You need **Node.js 18 or newer**.

```bash
npm install --global @astron-team/skillhub
```

Check it worked:

```bash
skillhub version
```

Point it at the registry. You can either pass `--registry` on every command, or
set it once:

```bash
export SKILLHUB_REGISTRY=https://skillhub.1mg.com
```

Search for something:

```bash
skillhub search "deploy" --registry https://skillhub.1mg.com
```

Install a skill. Replace `<agent>` with `claude-code`, `codex`, or `cursor`:

```bash
skillhub install @global/deploy-checklist \
  --scope user \
  --agent claude-code \
  --registry https://skillhub.1mg.com
```

`--scope user` installs it for you across all projects. Leave it off to install
into the current project only.

List what you have installed:

```bash
skillhub list --agent claude-code --registry https://skillhub.1mg.com
```

Upgrade a skill. Check first, then apply:

```bash
skillhub upgrade @global/deploy-checklist --check --registry https://skillhub.1mg.com
```

If a command or flag is not covered here, ask the CLI rather than guessing:

```bash
skillhub help install
```

### One thing that catches people out

Installing a skill puts the files on disk. It does **not** load them into an
agent session that is already running. If the agent cannot see a skill you just
installed, start a new session.

---

## Signing in from the CLI

Searching and installing public skills works without signing in. You need to
authenticate for private skills and for publishing.

### Device login (recommended)

```bash
skillhub login --registry https://skillhub.1mg.com
```

It prints a short code and asks you to open https://skillhub.1mg.com/device in a
browser. Enter the code there, approve it, and the CLI picks up the credential
automatically. Nothing is typed into your terminal.

### API token

For CI or scripts, create a token instead:

1. Go to **Dashboard → API Tokens**
2. Create a token and copy it — it is shown once and never again
3. Store it in your CI secret store

Use it through the environment, never on the command line:

```bash
read -rsp "SkillHub token: " SKILLHUB_TOKEN && echo
export SKILLHUB_TOKEN
skillhub login --registry https://skillhub.1mg.com
unset SKILLHUB_TOKEN
```

Confirm who you are:

```bash
skillhub whoami --registry https://skillhub.1mg.com
```

Do not paste a token into a chat window, a prompt, a committed file, or your
shell history. If one leaks, delete it from the Dashboard — that takes effect
immediately.

---

## Publishing a skill

### What a skill package looks like

A skill is a folder with a `SKILL.md` file at its root. Everything else is
optional supporting material — scripts, templates, reference docs.

`SKILL.md` starts with a YAML block. `name` and `description` are required:

```markdown
---
name: deploy-checklist
description: Walks through the pre-deploy checks for backend services.
---

# Deploy checklist

Write the actual instructions here, as if explaining to a new joiner.
```

The description matters more than you would expect — it is what people see in
search results, and it is how an agent decides whether a skill is relevant. Make
it specific. "Checks before deploying a backend service" is useful; "deploy
helper" is not.

### Limits

| Limit | Value |
|---|---|
| Files per package | 500 |
| Single file | 10 MB |
| Whole package | 100 MB |

File types are restricted to a known list — documentation, config, source code,
images, and Office documents. Executables and archives are rejected.

### Uploading

1. Go to **Dashboard → Publish**
2. Drop in your folder or zip
3. Pick the namespace to publish under
4. Submit

The package is validated and security-scanned on upload. If something is wrong —
missing `SKILL.md`, a disallowed file type, over a size limit — you get the
error straight away and nothing is published.

### Review

Your first version of a skill goes to **pending review** rather than straight to
published. A reviewer approves or rejects it, and you get a notification either
way. Track it under **Dashboard → My Skills**.

You can withdraw a version from review if you spot a problem before anyone has
looked at it.

### Versions

Publishing again creates a new version; it does not overwrite the old one.
People stay on the version they installed until they choose to upgrade.

If you publish something broken, **yank** the version. It stops being offered to
new installs, and anyone who already has it keeps working.

---

## Namespaces

Namespaces control who can publish what.

- **`@global`** — shared platform namespace, visible to everyone
- **Team namespaces** — owned by a team, e.g. `@platform-eng`

Everyone gets access to `@global`. For a team namespace, ask the owner for an
invite; you will get a link that adds you when you open it. Manage your
namespaces under **Dashboard → Namespaces**.

Roles within a namespace are Owner, Admin, and Member. Owners and Admins can
invite people and manage what gets published; Members can publish.

---

## Other things you can do

**Star** a skill to bookmark it. Your stars live under Dashboard → Stars.

**Subscribe** to a skill and you get notified when a new version is published.
Worth doing for anything you depend on.

**Rate and review** skills so others know what is actually useful.

**Report** a skill that is broken, misleading, or inappropriate. Reports go to
the governance queue, not to the author directly.

**Suites** group related skills so they can be installed together.

Notifications appear in the bell icon in the header, and you can adjust what you
receive under Settings → Notifications.

---

## For administrators

Admin pages live under `/admin` and are only visible with the right role.

| Page | What it is for |
|---|---|
| Users | Change roles, enable or disable accounts |
| System Config | Turn password login and self-registration on or off, manage role grants |
| Namespaces | Create and manage namespaces |
| Labels | Manage the label taxonomy |
| Audit Log | Who did what, and when |

Platform roles are `SUPER_ADMIN`, `SKILL_ADMIN`, `USER_ADMIN`, and `AUDITOR`.

Two notes worth knowing:

Role grants in System Config let you assign a platform role to a Google email
**before** that person first signs in, so a new admin lands with the right
permissions instead of needing promotion afterwards.

Self-registration should stay off. With it on, anyone who can reach the site can
create a local account and bypass Google sign-in.

---

## Troubleshooting

**The agent cannot find a skill I just installed.** Start a new agent session.
Installation writes files; it does not reload a running session.

**`401` or `403` from the CLI.** Your login expired or you lack access to that
namespace. Run `skillhub login` again, then `skillhub whoami` to confirm.

**Upload rejected.** Read the error — it names the specific problem. The common
ones are a missing `SKILL.md` at the root, a file type that is not allowed, or
being over a size limit.

**Published but not visible.** It is probably still in review. Check Dashboard →
My Skills for its status.

**`skillhub` command not found after installing.** Your npm global bin directory
is not on `PATH`. `npm prefix -g` tells you where it is.

---

## Getting help

Ask in the platform team's channel. Useful things to include: what you ran, the
full error, and the skill coordinate if it relates to a specific skill.
