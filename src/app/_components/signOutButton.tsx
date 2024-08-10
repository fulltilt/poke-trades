"use client";

import { Button } from "~/components/ui/button";
import { handleSignOut } from "../api/auth/signOutServerAcion";

export const SignOutButton = (props: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <Button
      className={props.className}
      style={{ cursor: "pointer" }}
      onClick={() => handleSignOut()}
    >
      {props.children ?? "Sign Out"}
    </Button>
  );
};
