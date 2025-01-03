"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletCards, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import GetDemoCredits from '@/actions/billing/DemoCredits';
import { toast } from 'sonner';
import { useState } from 'react';

interface BalanceProps {
  initialBalance: number;
}

export default function BalanceChart({ initialBalance }: BalanceProps) {
  const [balance, setBalance] = useState(initialBalance);

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <div className="flex items-center space-x-2">
          <WalletCards className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-lg">Available Credits</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {balance === 0 ? (
          <>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Insufficient balance. Please add credits to continue.
              </AlertDescription>
            </Alert>
            <div className='flex items-center justify-center mt-5'>
              <ClaimDemoCreditsButton onSuccess={updateBalance} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-primary/10">
            <span className="text-4xl font-bold text-primary">
              {balance}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              credits remaining
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


interface ClaimDemoCreditsButtonProps {
  onSuccess: (newBalance: number) => void;
}

export function ClaimDemoCreditsButton({ onSuccess }: ClaimDemoCreditsButtonProps) {
  const { mutate, isPending } = useMutation<number>({
    mutationFn: GetDemoCredits,
    onSuccess: (data) => {
      if (data) {
        toast.success("Demo credits claimed successfully!");
        onSuccess(data);
      } else {
        toast.error("You have already claimed demo credits.");
      }
    },
    onError: () => {
      toast.error("An error occurred while claiming credits.");
    },
  });

  return (
    <Button
      onClick={() => mutate()}
      disabled={isPending}
    >
      {isPending ? "Claiming..." : "Get Credits"}
    </Button>
  );
}

