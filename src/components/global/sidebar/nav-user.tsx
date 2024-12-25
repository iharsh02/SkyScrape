"use client";

import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserButton, useUser } from "@clerk/nextjs";
import { Avatar } from "@radix-ui/react-avatar";

export function NavUser() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Avatar>
        <AvatarImage src="/" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
  }

  if (!user) return null;

  return (
    <div className="flex gap-5">
      <UserButton />
      <div className="min-w-0 flex-1 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <p className="truncate text-sm font-semibold">{user?.fullName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {user?.primaryEmailAddress?.emailAddress}
        </p>
      </div>
    </div>
  );
}
