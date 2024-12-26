"use client";

import React, { useState } from 'react';
import { Credential } from '@prisma/client';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Clock, MoreVerticalIcon, TrashIcon } from 'lucide-react';
import { DeleteCredentials } from './deleteCredentials';
import { DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import TooltipWrapper from '@/components/global/TooltipWrapper';

interface CredentialCardProps {
  credential: Credential;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({ credential }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {credential.name}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Created on {new Date(credential.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <CredentialActions
          credentialName={credential.name}
          id={credential.id}
        />
      </CardContent>
    </Card>
  );
};

interface CredentialActionsProps {
  credentialName: string;
  id: string;
}

function CredentialActions({ credentialName, id }: CredentialActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DeleteCredentials
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        credentialName={credentialName}
        credentialId={id}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <TooltipWrapper content="More Actions">
              <MoreVerticalIcon size={16} />
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive flex items-center gap-2 cursor-pointer"
          >
            <TrashIcon size={16} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>);
}


