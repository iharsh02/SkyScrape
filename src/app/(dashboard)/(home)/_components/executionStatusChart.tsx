"use client";

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Layers2Icon } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import getWorkflowExecutionStatus from '@/actions/home/getWorkflowExecutionStatus'

type ChartData = Awaited<ReturnType<typeof getWorkflowExecutionStatus>>

export default function ExecutionStatusChart({ data }: { data: ChartData }) {
  const chartData = Object.entries(data).map(([date, stats]) => ({
    date,
    Success: stats.success,
    Failed: stats.failed
  }))

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-2 pb-2">
        <Layers2Icon className="w-6 h-6 text-muted-foreground" />
        <CardTitle>Workflow Executions Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4">
          <ChartContainer
            config={{
              Success: {
                label: "Success",
                color: "hsl(var(--primary))",
              },
              Failed: {
                label: "Failed",
                color: "hsl(var(--destructive))",
              },
            }}
            className="w-full h-full"
          >
            <BarChart data={chartData} margin={{ top: 0, right: 15, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="Success" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Failed" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
