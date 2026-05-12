# Security Specification: Year Up Weekly Report System

## 1. Data Invariants
- A `WeeklyReport` must belong to a valid `student` user.
- A `CustomQuestion` must be created by a user with role `coach` or `pm`.
- `studentId` in a report must match the authenticated user's ID.
- Users cannot change their own `role`.
- `createdAt` and `submittedAt` must be server timestamps.

## 2. The "Dirty Dozen" Payloads (Denial Expected)
1.  **Identity Theft**: Student A trying to read Report of Student B.
2.  **Privilege Escalation**: Student trying to update their role to `pm`.
3.  **Shadow Update**: User trying to add `isAdmin: true` to their profile.
4.  **Orphaned Report**: Creating a report with a non-existent `studentId`.
5.  **Time Travel**: Manually setting `submittedAt` to a past date instead of `request.time`.
6.  **Question Hijacking**: Coach A trying to delete a question created by PM B.
7.  **Bulk Scraping**: Authenticated student trying to list all users in the system.
8.  **ID Poisoning**: Creating a user with a 2MB string as ID.
9.  **Relational Breach**: Student trying to read a `Group` they are not part of.
10. **State Corruption**: Updating a submitted report's `studentId`.
11. **Spamming**: Creating a report with 1000 highlights (size limit breach).
12. **Unverified Email**: Accessing data with an unverified Year Up email (if email verification is forced).

## 3. Test Runner (Conceptual)
Tests will verify that `PERMISSION_DENIED` is returned for all above payloads using `firebase-tools/testing`.

## 4. Conflict Report

| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
|---|---|---|---|
| users | Protected by `auth.uid` | Role is immutable for user | String size limits |
| reports | `studentId` verified | Immutable after creation | Field count limits |
| questions | `creatorId` verified | `active` toggle only by creator/PM | Text length limits |
| groups | `pmId` verified | Membership managed by PM | Array size limits |
