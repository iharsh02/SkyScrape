import React from 'react';
import { DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  title?: string;
  subTitle?: string;
  icon?: LucideIcon;

  iconClassName?: string;
  titleClassName?: string;
  subTitleClassName?: string;
}

export const CustomDialogHeader = ({
  title,
  subTitle,
  icon: IconComponent,
  iconClassName,
  subTitleClassName,
  titleClassName,
}: Props) => {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {IconComponent && (
            <IconComponent
              size={30}
              className={cn("text-blue-500", iconClassName)}
            />
          )}
          {title && (
            <h2 className={cn("text-lg font-bold", titleClassName)}>{title}</h2>
          )}
          {subTitle && (
            <p className={cn("text-sm text-gray-500", subTitleClassName)}>
              {subTitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <DialogDescription>Start building you workflow</DialogDescription>
    </DialogHeader>
  );
};


