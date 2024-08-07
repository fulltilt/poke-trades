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
[x] Show UI notification
[x] Have new trade list show up when creating new trade list
[x] Update Trade page when a trade request is made
[x] Update buttons on Trade list once status is changed
[x] Add confirmation toast after user requests trade
[x] Sub Lists show up in normal Sets/Cards popups. Probably don't want that
[x] Redo pagination
[x] tooltip doesn't overflow modal
[x] View options for cards (sort, list/pics)
[x] View Collection/Wish List
[x] Dashboard list pagination not hooked up to db
[x] Correct +/- on card list tables
[x] make mobile friendly (responsive tables)
[x] Finish trade flow (paginate lists, +- on table)
[x] Add sort by price
[x] autogenerate public tradelist after user enters username
[x] Lock trade on Complete and +1 trade to each user
[] Build out Notifications page
[] Add trade stats
[] Let users share trade lists
[] Convert queries to prepared statements
[] Proper error handling on the database side with respective messages on the UI
[] Get away from raw queries
[] handle when adding variations of same card. Currently doesn't differentiate between holo/normal/reverse/etc
[] Send notification email
[] Optimize trade search
[] Realtime updates on trade page
[] Go through all sets to make sure cards are in order and all show up
[x] Consider how to deal with deletions when there's foreign keys (ie trade table relies on trade lists which user may want to delete (update: don't let them delete but hide trades after a certain time))
[] Figure out Clerk middleware to redirect user when doesn't have a username set
[] Clerk route testing (redirects after auth, redirects after logging out, etc)

Shortcomings
-only main variants. Basically, official checklist so won't have variations like cosmos
-the prices are by TCGPlayer market but sometimes those fields are null so have to go by another field which
sometimes results in some weird results when sorting. Tried to go by low but there are some entries that are obviously off so sticking to market. If price is null, check eBay last solds for comps. If it
already hasn't happeed yet, there will be an ability to manually change the price during a trade
-English only

https://tocalai.medium.com/pagination-on-tanstack-table-under-next-js-787ed03198a3
https://medium.com/@ctrlaltmonique/how-to-use-usecontext-and-usereducer-with-typescript-in-react-735f6c5f27ba
