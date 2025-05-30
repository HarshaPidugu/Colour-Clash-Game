"use client"
import { useState } from "react"
import { useGameStore } from "@/store/gameStore"
import { Sparkles, Zap } from "lucide-react"

export default function BetSelection() {
  const { selectedStake, selectStake, placeBet, selectedColor, balance } = useGameStore()
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const stakes = [
    [0.1, 0.2, 0.5],
    [1, 2, 5],
  ]

  const handlePlaceBet = async () => {
    if (!selectedColor || !selectedStake) return

    setIsPlacingBet(true)

    // Simulate bet processing with animation
    await new Promise((resolve) => setTimeout(resolve, 800))

    placeBet()
    setIsPlacingBet(false)
    setShowSuccess(true)

    // Hide success message after animation
    setTimeout(() => setShowSuccess(false), 2000)
  }

  return (
    <div className="w-full space-y-4 relative">
      <h3 className="text-[#424242] font-medium text-center">Select your stake</h3>

      <div className="space-y-2">
        {stakes.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-2">
            {row.map((stake) => (
              <button
                key={stake}
                onClick={() => selectStake(stake)}
                disabled={stake > balance}
                className={`
                  py-3 rounded-full text-center transition-all duration-200
                  ${
                    selectedStake === stake
                      ? "bg-[#ffd93d] text-[#1e1e1e] font-bold shadow-md transform scale-105"
                      : "bg-gray-100 text-[#424242] hover:bg-gray-200"
                  }
                  ${stake > balance ? "opacity-10 cursor-not-allowed" : ""}
                `}
              >
                {stake}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={handlePlaceBet}
          disabled={!selectedColor || !selectedStake || isPlacingBet}
          className={`
            w-full py-4 rounded-lg text-center font-bold text-white relative overflow-hidden
            transition-all duration-500 transform
            ${
              selectedColor && selectedStake && !isPlacingBet
                ? "bg-gradient-to-r from-[#1e1e1e] to-[#333] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-400 cursor-not-allowed"
            }
            ${isPlacingBet ? "animate-pulse scale-[1.02]" : ""}
          `}
        >
          {/* Animated background for placing bet */}
          {isPlacingBet && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffd93d] via-[#ffed4e] to-[#ffd93d] animate-pulse opacity-20" />
          )}

          {/* Sparkle effects during bet placement */}
          {isPlacingBet && (
            <>
              <Sparkles className="absolute top-2 left-4 w-4 h-4 text-[#ffd93d] animate-spin" />
              <Zap className="absolute top-2 right-4 w-4 h-4 text-[#ffd93d] animate-bounce" />
              <Sparkles className="absolute bottom-2 left-1/3 w-3 h-3 text-[#ffd93d] animate-ping" />
              <Zap className="absolute bottom-2 right-1/3 w-3 h-3 text-[#ffd93d] animate-pulse" />
            </>
          )}

          <span className="relative z-10 flex items-center justify-center gap-2">
            {isPlacingBet ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Bet...
              </>
            ) : selectedColor && selectedStake ? (
              `Place ${selectedStake} on ${selectedColor.toUpperCase()}`
            ) : (
              "Select Color & Stake"
            )}
          </span>
        </button>

        {/* Success Animation Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-lg animate-bounce z-20">
            <div className="text-white font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-6 h-6 animate-spin" />
              Bet Placed Successfully!
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Floating particles effect when bet is placed */}
      {showSuccess && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-[#ffd93d] rounded-full animate-ping`}
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
