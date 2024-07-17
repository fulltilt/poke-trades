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

export async function seedData() {
let dat = []

// console.log(dat.length);
await db.insert(cards).values(
dat.map((d) => ({
id: d.id,
data: d,
})),
);
}

SELECT
data
FROM
poketrades_card
WHERE
data->>'id' LIKE 'bw1-%'

[x] Display list of sets
[x] Display list of cards in a set
[x] Migrate data to PG
[x] Fix pagination (https://github.com/hqasmei/youtube-tutorials/blob/main/shadcn-pagination/src/components/client-pagination.tsx)
[] Verify Suspense is working (works but I need to clean up layout)
[] Add search
[] Display list of all cards
[] Let a user create a collection
[] Limit the amount of fields returned from card search
