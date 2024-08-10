"use client";

import { useState, useTransition } from "react";
import { handleEmailSignIn } from "~/app/api/auth/emailSignInServerAction";
import { handleGoogleSignIn } from "~/app/api/auth/googleSignInServerAction";
import { Button } from "~/components/ui/button";

function GoogleIcon() {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="-3 0 262 262"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      className="size-6"
    >
      <path
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4"
      />
      <path
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853"
      />
      <path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05"
      />
      <path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
        fill="#EB4335"
      />
    </svg>
  );
}

export default function SignInPage() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({ email: "" as string });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevents the form from submitting and reloading the page, allowing us to handle the submission in TypeScript.
    try {
      startTransition(async () => {
        await handleEmailSignIn(formData.email);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "hsl(0, 0%, 97.5%)" }}
    >
      <div
        className="w-80 rounded-2xl bg-white p-8 text-center"
        style={{ boxShadow: "0 4px 8px hsl(0, 0%, 70%)" }}
      >
        <h2 className="mb-4 text-3xl">PokeTrades</h2>
        <h2 className="text-2xl">Sign In</h2>
        <div className="mt-4 flex flex-col items-center gap-4">
          <form
            className="flex w-[100%] flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <input
              className="rounded-sm border p-2"
              style={{ borderColor: "hsl(0, 0%, 70%)" }}
              type="email"
              maxLength={320}
              placeholder="Email Address"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ email: event.target.value })
              }
              disabled={isPending}
              required
            />
            <Button type="submit">Sign in with email</Button>
          </form>

          <div className="flex w-[75%] items-center p-2">
            <div
              className="h-[1px] grow"
              style={{ backgroundColor: "hsl(0, 0%, 70%)" }}
            ></div>
            <span className="p-[0 1rem]">or</span>
            <div
              className="h-[1px] grow"
              style={{ backgroundColor: "hsl(0, 0%, 70%)" }}
            ></div>
          </div>

          <div className="flex w-[100%] flex-col">
            <Button
              className="google"
              onClick={async () => handleGoogleSignIn()}
            >
              <GoogleIcon />
              &nbsp;&nbsp; Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
