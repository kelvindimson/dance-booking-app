"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { UserMenu } from "./UserMenu";
import Link from "next/link";

export default function NavbarLogin() {
  const { data: session } = useSession();

  if (session) {
    return <UserMenu />;
  }

  return (
    <Button asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
}