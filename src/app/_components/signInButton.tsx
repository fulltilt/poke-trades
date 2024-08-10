"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export const SignInButton = (props: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();

  return (
    <Button
      className={props.className}
      style={{ cursor: "pointer" }}
      onClick={() => {
        router.push("/auth/signin");
      }}
    >
      {props.children ?? "Sign In"}
    </Button>
  );
};
