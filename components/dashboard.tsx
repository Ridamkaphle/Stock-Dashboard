"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import StockTable from "./stock-table"
import StockChart from "./stock-chart"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import LoadingSpinner from "./loading-spinner"

const DEFAULT_STOCKS = ["AAPL", "MSFT", "GOOGL", "AMZN", "META"]

export interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  previousClose: number
  lastUpdated: string
}

export default function Dashboard() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [failedSymbols, setFailedSymbols] = useState<string[]>([])

  useEffect(() => {
    fetchStockData(DEFAULT_STOCKS)
  }, [])

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const fetchStockData = async (symbols: string[]) => {
    setLoading(true)
    setError(null)
    setFailedSymbols([])

    try {
      const successfulStocks: StockData[] = []
      const failed: string[] = []

      const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
console.log("🔑 Using Finnhub API Key:", apiKey);

if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_FINNHUB_API_KEY in environment variables");
}

for (const symbol of symbols) {
  await sleep(1000); // Finnhub allows 60 calls/minute on free tier

  try {
    console.log(`📡 Fetching Finnhub data for: ${symbol}`);
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    const data = await response.json();
    console.log(`✅ Response for ${symbol}:`, data);

    if (!data.c || data.c === 0) {
      console.warn(`❌ No valid data for ${symbol}`);
      failed.push(symbol);
      continue;
    }

    successfulStocks.push({
      symbol,
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      previousClose: data.pc,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (err) {
    console.error(`Error fetching data for ${symbol}:`, err);
    failed.push(symbol);
  }
}


      setStocks(successfulStocks)
      setFailedSymbols(failed)

      if (successfulStocks.length === 0) {
        setError("Unable to fetch any stock data. Please try again later.")
      } else if (failed.length > 0) {
        setError(`Unable to fetch data for some stocks: ${failed.join(", ")}. This may be due to API rate limits.`)
      }
    } catch (err) {
      console.error("\u{1F4A5} Error fetching stock data:", err)
      setError("Failed to fetch stock data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      const newSymbol = searchInput.trim().toUpperCase()
      const updatedSymbols = [...new Set([...stocks.map((s) => s.symbol), newSymbol])]
      fetchStockData(updatedSymbols)
      setSearchQuery(searchInput)
      setSearchInput("")
    }
  }

  const filteredStocks = searchQuery
    ? stocks.filter((stock) => stock.symbol.includes(searchQuery.toUpperCase()))
    : stocks

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">Stock Price Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-2">
            <Input
              type="text"
              placeholder="Search stock symbol (e.g., AAPL)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner />
                </div>
              ) : filteredStocks.length > 0 ? (
                <StockTable stocks={filteredStocks} />
              ) : (
                <div className="flex justify-center items-center h-64 text-center">
                  <div>
                    <p className="text-lg font-medium">No stock data available</p>
                    <p className="text-muted-foreground mt-2">
                      Try searching for different stock symbols or try again later.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="chart">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner />
                </div>
              ) : filteredStocks.length > 0 ? (
                <StockChart stocks={filteredStocks} />
              ) : (
                <div className="flex justify-center items-center h-64 text-center">
                  <div>
                    <p className="text-lg font-medium">No stock data available for chart</p>
                    <p className="text-muted-foreground mt-2">
                      Try searching for different stock symbols or try again later.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
