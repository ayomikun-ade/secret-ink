Role: You are a senior full-stack engineer building a production-ready web app.

🧩 Product Overview

Build a private, invite-based anonymous confession board web application.

Users can:

create a board

receive a unique invite link

share the link in any group

anyone with the link can post anonymous confessions to that board

confessions appear in real time

No authentication is required for participants.
No moderation is required in v1 (design the system so moderation can be added later).

🛠️ Tech Stack (Strict)

Frontend: Next.js (App Router)

Backend / Data: Convex

Styling: Tailwind CSS

State: Convex real-time queries

Deployment: Vercel (frontend), Convex (backend)

🧱 Core Data Models (Convex)
Boards

Each board represents a private confession space.

Fields:

name: string

slug: string (unguessable, used in invite URL)

description?: string

createdAt: number

expiresAt?: number

ownerToken: string (secret admin token, unused in v1)

isLocked: boolean (default false, future use)

Confessions

Each confession belongs to a board.

Fields:

boardId: Id<"boards">

content: string

nickname?: string

createdAt: number

expiresAt?: number

fingerprint: string (hashed anonymous identifier)

Reactions

Each reaction is tied to a confession.

Fields:

confessionId: Id<"confessions">

type: "love" | "laugh" | "shock" | "sad"

fingerprint: string

createdAt: number

Ensure:

one reaction per fingerprint per confession

🔗 Routing & Pages (Next.js App Router)
/

Landing page

Board creation form

Explains how anonymous boards work

/board/[slug]

Confession feed for that board

Anonymous submission form

Real-time updates

Reaction buttons

/admin/board/[slug]

Placeholder page (not functional in v1)

Exists for future admin dashboard

✍️ Board Creation Flow

User enters:

board name

optional description

optional expiry date

Convex mutation creates board

Generate:

slug using nanoid/UUID

ownerToken (stored securely)

Redirect user to:

invite link /board/{slug}

Display shareable invite link

📝 Anonymous Confession Flow

Generate an anonymous fingerprint on the client

Based on:

random localStorage ID

userAgent

timezone

Submit confession via Convex mutation

Validate:

non-empty content

max character length (e.g. 300)

basic rate limiting per fingerprint

Store confession

Instantly appear in feed via real-time query

⚡ Real-Time Feed

Use Convex queries with live updates

Sort by newest first

Paginate if necessary

❤️ Reactions

Users can react anonymously

One reaction per fingerprint per confession

Reaction counts update live

🛡️ Abuse Prevention (Without Moderation)

Rate limit confessions per fingerprint (e.g. 5/hour)

Rate limit reactions

Block empty or excessively long submissions

Do NOT store raw IP addresses

⏳ Expiry System

Support optional expiration:

board-level

confession-level

Use Convex scheduled functions to clean up expired data

🎨 UI / UX Requirements

Clean Valentine-themed aesthetic

Mobile-first

Confession cards with:

timestamp

reactions

Submission form with:

character counter

friendly hint text

🔒 Security Constraints

Never expose ownerToken in client queries

All writes must go through Convex mutations

Validate board existence before allowing confessions

🧩 Code Organization

convex/schema.ts

convex/boards.ts

convex/confessions.ts

convex/reactions.ts

/app/board/[slug]/page.tsx

/app/page.tsx

🚀 Deliverables

Fully working Next.js + Convex app

Clean, readable code

Comments where future moderation/admin features can be added

Ready for Vercel deployment

🧠 Important Notes

Do NOT add authentication

Do NOT add moderation logic

Design with future extensibility in mind

Favor simplicity over over-engineering
