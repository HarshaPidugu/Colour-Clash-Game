"use client"

import type { RoundSummary } from "@/types"
import { Users, DollarSign, Trophy } from "lucide-react"

interface RoundSummaryCardProps {
  summary: RoundSummary
  onClick: () => void
}

export default function RoundSummaryCard({ summary, onClick }: RoundSummaryCardProps) {
  const { roundNumber, totalStaked, totalDistributed, participantCount, winningColor, timestamp } = summary

  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  const getColorClass = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-500"
      case "green":
        return "bg-green-500"
      case "blue":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-lg mb-3 bg-white shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-[#ffd93d] px-2 py-1 rounded-full">
            <span className="text-xs font-bold text-[#1e1e1e]">Round {roundNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy size={16} className="text-[#ffd93d]" />
            <div className={`w-4 h-4 rounded-full ${getColorClass(winningColor)}`} />
            <span className="text-xs font-medium text-[#424242] capitalize">{winningColor}</span>
          </div>
        </div>
        <span className="text-xs text-gray-500">{formattedTime}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign size={14} className="text-green-600" />
            <span className="text-xs text-[#424242]">Total Staked</span>
          </div>
          <div className="font-bold text-[#1e1e1e]">{totalStaked.toFixed(1)}</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign size={14} className="text-blue-600" />
            <span className="text-xs text-[#424242]">Distributed</span>
          </div>
          <div className="font-bold text-[#1e1e1e]">{totalDistributed.toFixed(1)}</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users size={14} className="text-purple-600" />
            <span className="text-xs text-[#424242]">Players</span>
          </div>
          <div className="font-bold text-[#1e1e1e]">{participantCount}</div>
        </div>
      </div>
    </div>
  )
}
