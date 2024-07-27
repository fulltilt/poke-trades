import { Suspense } from "react";

// import { SkeletonCard } from "~/components/skeletonCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUser } from "~/server/queries";

export default async function Dashboard() {
  const user = auth();
  if (!user.userId) redirect("/");

  const loggedInUser = await getUser(user.userId);
  if (!loggedInUser?.username) {
    redirect("/username");
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mt-20 flex w-full max-w-[1200px] gap-8">
        <div className="flex w-1/2 rounded-lg border-[1px] border-solid border-black p-8">
          Pending Trades
        </div>
        <div className="flex w-1/2 rounded-lg border-[1px] border-solid border-black p-8">
          Completed Trades
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
        {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
        {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        {/* <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}  /> */}
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
    </div>
  );
}
