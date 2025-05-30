import ColorBlocks from "@/components/game/ColorBlocks"
import BetSelection from "@/components/game/BetSelection"
import WinPercentageBar from "@/components/game/WinPercentageBar"
import PlayerStats from "@/components/game/PlayerStats"

export default function GamePage() {
  return (
    <div className="px-1 py-4 space-y-4">
      <PlayerStats />
      <WinPercentageBar />
      <div>
        <ColorBlocks />
      </div>
      <BetSelection />
    </div>
  )
}
