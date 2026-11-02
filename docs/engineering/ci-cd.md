# CI/CD Engineering Guide

## Purpose

CI checks the frontend, backend JavaScript syntax, Prisma schema/client
generation, dependency advisories, and the ability to apply the committed
migrations to a fresh, disposable PostgreSQL database. It does not deploy the
application.

## Architecture

The `CI` workflow in [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)
has two independent jobs that run in parallel on GitHub-hosted Ubuntu runners:

1. **Frontend checks** installs the frontend dependencies, runs Oxlint, builds
   the Vite application, and audits npm dependencies.
2. **Backend checks** starts a temporary PostgreSQL 16 service, installs backend
   dependencies, audits dependencies, checks JavaScript syntax, validates the
   Prisma schema, generates Prisma Client, and applies all committed migrations
   to that temporary database.

Both jobs use Node.js 22, npm lockfile-based installs, npm caching, a 15-minute
timeout, and read-only repository permissions. There is no job dependency because
the checks are independent. The service and runner are discarded after the job.

## Workflow inventory and triggers

| Workflow | Purpose | Triggers |
|---|---|---|
| `CI` | Run frontend and backend validation | Push to `main`, pull request targeting `main`, or manual dispatch |

`Dependabot` is configured in [`.github/dependabot.yml`](../../.github/dependabot.yml)
to propose weekly updates for frontend npm dependencies, backend npm
dependencies, and GitHub Actions. It does not run validation itself; its update
pull requests are validated by CI.

## Validation commands

Commands run in the respective package directories:

| Package | Command | What it checks |
|---|---|---|
| Frontend | `npm ci` | Installs exact versions from `frontend/package-lock.json` |
| Frontend | `npm run lint` | Runs the configured Oxlint script |
| Frontend | `npm run build` | Runs the Vite production build |
| Frontend | `npm audit --audit-level=high` | Reports dependency advisories and fails on high or critical findings |
| Backend | `npm ci` | Installs exact versions from `backend/package-lock.json` |
| Backend | `npm audit --audit-level=high` | Reports dependency advisories and fails on high or critical findings |
| Backend | `find . -type d -name node_modules -prune -o -type f -name '*.js' -print0 \| xargs -0 -n1 node --check` | Parses backend JavaScript files without running the application |
| Backend | `npx prisma validate` | Validates the Prisma schema and configuration |
| Backend | `npx prisma generate` | Generates Prisma Client |
| Backend | `npx prisma migrate deploy` | Applies committed migrations to the isolated CI database |

There are no backend lint, test, or frontend test scripts in the package
manifests, so CI does not invent or run them. The checked-in scripts named
`test-update-role.js` (in the repository root and backend) and `test_data.js`
are manual database utilities; the role-update script changes persisted
workspace roles. They are intentionally not run in CI.

## Runtime and dependencies

- **Package manager:** npm, inferred from the separate committed
  `frontend/package-lock.json` and `backend/package-lock.json` files (lockfile
  version 3). The root has no `package.json`; its empty lockfile is not used.
- **Node.js:** CI uses Node 22 because [`backend/Dockerfile`](../../backend/Dockerfile)
  uses `node:22-alpine`. The package manifests do not declare `engines`, and
  there is no `.nvmrc` or `.node-version`, so a shared Node support policy is
  not formally declared.
- **Database:** PostgreSQL 16, confirmed by the Prisma datasource, migration
  SQL, and [`docker-compose.yml`](../../docker-compose.yml). The preliminary
  MySQL context is not consistent with the repository.
- **Deployment:** No Netlify or Render workflow/configuration was found. The
  providers named in project context are not configured by this repository.
  A backend Dockerfile exists; it uses Node 22, runs `npm install`, and invokes
  `prisma migrate deploy` at container startup before starting the server.
- **Tests:** No automated test framework or test script was found.

## Database and migration safety

Prisma validation and client generation do not apply migrations. Separately,
CI applies the eight currently committed migrations to a new PostgreSQL 16
database created for that job. The connection URL is set in the workflow to the
service container; the account and password are test-only values. The database
is discarded when the job ends.

This proves that the migration chain can apply to an empty database; it does not
prove that a migration safely upgrades every deployed database, preserves
production data, rolls back, or has acceptable lock/performance behavior. CI
never connects to a production database. Do not change the CI connection URL to
point to a shared or production database.

## Environment configuration

CI does not require repository variables or secrets:

- The frontend production build currently succeeds without
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, or `VITE_API_URL`.
- Prisma commands receive a test-only `DATABASE_URL` through the workflow.
- Backend runtime variables `PORT`, `ALLOWED_ORIGINS`, `SUPABASE_URL`,
  `SUPABASE_ANON_KEY`, `FRONTEND_URL`, `SENDGRID_API_KEY`, and
  `SENDGRID_FROM_EMAIL` are not needed because CI does not start the server or
  call external services.

Do not add production credentials to these jobs. `npm ci` runs package
installation scripts, so pull-request code still executes; the ordinary
`pull_request` event, read-only token permissions, lack of secrets, and
ephemeral GitHub-hosted runners limit its access.

## Security and deployment isolation

- The workflow declares `permissions: contents: read`; no job writes repository
  content, comments on pull requests, or deploys.
- Pull requests use `pull_request`, not `pull_request_target`. No untrusted PR
  code is run in a privileged workflow.
- `actions/checkout` and `actions/setup-node` are official actions pinned to
  full commit SHAs. Dependabot is configured to propose reviewed updates.
- The PostgreSQL service uses test-only credentials and contains no production
  data. Only the backend job needs the service.
- Dependency audits report findings and fail for high/critical severity.
  Findings below that threshold remain in the job log.
- There are no deployment credentials, provider actions, or production
  migration steps in CI.

These controls reduce risk but do not make a workflow completely secure.
Package lifecycle scripts and application build commands execute PR-controlled
code in an ephemeral runner. Continue reviewing dependency changes and workflow
updates.

## Troubleshooting

- **`npm ci` reports package/lock mismatch:** update the lockfile with the npm
  version used for development, review the lockfile diff, then rerun `npm ci`
  from that package directory.
- **Lint or build fails:** reproduce with the exact command from
  `frontend/`; existing lint warnings are informational unless Oxlint exits
  non-zero.
- **Prisma cannot find its schema/config:** run Prisma commands with
  `backend/` as the working directory.
- **Prisma cannot connect:** inspect the PostgreSQL service health and the
  test-only `DATABASE_URL`; do not substitute a shared database URL.
- **Migration fails:** inspect the migration output and validate the SQL against
  a fresh PostgreSQL 16 database locally before changing or adding migrations.
- **Audit fails:** inspect the npm audit report, update a compatible dependency
  and lockfile, then run `npm ci` and the relevant build/checks before merging.
- **Workflow does not start:** confirm the event is a push to `main`, a pull
  request targeting `main`, or a manual dispatch, and inspect the Actions
  workflow syntax/log.

## Known limitations

- No automated frontend or backend behavior tests exist. Static syntax checks
  and a successful build do not test API or user-facing behavior.
- Supabase Auth and SendGrid integration behavior is not tested; CI has no
  credentials for either service.
- Migration verification starts from an empty PostgreSQL database and does not
  test production upgrade, rollback, or data compatibility.
- The package manifests do not define a supported Node version range. Node 22
  is an explicit CI choice based on the backend container image and dependency
  requirements, not a declared support contract.
- The backend image currently uses `npm install` rather than `npm ci`, and
  applies migrations at startup. This behavior is not executed by CI; make
  image installs lockfile-deterministic and agree on migration orchestration
  before introducing production CD.
- `npm audit --audit-level=high` does not fail on low/moderate advisories; review
  those findings periodically.
- The workflow has not yet been executed by GitHub Actions from this branch.
- Hosting behavior is not managed here. A Netlify or Render Git integration may
  deploy independently of GitHub Actions unless its build/deploy policy is
  configured to require passing CI.

## Branch protection and merge policy

Configure these repository settings manually for `main` (they are not changed by
this workflow):

- Require pull requests and at least one review if appropriate for the team.
- Require the `Frontend checks` and `Backend checks` status checks.
- Require review conversations to be resolved.
- Restrict direct pushes and force pushes to `main`.

Passing CI is necessary for merge but does not by itself establish production
readiness.

## Future CD roadmap

Keep deployment in a separate workflow or provider-managed configuration after
CI is stable:

1. Decide whether Netlify and Render deploy directly from GitHub or whether
   GitHub Actions will control deployment. Provider Git integrations can build
   and deploy independently; a green GitHub Actions run does not automatically
   block those deploys. Configure the provider's branch/build policy or disable
   its automatic production deploys if CI must gate them.
2. Add preview/staging deployments first, then production environments with
   protected GitHub Environment approvals if deployment is GitHub-controlled.
3. Use narrowly scoped provider credentials only in the deployment job or
   protected environment. Do not expose them to pull-request validation.
4. Define when and how PostgreSQL migrations run. Use an explicit deploy stage
   against the intended environment, with backup/recovery and backward-compatible
   rollout planning; never reuse the CI database.
5. Add post-deployment health checks, observability, and a rollback/recovery
   procedure. For Netlify, retain prior deploys for restore; for Render, define
   service rollback/redeploy behavior and database recovery separately.
6. Add versioned releases and build artifact retention if release traceability
   or artifact promotion becomes a requirement.

## Maintenance

- Keep package manifests and lockfiles in sync; use `npm ci` to verify clean
  installs before merging dependency updates.
- Review Dependabot PRs, run the affected package checks, and inspect audit
  changes before merging.
- Update Node 22 only after declaring the supported runtime and verifying both
  the application and its deployment image.
- Review the official action release and full commit SHA before updating pins;
  Dependabot can propose the changes.
- Keep the PostgreSQL major version consistent with the Prisma datasource and
  supported deployment database. Test migration changes on a fresh isolated
  database.
- Add meaningful tests and scripts to the package manifests before adding test
  commands to CI.
