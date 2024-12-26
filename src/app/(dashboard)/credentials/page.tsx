import { GetCredentialsofUsers } from "@/actions/credentials/getCredentialsofUsers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, ShieldOffIcon } from 'lucide-react';
import { Suspense } from "react";
import { CreateCredentialsDialog } from "./_components/CreateCredentialsDialog";
import { CredentialCard } from "./_components/credentailCard";

export default function CredentialPage() {
  return (
    <div className="flex-1 flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialsDialog />
      </div>
      <Alert className="mb-6">
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle className="font-medium">Security Notice</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          Your credentials are securely encrypted using industry-standard protocols. All sensitive data is protected during transmission and storage.
        </AlertDescription>
      </Alert>

      <Suspense fallback={<CredentialsSkeleton />}>
        <UserCredentials />
      </Suspense>
    </div>
  )
}

function CredentialsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-[100px] w-full" />
      ))}
    </div>
  );
}

async function UserCredentials() {
  const credentials = await GetCredentialsofUsers();

  if (credentials.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="p-3 bg-gray-100 rounded-full">
              <ShieldOffIcon size={40} className="text-gray-500" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold">No Credentials Found</p>
              <p className="text-sm text-gray-500">
                Click the button below to create your first credential
              </p>
            </div>
            <CreateCredentialsDialog />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {credentials.map((credential) => (
        <CredentialCard key={credential.id} credential={credential} />
      ))}
    </div>
  );
}


