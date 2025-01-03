"use client";

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCardIcon } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { UsageStats } from '@/actions/home/getUsageStats';

export default function UsageStatsPieChart({ data }: { data: UsageStats }) {
  const chartData = [
    { name: 'Success', value: data.success },
    { name: 'Failed', value: data.failed }
  ]

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))']
  const totalCredits = data.success + data.failed

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <div className="flex items-center space-x-2">
          <CreditCardIcon className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-lg">Workflow Credits Usage</CardTitle>
        </div>
        <div className="text-xl font-bold">
          {totalCredits.toFixed(2)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ChartContainer
            config={{
              Success: {
                label: "Credits Used (Success)",
                color: COLORS[0],
              },
              Failed: {
                label: "Credits Used (Failed)",
                color: COLORS[1],
              },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend
                  verticalAlign="bottom"
                  height={24}
                  formatter={(value, entry, index) => (
                    <span style={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}>
                      {value}: {chartData[index].value.toFixed(2)}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
