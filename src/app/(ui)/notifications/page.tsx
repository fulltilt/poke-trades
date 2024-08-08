import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getNotifications, getUser } from "~/server/queries";
import NotificationTable from "./notificationTable";

export default async function Notifications() {
  const user = auth();
  const currentUser = await getUser(user?.userId ?? "");
  if (!currentUser?.username) redirect("/dashboard");

  const notifications = (await getNotifications(user?.userId ?? "")).data;

  return (
    <div className="flex max-h-full flex-1 flex-col rounded-md pl-14 pr-14">
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-1.5 text-sm text-gray-500"></p>
          </div>
        </div>

        <NotificationTable notifications={notifications!} />
      </div>
    </div>
  );
}
