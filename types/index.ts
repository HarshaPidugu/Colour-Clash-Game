export type TabType = "docs" | "game" | "history"

export type ColorType = "red" | "green" | "blue"

export interface GameResult {
  id: string
  user: string
  color: ColorType
  stake: number
  winAmount: number | null // null means loss
  timestamp: Date
  isCurrentUser: boolean
  roundNumber?: number // Add optional round number
}

export interface RoundSummary {
  roundNumber: number
  totalStaked: number
  totalDistributed: number
  participantCount: number
  winningColor: ColorType
  timestamp: Date
  platformFee: number
}

export interface GameState {
  selectedColor: ColorType | null
  selectedStake: number | null
  balance: number
  gameHistory: GameResult[]
  winningColors: ColorType[]
  colorStats: Record<ColorType, number>
  timeRemaining: number
  roundActive: boolean
  currentRoundSeed: string
  currentRound: number // Add this line for round tracking
  roundSummaries: RoundSummary[]
  currentTimer?: NodeJS.Timeout
  // Actions
  selectColor: (color: ColorType) => void
  selectStake: (stake: number) => void
  placeBet: () => void
  resetSelection: () => void
  startNewRound: () => void
  endRound: () => void
}
