# Security Specification - Apna Cricket

## Data Invariants
- A User must have a verified mobile number (simulated for now, would be OTP).
- A Match must belong to an Organizer.
- A LiveScore must update atomicity with its Match state.
- Team names must be unique (within reason).
- Admin access is restricted to a set of hardcoded UIDs or a verified 'admins' collection.

## Path Mapping
- `/users/{userId}`: User profile. Owner can read/write.
- `/teams/{teamId}`: Team. Owner can write. Public can read.
- `/matches/{matchId}`: Match. Organizer can write. Public can read.
- `/live_scores/{matchId}`: Live scores. Organizer can write. Public can read.
- `/tournaments/{tournamentId}`: Tournament. Organizer can write. Public can read.

## The Dirty Dozen Payloads (Rejection Tests)
1. User trying to write to another user's profile.
2. User trying to set `role: 'admin'`.
3. User trying to update a match status to 'live' without ownership.
4. User trying to delete a match they don't own.
5. User trying to inject a 1MB string into team short name.
6. User trying to create a match with a non-existent teamId.
7. User trying to update live score without being the match organizer.
8. User trying to skip 'upcoming' -> 'live' status flow (Directly to 'finished').
9. User trying to read all users (list query without filter).
10. User trying to update `createdAt` field.
11. User trying to create team with empty name.
12. User trying to access dev admin reports without dev role.
