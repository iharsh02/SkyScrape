"use client";
import Link from "next/link";
import GetUserBalance from "@/actions/billing/getUserBalance";
import { useQuery } from "@tanstack/react-query";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import CountUp from "./ReactCounter";

export const UserAvailCreditsBadge = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const query = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: () => GetUserBalance(),
    refetchInterval: 30 * 1000,
    enabled: isClient,
  });

  if (!isClient) {
    return (
      <Link href="/billing" className="flex items-center space-x-2">
        <CoinsIcon size={20} className="text-blue-500" />
      </Link>
    );
  }

  return (
    <Link href="/billing" className="flex items-center space-x-2 py-4">
      <CoinsIcon size={20} className="text-blue-500" />
      <div>
        {query.isLoading ? (
          <Loader2Icon className="animate-spin w-4 h-4" />
        ) : (
          query.data !== undefined ? (
            <CountUp value={query.data} />
          ) : (
            "-"
          )
        )}
      </div>
    </Link>
  );
};
