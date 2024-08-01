# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

https://api.pokemontcg.io/v2/cards?q=(id:"swsh10-46" OR id:"swsh11-79")

[x] Display list of sets
[x] Display list of cards in a set
[x] Migrate data to PG
[x] Fix pagination (https://github.com/hqasmei/youtube-tutorials/blob/main/shadcn-pagination/src/components/client-pagination.tsx)
[x] Add search
[x] Clean up Suspense and search bar
[x] Attach user creation to webhook and save to local db
[x] Clean DB of cards with null data
[x] Display list of all cards
[x] Let a user create a collection
[x] make user create username upon creation (redirect until done)
[x] Fix set list and card to accommodate api fxn argument update
[x] Add table indexes (Vercel Postgres has it on id by default?)
[x] Create dashboard
[x] Let user create a trade list
[x] Add top progress bar
[x] Seperate types to seperate file
[x] Find trade
[x] Send trade request
[] Show UI notification
[] Add trade stats
[] Convert queries to prepared statements
[] Proper error handling on the database side with respective messages on the UI
[] Send notification email
[] Optimize trade search
[] Figure out Clerk middleware to redirect user when not logged in or doesn't have a username set
[] Clerk route testing (redirects after auth, redirects after logging out, etc)

[] Upon creation of list, new list doesn't show up in Dashboard until refresh

Shortcomings
-only main variants. Basically, official checklist so won't have variations like cosmos
-English only

https://dev.to/muhammadazfaraslam/managing-global-state-with-usereducer-and-context-api-in-next-js-14-2m17
https://jamiehaywood.medium.com/typesafe-global-state-with-typescript-react-react-context-c2df743f3ce
