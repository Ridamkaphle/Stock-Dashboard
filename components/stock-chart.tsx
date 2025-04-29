"use client"

import { useMemo } from "react"
import type { StockData } from "./dashboard"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface StockChartProps {
  stocks: StockData[]
}

export default function StockChart({ stocks }: StockChartProps) {
  const chartData = useMemo(() => {
    return stocks.map((stock) => ({
      symbol: stock.symbol,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
    }))
  }, [stocks])

  const chartConfig = useMemo(() => {
    const config: Record<string, any> = {
      symbol: {
        label: "Symbol",
      },
    }

    stocks.forEach((stock) => {
      config[stock.symbol] = {
        label: stock.symbol,
        color: stock.change >= 0 ? "hsl(142.1, 76.2%, 36.3%)" : "hsl(346.8, 77.2%, 49.8%)",
      }
    })

    return config
  }, [stocks])

  return (
    <div className="w-full h-[400px]">
      <ChartContainer config={chartConfig} className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="symbol" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="price" name="Price ($)" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="changePercent" name="Change (%)" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
