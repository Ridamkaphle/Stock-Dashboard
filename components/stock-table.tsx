"use client"

import { useState } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { StockData } from "./dashboard"

type SortField = "symbol" | "price" | "change" | "changePercent"
type SortDirection = "asc" | "desc"

interface StockTableProps {
  stocks: StockData[]
}

export default function StockTable({ stocks }: StockTableProps) {
  const [sortField, setSortField] = useState<SortField>("symbol")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedStocks = [...stocks].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("symbol")} className="flex items-center">
                Symbol
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("price")} className="flex items-center">
                Price
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("change")} className="flex items-center">
                Change
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("changePercent")} className="flex items-center">
                Change %
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">Previous Close</TableHead>
            <TableHead className="hidden md:table-cell">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStocks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No stock data available
              </TableCell>
            </TableRow>
          ) : (
            sortedStocks.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell className="font-medium">{stock.symbol}</TableCell>
                <TableCell>${stock.price.toFixed(2)}</TableCell>
                <TableCell className={stock.change >= 0 ? "text-green-600" : "text-red-600"}>
                  <div className="flex items-center">
                    {stock.change >= 0 ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}$
                    {Math.abs(stock.change).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className={stock.changePercent >= 0 ? "text-green-600" : "text-red-600"}>
                  <div className="flex items-center">
                    {stock.changePercent >= 0 ? (
                      <ArrowUp className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="mr-1 h-4 w-4" />
                    )}
                    {Math.abs(stock.changePercent).toFixed(2)}%
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">${stock.previousClose.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">{stock.lastUpdated}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
