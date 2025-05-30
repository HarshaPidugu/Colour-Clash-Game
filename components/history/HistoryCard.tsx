import type { GameResult } from "@/types"

interface HistoryCardProps {
  result: GameResult
  roundNumber?: number
}

export default function HistoryCard({ result, roundNumber }: HistoryCardProps) {
  const { user, color, stake, winAmount, timestamp, isCurrentUser } = result

  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  const isWin = winAmount !== null
  const amountText = isWin ? `+${winAmount}` : `-${stake}`
  const amountColor = isWin ? "text-green-600" : "text-red-600"

  return (
    <div
      className={`
      p-3 rounded-lg mb-2 border-l-4 shadow-sm transition-all
      ${isCurrentUser ? "bg-gray-50" : "bg-white"}
      ${color === "red" ? "border-red-500" : color === "green" ? "border-green-500" : "border-blue-500"}
    `}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div
            className={`
            w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
            ${color === "red" ? "bg-red-500" : color === "green" ? "bg-green-500" : "bg-blue-500"}
          `}
          >
            {user.charAt(0).toUpperCase()}
          </div>
          <div className="ml-2">
            <div className="font-medium text-[#424242]">{user}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              {roundNumber && <span className="font-medium">Round {roundNumber}</span>}
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className={`font-bold ${amountColor}`}>{amountText}</div>
          <div className="text-xs flex items-center justify-end gap-1">
            <span className={`font-medium ${isWin ? "text-green-600" : "text-red-600"}`}>{isWin ? "Won" : "Lost"}</span>
            <span
              className={`
              inline-block w-3 h-3 rounded-full
              ${color === "red" ? "bg-red-500" : color === "green" ? "bg-green-500" : "bg-blue-500"}
            `}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
