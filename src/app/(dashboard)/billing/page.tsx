import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-lg p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Billing Coming Soon</h2>
          <p className="text-muted-foreground">
            We&apos;re working hard to bring you our billing features. Check back soon!
          </p>
        </div>
      </Card>
    </div>
  );
}
