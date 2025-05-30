import { useGameStore } from "@/store/gameStore"
import type { ColorType } from "@/types"
import RoundTimer from "./RoundTimer"

export default function WinPercentageBar() {
  const { colorStats, winningColors } = useGameStore()

  const colors: { type: ColorType; label: string; bgClass: string }[] = [
    { type: "red", label: "Red", bgClass: "bg-red-500" },
    { type: "green", label: "Green", bgClass: "bg-green-500" },
    { type: "blue", label: "Blue", bgClass: "bg-blue-500" },
  ]

  const getLastWinningColor = () => {
    if (winningColors.length === 0) return null
    return winningColors[0]
  }

  const lastWinner = getLastWinningColor()

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <h3 className="text-[#424242] font-bold text-sm">Daily Win Rate</h3>
        </div>
        <RoundTimer />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {colors.map(({ type, label, bgClass }) => (
          <div
            key={type}
            className={`bg-white rounded-lg shadow-sm p-3 text-center transition-all duration-500 ${
              lastWinner === type ? "ring-2 ring-[#ffd93d]" : ""
            }`}
          >
            <div className={`w-6 h-6 ${bgClass} rounded-full mx-auto mb-1`} />
            <div className="text-xs text-[#424242] font-medium">{label}</div>
            <div className="text-lg font-bold text-[#1e1e1e]">{colorStats[type]}%</div>
            {lastWinner === type && <div className="text-xs font-medium text-[#ffd93d] mt-1">Last Winner!</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
