"use client";

import TooltipWrapper from '@/components/global/TooltipWrapper'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { SaveBtn } from './saveBtn';
import { ExecuteBtn } from './ExcuteBtn'

interface Props {
  title: string
  subtitle?: string
  workFlowId: string
}

export const TopBar = ({ title, subtitle, workFlowId }: Props) => {
  const router = useRouter();
  return (
    <header className='flex p-2 border-b-2 border-separate
      justify-between w-full h-[60px] sticky top-0
      bg-background z-10'>
      <div className='flex gap-1 flex-1'>
        <TooltipWrapper content="back">
          <Button
            variant={'ghost'}
            size={"icon"}
            onClick={() => router.back()}>
            <ChevronLeftIcon size={16} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className='font-bold text-ellipsis truncate'>
            {title}
          </p>
          {subtitle && (
            <p className='text-xs text-muted-foreground truncate text-ellipsis'>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className='flex gap-1 flex-1 justify-end'>
        <ExecuteBtn  />
        <SaveBtn workFlowId={workFlowId} />
      </div>
    </header>
  )
}

