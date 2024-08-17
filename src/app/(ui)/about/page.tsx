import Link from "next/link";

export default function About() {
  return (
    <div className="mb-20 flex max-h-full flex-1 flex-col gap-20 rounded-md pl-14 pr-14">
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              About
            </h1>

            <p className="mt-1.5 text-sm text-gray-500"></p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 sm:px-6 lg:px-20">
        <h2 className="text-2xl font-bold">How to use this site</h2>
        <p>
          When you first log in, you&apos;ll be asked to create a username,
          after which you&apos;ll be redirected to your Dashboard where
          you&apos;ll see your trade stats as well as your Trade Lists.
        </p>
        <p>
          Each user is given two by default: a Wish List which is a list of
          cards that you are looking for and is used to search for any other
          users that have a card(s) in their public trade lists and lastly a
          public trade list (named [your username]_TradeList) which will be the
          list another user sees when you are in the middle of a trade.
        </p>
        <p>
          The first things you want to do is to fill out your Wish List and
          public trade list by clicking on the{" "}
          <Link href="/sets" className="text-blue-600 underline">
            Sets
          </Link>{" "}
          or{" "}
          <Link
            href="/cardlist?page=1&pageSize=30&orderBy=number"
            className="text-blue-600 underline"
          >
            Cards
          </Link>{" "}
          links in the navigation bar.
        </p>
        <p>
          You can use the search inputs and dropdowns to help search for cards
          and if you want to add any cards to your Wish List, click on the heart
          and if you want to add a card to your public trade list(s), click on
          the &quot;+/-&quot; button to adjust quantities.
        </p>
        <p>
          Once you have filled out the initial lists, you can now go to the{" "}
          <Link href="/trade" className="text-blue-600 underline">
            Trade
          </Link>{" "}
          page to find other users to trade with. Like mentioned previously,
          potential trade partners will be shown depending on what you added to
          your Wish List so make sure you have at least one card in your Wish
          List.
        </p>
        <p>
          Once you see a potential trade partner, click on the View button which
          opens a pop-up where you can initiate a trade once you select which
          trade list you&apos;d like the other User to see. You&apos;ll now see
          a new entry in the &quot;In Progress&quot; trade list and click View
          where you&apos;ll be taken to an area where you can start the trade
        </p>
        <p>
          In this new section, and the other user will have to opportunity to go
          through your and each others list to determine which cards will be
          part of the trade. There will be running totals and in a later version
          of this site, the ability to update prices and add non-card related
          items to balance out trades.
        </p>
        <p>
          Once the trade looks good, users can put the trade status as Pending
          which means that the User has sent out the Cards. At this point, you
          won&apos;t be able to update the Trade unless you put the progress
          back into In Progress. Once the Cards are received, change the status
          to Completed and once the other User marks the Trade as Complete, both
          Users will have their trading score increased by 1. Once a trade is
          marked Complete, you will be unable to edit the Trade.
        </p>
      </div>
      <div className="flex flex-col gap-8 sm:px-6 lg:px-20">
        <h2 className="text-2xl font-bold">About this site</h2>
        <p>
          Welcome to PokeTrades! This site was inspired after hundreds of trades
          I made on the Reddit{" "}
          <a
            className="text-blue-600 underline"
            target="_blank"
            href="https://www.reddit.com/r/pkmntcgtrades/new/"
          >
            r/pkmntcgtrades
          </a>{" "}
          subreddit. During every potential deal I would fill up random
          spreadsheets with trade details and after awhile it was getting
          repetitive and messy so I decided to make this site to make my life
          easier and to have a log of all my trades going forward.{" "}
        </p>
        <p>
          This site is a work in progress and there&apos;s a lot to do but at
          the very least the main functionality is working although there&apos;s
          a lot of bugs to flush out and although there&apos;s a lot of work to
          do here&apos;s a short list of shortcomings this site has as well as
          things that probably aren&apos;t going to change anytime soon:
        </p>
        <ul className="list-disc">
          <li>
            The listings will be for English only until I find a data source to
            pull Japanese card data which also includes prices
          </li>
          <li>
            The listed cardds will only be from the basic set lists. Think of
            the list you see in the back of the booklets of an elite trainer
            box. I won&apos;t have variants such as cosmos, etc listed here.
            There&apos;s better sites that handle this.
          </li>
          <li>
            The prices are by TCGPlayer market but sometimes those fields are
            empty from the data source I pull from so sometimes I have to go by
            another field which sometimes results in some weird results when
            sorting. No matter what I tried there are always going to be some
            entries that are obviously off and I don&apos;t have the time to
            scour through the prices so I&apos;m sticking to TCGPlayer market
            for now. If price is empty or jsut looks plain wried, check eBay
            last solds, pricecharting, etc for comps. If it already hasn&apos;t
            happened yet, there will be an ability to manually change the price
            during a trade
          </li>
        </ul>
        <p>
          Currently this is a one-man show done part-time so if{" "}
          <a
            target="_blank"
            className="text-blue-600 underline"
            href="https://www.paypal.com/donate/?hosted_button_id=ZCDZKZW4JE5LG"
          >
            donations
          </a>{" "}
          are appreciated. Also styling isn&apos;t my strong suite so if you can
          offer assistance in that area, that would be great as well. Any
          questions or recommendations can be sent{" "}
          <a
            href="mailto: support@poke-trades.com"
            className="text-blue-600 underline"
          >
            here
          </a>
          . Anyways, happy trading!
        </p>
      </div>
    </div>
  );
}
