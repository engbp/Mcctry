# MCC MNU Community Platform — Implementation Plan

## Goal

Extend the existing MCC MNU public website into a real, secure community platform while preserving the existing public-facing site and visual identity.

Official social links supplied by the club:
- Facebook: https://www.facebook.com/share/14sQQMH2mxJ/
- LinkedIn: https://www.linkedin.com/company/mccmnuegypt/
- Instagram: https://www.instagram.com/mcc_mansnu?xtok=ejFyYmJlMDhtZHBy

## Recommended architecture

- **Existing web frontend:** Next.js + React + TypeScript, retained in this repository.
- **Backend API:** NestJS + TypeScript, in a `backend/` workspace.
- **Database:** PostgreSQL with Prisma ORM and versioned migrations.
- **Authentication:** Server-validated sessions/tokens, secure HttpOnly cookies, password hashing with Argon2id, rate limits, email verification and password reset.
- **Deployment:** Keep the existing frontend on Vercel; choose a compatible backend/database deployment after checking current free-tier limits. Do not commit secrets or rely on browser-side role checks.

## Roles and permissions

### Student
- Register and sign in; complete a profile.
- Apply to join MCC or a track/team.
- Register for events and access published resources.
- View own points history, profile, achievements and public leaderboard.

### Team member
- All permitted student features.
- View assigned team/track workspace.
- Manage only assigned events, tasks, attendance or submissions when explicitly granted permission.
- Cannot change own role, award points to themselves, or edit the points ledger.

### Admin
- Review membership applications and manage users, team assignments and tracks.
- Create and manage events, announcements, resources and tasks.
- Award or deduct points with a required reason.
- Review point history and audit logs.
- Configure point rules and leaderboard visibility.

### Super admin
- All admin permissions, plus promote/demote admins, configure platform-wide settings and recover administrative access.
- Bootstrap securely through a one-time server-side process or deployment secret; never make a public signup form create an admin.

All permissions must be enforced by the backend on every protected operation. Hiding buttons in the UI is not authorization.

## Core data model

- User, Profile, Session/RefreshToken, EmailVerificationToken, PasswordResetToken
- Role and Permission (or a small, explicit role/permission mapping)
- Team, Track, TeamMembership, MembershipApplication
- PointTransaction, PointReason/Rule, Achievement
- Event, EventRegistration, Attendance
- Task, TaskAssignment, TaskSubmission
- Announcement, Resource
- AuditLog, Notification

Points are an append-only ledger: every award or deduction stores the recipient, signed amount, reason, authorizing admin, timestamp, and optional event/task reference. Balance and leaderboard are derived from ledger entries. Corrections create compensating transactions rather than silently overwriting history.

## Delivery phases

1. **Foundation and threat model:** workspace layout, environment validation, database schema, migrations, seed strategy, health checks and CI checks.
2. **Authentication and access control:** registration, login/logout, verification/reset flows, secure sessions, role/permission guards, bootstrap first super admin, authorization tests.
3. **Member management:** profiles, membership applications, admin approvals, teams/tracks and assignment scopes.
4. **Points and achievements:** audited ledger, reason catalog, admin award/deduct workflow, balances and leaderboard.
5. **Club operations:** events, registrations, attendance, tasks/submissions, announcements, resources and notifications.
6. **Connected frontend:** replace demo-only behavior with authenticated API data, dashboards for each role, loading/error/empty states and responsive layouts.
7. **Hardening and launch:** integration tests, authorization/IDOR tests, input validation, rate limits, backup/restore plan, accessibility checks, deployment and operational documentation.

## Non-negotiable security requirements

- Deny by default and authorize every API endpoint server-side.
- Validate and normalize all input; use DTO validation and safe ORM queries.
- Protect against IDOR/BOLA and cross-team data access.
- Store password hashes only; never store plaintext passwords or tokens.
- Keep secrets in deployment environment variables, never in Git or client bundles.
- Record sensitive administrative actions in an audit log.
- Test that students cannot call admin APIs even if they manually craft requests.
- Do not claim features are production-ready until tests and deployment checks pass.

## Initial repository observations

The existing root package is a Next.js frontend and the current demo dashboard explicitly identifies itself as mock content without real authentication or persistence. No Prisma schema was present at the inspected root path. The backend must be implemented as a real service, not simulated with client state or local storage.
