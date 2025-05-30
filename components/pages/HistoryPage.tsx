"use client"

import { useState } from "react"
import { useGameStore } from "@/store/gameStore"
import HistoryCard from "@/components/history/HistoryCard"
import RoundSummaryCard from "@/components/history/RoundSummaryCard"
import TransactionPage from "./TransactionPage"

export default function HistoryPage() {
  const [viewMode, setViewMode] = useState<"all" | "personal">("all")
  const [selectedRound, setSelectedRound] = useState<number | null>(null)
  const gameHistory = useGameStore((state) => state.gameHistory)
  const roundSummaries = useGameStore((state) => state.roundSummaries)

  const filteredHistory = viewMode === "personal" ? gameHistory.filter((result) => result.isCurrentUser) : gameHistory

  const handleRoundClick = (roundNumber: number) => {
    setSelectedRound(roundNumber)
  }

  const handleBackToHistory = () => {
    setSelectedRound(null)
  }

  if (selectedRound !== null) {
    return <TransactionPage roundNumber={selectedRound} onBack={handleBackToHistory} />
  }

  return (
    <div className="px-4 py-6">
      <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setViewMode("all")}
          className={`flex-1 py-2 text-center rounded transition-colors font-medium ${
            viewMode === "all" ? "bg-white text-[#1e1e1e] shadow-sm" : "text-[#424242]"
          }`}
        >
          Game History
        </button>
        <button
          onClick={() => setViewMode("personal")}
          className={`flex-1 py-2 text-center rounded transition-colors font-medium ${
            viewMode === "personal" ? "bg-white text-[#1e1e1e] shadow-sm" : "text-[#424242]"
          }`}
        >
          My History
        </button>
      </div>

      <div>
        {viewMode === "all" ? (
          // Show round summaries for game history
          roundSummaries.length > 0 ? (
            roundSummaries.map((summary) => (
              <RoundSummaryCard
                key={summary.roundNumber}
                summary={summary}
                onClick={() => handleRoundClick(summary.roundNumber)}
              />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No rounds completed yet. Start playing to see round summaries!
            </div>
          )
        ) : // Show personal history
        filteredHistory.length > 0 ? (
          filteredHistory.map((result) => (
            <HistoryCard key={result.id} result={result} roundNumber={result.roundNumber} />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No personal history found. Start playing to see your results!
          </div>
        )}
      </div>
    </div>
  )
}
