"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { updateUsername } from "~/server/queries";
import { useToast } from "~/components/ui/use-toast";
import { redirect } from "next/navigation";

export default function UsernameForm({ userId }: { userId: string }) {
  const { toast } = useToast();

  const [username, setUsername] = useState("");

  return (
    <form
      action={async () => {
        const res = await updateUsername(userId, username);

        if (res.success) {
          toast({
            title: "Success",
            description: res.success,
          });
          redirect("/dashboard");
        } else {
          toast({
            title: "Error",
            description: res.error,
          });
        }
      }}
    >
      <div className="mt-8 flex w-full max-w-sm items-center space-x-6">
        <Input
          value={username}
          onChange={(evt) => setUsername(evt.target.value)}
          minLength={6}
        />
        <Button>Submit</Button>
      </div>
    </form>
  );
}
