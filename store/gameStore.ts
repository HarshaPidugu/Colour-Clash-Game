import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { ColorType, RoundSummary } from "@/types"

// Constants
const ROUND_DURATION = 120 // 2 minutes in seconds
const PLATFORM_FEE = 0.05 // 5% platform fee

// Storage keys
const STORAGE_KEYS = {
  GAME_STATE: "colorClash_gameState",
  ACTIVE_SESSIONS: "colorClash_activeSessions",
  ROUND_TIMER: "colorClash_roundTimer",
  LAST_ROUND_END: "colorClash_lastRoundEnd",
  BACKGROUND_SYNC: "colorClash_backgroundSync",
}

// Background sync manager for mobile devices
class BackgroundSyncManager {
  private static instance: BackgroundSyncManager
  private syncInterval?: NodeJS.Timeout
  private wakeLock?: any
  private isActive = true

  constructor() {
    this.initializeBackgroundSync()
  }

  static getInstance(): BackgroundSyncManager {
    if (!BackgroundSyncManager.instance) {
      BackgroundSyncManager.instance = new BackgroundSyncManager()
    }
    return BackgroundSyncManager.instance
  }

  private async initializeBackgroundSync() {
    if ("wakeLock" in navigator) {
      try {
        this.wakeLock = await (navigator as any).wakeLock.request("screen")
        console.log("Wake lock acquired - app will stay active")
      } catch (err) {
        console.log("Wake lock failed:", err)
      }
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.handleAppBackground()
      } else {
        this.handleAppForeground()
      }
    })

    window.addEventListener("beforeunload", () => {
      this.saveBackgroundState()
    })

    this.startBackgroundSync()

    if ("serviceWorker" in navigator) {
      this.registerServiceWorker()
    }
  }

  private handleAppBackground() {
    console.log("App went to background - maintaining sync")
    this.saveBackgroundState()
    this.startBackgroundSync(5000)
  }

  private handleAppForeground() {
    console.log("App returned to foreground - resuming normal operation")
    this.loadBackgroundState()
    this.startBackgroundSync(1000)
  }

  private startBackgroundSync(interval = 1000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    this.syncInterval = setInterval(() => {
      this.performBackgroundSync()
    }, interval)
  }

  private performBackgroundSync() {
    if (!this.isActive) return

    const now = Date.now()
    const backgroundData = {
      lastSync: now,
      isActive: !document.hidden,
      timestamp: now,
    }

    localStorage.setItem(STORAGE_KEYS.BACKGROUND_SYNC, JSON.stringify(backgroundData))
    this.checkForGameUpdates()
  }

  private checkForGameUpdates() {
    const timerData = TimerManager.getRoundTimer()
    if (timerData && timerData.timeRemaining <= 0) {
      window.dispatchEvent(new CustomEvent("backgroundRoundEnd"))
    }
  }

  private saveBackgroundState() {
    const state = {
      timestamp: Date.now(),
      isBackground: true,
      gameActive: true,
    }
    localStorage.setItem(STORAGE_KEYS.BACKGROUND_SYNC, JSON.stringify(state))
  }

  private loadBackgroundState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BACKGROUND_SYNC)
      if (saved) {
        const state = JSON.parse(saved)
        const timeDiff = Date.now() - state.timestamp

        if (timeDiff > 5 * 60 * 1000) {
          window.dispatchEvent(
            new CustomEvent("backgroundGameSync", {
              detail: { timeDiff },
            }),
          )
        }
      }
    } catch (err) {
      console.log("Failed to load background state:", err)
    }
  }

  private async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered:", registration)

      if (registration.active) {
        registration.active.postMessage({
          type: "INIT_GAME_SYNC",
          data: { roundDuration: ROUND_DURATION },
        })
      }
    } catch (err) {
      console.log("Service Worker registration failed:", err)
    }
  }

  destroy() {
    this.isActive = false
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
    if (this.wakeLock) {
      this.wakeLock.release()
    }
  }
}

// Real user session management - NO MOCK USERS
class UserSessionManager {
  private static instance: UserSessionManager
  private userId: string
  private sessionStartTime: number
  private heartbeatInterval?: NodeJS.Timeout
  private onlineUsersCallback?: (count: number) => void

  constructor() {
    this.userId = this.generateUserId()
    this.sessionStartTime = Date.now()
    this.startSession()
  }

  static getInstance(): UserSessionManager {
    if (!UserSessionManager.instance) {
      UserSessionManager.instance = new UserSessionManager()
    }
    return UserSessionManager.instance
  }

  private generateUserId(): string {
    return "user_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
  }

  private startSession() {
    this.addUserToSession()

    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat()
    }, 15000)

    window.addEventListener("beforeunload", () => {
      this.endSession()
    })

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseSession()
      } else {
        this.resumeSession()
      }
    })
  }

  private addUserToSession() {
    const activeSessions = this.getActiveSessions()
    activeSessions[this.userId] = {
      lastSeen: Date.now(),
      sessionStart: this.sessionStartTime,
      isActive: true,
    }
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, JSON.stringify(activeSessions))
    this.updateOnlineCount()
  }

  private sendHeartbeat() {
    const activeSessions = this.getActiveSessions()
    if (activeSessions[this.userId]) {
      activeSessions[this.userId].lastSeen = Date.now()
      activeSessions[this.userId].isActive = !document.hidden
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, JSON.stringify(activeSessions))
      this.updateOnlineCount()
    }
  }

  private pauseSession() {
    const activeSessions = this.getActiveSessions()
    if (activeSessions[this.userId]) {
      activeSessions[this.userId].inactive = true
      activeSessions[this.userId].lastSeen = Date.now()
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, JSON.stringify(activeSessions))
      this.updateOnlineCount()
    }
  }

  private resumeSession() {
    const activeSessions = this.getActiveSessions()
    if (activeSessions[this.userId]) {
      activeSessions[this.userId].inactive = false
      activeSessions[this.userId].lastSeen = Date.now()
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, JSON.stringify(activeSessions))
      this.updateOnlineCount()
    }
  }

  private endSession() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    const activeSessions = this.getActiveSessions()
    delete activeSessions[this.userId]
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, JSON.stringify(activeSessions))
  }

  private getActiveSessions(): Record<string, any> {
    try {
      const sessions = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSIONS)
      return sessions ? JSON.parse(sessions) : {}
    } catch {
      return {}
    }
  }

  private cleanupOldSessions() {
    const activeSessions = this.getActiveSessions()
    const now = Date.now()
    const sessionTimeout = 3 * 60 * 1000 // 3 minutes timeout

    Object.keys(activeSessions).forEach((userId) => {
      const session = activeSessions[userId]
      if (now - session.lastSeen > sessionTimeout) {
        delete activeSessions[userId]
      }
    })

    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, JSON.stringify(activeSessions))
    return activeSessions
  }

  private updateOnlineCount() {
    const activeSessions = this.cleanupOldSessions()
    // Count only real active sessions - NO artificial inflation
    const activeCount = Object.values(activeSessions).filter((session: any) => !session.inactive).length

    if (this.onlineUsersCallback) {
      this.onlineUsersCallback(activeCount) // Show actual count, could be 0
    }
  }

  setOnlineUsersCallback(callback: (count: number) => void) {
    this.onlineUsersCallback = callback
    this.updateOnlineCount()
  }

  getCurrentOnlineCount(): number {
    const activeSessions = this.cleanupOldSessions()
    return Object.values(activeSessions).filter((session: any) => !session.inactive).length
  }
}

// Enhanced timer persistence with background support
class TimerManager {
  static saveRoundTimer(roundStartTime: number, duration: number, roundNumber: number) {
    const timerData = {
      roundStartTime,
      duration,
      roundNumber,
      savedAt: Date.now(),
      isBackground: document.hidden,
    }
    localStorage.setItem(STORAGE_KEYS.ROUND_TIMER, JSON.stringify(timerData))
  }

  static getRoundTimer(): { timeRemaining: number; roundNumber: number; wasBackground: boolean } | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROUND_TIMER)
      if (!saved) return null

      const timerData = JSON.parse(saved)
      const now = Date.now()
      const elapsed = Math.floor((now - timerData.roundStartTime) / 1000)
      const timeRemaining = Math.max(0, timerData.duration - elapsed)

      return {
        timeRemaining,
        roundNumber: timerData.roundNumber,
        wasBackground: timerData.isBackground || false,
      }
    } catch {
      return null
    }
  }

  static clearRoundTimer() {
    localStorage.removeItem(STORAGE_KEYS.ROUND_TIMER)
  }

  static saveLastRoundEnd(timestamp: number) {
    localStorage.setItem(STORAGE_KEYS.LAST_ROUND_END, timestamp.toString())
  }

  static getLastRoundEnd(): number | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_ROUND_END)
      return saved ? Number.parseInt(saved) : null
    } catch {
      return null
    }
  }

  static processBackgroundRounds(): number {
    const saved = this.getRoundTimer()
    if (!saved) return 0

    let roundsProcessed = 0
    let currentTime = saved.timeRemaining

    while (currentTime <= 0) {
      roundsProcessed++
      currentTime += ROUND_DURATION + 3
    }

    return roundsProcessed
  }
}

// Helper functions
const calculateColorStats = (winningColors: ColorType[]) => {
  const stats: Record<ColorType, number> = { red: 0, green: 0, blue: 0 }
  const total = winningColors.length || 1

  winningColors.forEach((color) => {
    stats[color]++
  })

  Object.keys(stats).forEach((key) => {
    stats[key as ColorType] = Math.round((stats[key as ColorType] / total) * 100)
  })

  return stats
}

const determineWinningColor = (): ColorType => {
  const rand = Math.random()
  if (rand < 0.333) return "red"
  if (rand < 0.666) return "green"
  return "blue"
}

// REMOVED: generateMockParticipants function - no more fake users!

// Generate ONLY real participants (just the current user if they bet)
const generateRealParticipants = (currentUserBet?: { color: ColorType; stake: number }) => {
  const participants: Array<{ user: string; color: ColorType; stake: number; isCurrentUser: boolean }> = []

  // Only add the current user if they placed a bet
  if (currentUserBet) {
    participants.push({
      user: "You",
      color: currentUserBet.color,
      stake: currentUserBet.stake,
      isCurrentUser: true,
    })
  }

  // NO MOCK USERS - only real participants
  return participants
}

// Initial data
const initialWinningColors: ColorType[] = ["red", "blue", "green", "red", "blue"]

// Game state interface
interface GameState {
  selectedColor: ColorType | null
  selectedStake: number | null
  balance: number
  gameHistory: Array<{
    id: string
    user: string
    color: ColorType
    stake: number
    winAmount: number | null
    timestamp: Date
    isCurrentUser: boolean
    roundNumber: number
  }>
  winningColors: ColorType[]
  colorStats: Record<ColorType, number>
  timeRemaining: number
  roundActive: boolean
  currentRoundSeed: string
  currentRound: number
  roundSummaries: RoundSummary[]
  currentTimer?: NodeJS.Timeout
  onlineUsers: number
  sessionManager: any
  backgroundSyncManager: any
  roundStartTime: number
  isInitialized: boolean
  // Actions
  selectColor: (color: ColorType) => void
  selectStake: (stake: number) => void
  placeBet: () => void
  resetSelection: () => void
  startNewRound: () => void
  endRound: () => void
  initializeUserSession: () => void
  initializeGame: () => void
  resumeGame: () => void
  processBackgroundRounds: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      selectedColor: null,
      selectedStake: null,
      balance: 100,
      gameHistory: [],
      winningColors: initialWinningColors,
      colorStats: calculateColorStats(initialWinningColors),
      timeRemaining: ROUND_DURATION,
      roundActive: true,
      currentRoundSeed: "",
      currentRound: 1,
      roundSummaries: [],
      currentTimer: undefined,
      onlineUsers: 1,
      sessionManager: null,
      backgroundSyncManager: null,
      roundStartTime: Date.now(),
      isInitialized: false,

      selectColor: (color: ColorType) => set({ selectedColor: color }),

      selectStake: (stake: number) => set({ selectedStake: stake }),

      resetSelection: () => set({ selectedColor: null, selectedStake: null }),

      initializeUserSession: () => {
        const sessionManager = UserSessionManager.getInstance()
        const backgroundSyncManager = BackgroundSyncManager.getInstance()

        sessionManager.setOnlineUsersCallback((count: number) => {
          set({ onlineUsers: count })
        })

        window.addEventListener("backgroundRoundEnd", () => {
          if (get().roundActive) {
            get().endRound()
          }
        })

        window.addEventListener("backgroundGameSync", (event: any) => {
          get().processBackgroundRounds()
        })

        set({ sessionManager, backgroundSyncManager })
      },

      processBackgroundRounds: () => {
        const roundsToProcess = TimerManager.processBackgroundRounds()

        if (roundsToProcess > 0) {
          console.log(`Processing ${roundsToProcess} background rounds`)

          for (let i = 0; i < roundsToProcess; i++) {
            const winningColor = determineWinningColor()
            const { winningColors, currentRound, roundSummaries } = get()

            // Create round summary with ONLY real data - no fake participants
            const roundSummary: RoundSummary = {
              roundNumber: currentRound + i,
              totalStaked: 0, // No fake stakes
              totalDistributed: 0, // No fake distributions
              participantCount: 0, // No fake participants
              winningColor,
              timestamp: new Date(Date.now() - (roundsToProcess - i) * (ROUND_DURATION * 1000 + 3000)),
              platformFee: 0, // No fake fees
            }

            const newWinningColors = [winningColor, ...winningColors].slice(0, 20)

            set({
              winningColors: newWinningColors,
              colorStats: calculateColorStats(newWinningColors),
              roundSummaries: [roundSummary, ...roundSummaries],
              currentRound: currentRound + i + 1,
            })
          }
        }
      },

      initializeGame: () => {
        if (get().isInitialized) return

        if (!get().sessionManager) {
          get().initializeUserSession()
        }

        get().processBackgroundRounds()

        const savedTimer = TimerManager.getRoundTimer()

        if (savedTimer && savedTimer.timeRemaining > 0) {
          set({
            timeRemaining: savedTimer.timeRemaining,
            currentRound: savedTimer.roundNumber,
            roundActive: true,
            isInitialized: true,
          })
          get().resumeGame()
        } else {
          const lastRoundEnd = TimerManager.getLastRoundEnd()
          const now = Date.now()

          if (lastRoundEnd && now - lastRoundEnd >= 3000) {
            set({ isInitialized: true })
            get().startNewRound()
          } else if (lastRoundEnd) {
            const waitTime = 3000 - (now - lastRoundEnd)
            setTimeout(() => {
              get().startNewRound()
            }, waitTime)
            set({ isInitialized: true })
          } else {
            set({ isInitialized: true })
            get().startNewRound()
          }
        }
      },

      resumeGame: () => {
        const { currentTimer } = get()
        if (currentTimer) {
          clearInterval(currentTimer)
        }

        const timer = setInterval(() => {
          const { timeRemaining, roundActive } = get()

          if (timeRemaining <= 1) {
            clearInterval(timer)
            if (roundActive) {
              get().endRound()
            }
          } else {
            set({ timeRemaining: timeRemaining - 1 })
          }
        }, 1000)

        set({ currentTimer: timer as any })
      },

      startNewRound: () => {
        if (!get().sessionManager) {
          get().initializeUserSession()
        }

        const { currentTimer, currentRound } = get()
        if (currentTimer) {
          clearInterval(currentTimer)
        }

        const seed = Date.now().toString() + Math.random().toString()
        const roundStartTime = Date.now()

        set({
          timeRemaining: ROUND_DURATION,
          roundActive: true,
          currentRoundSeed: seed,
          roundStartTime,
        })

        TimerManager.saveRoundTimer(roundStartTime, ROUND_DURATION, currentRound)

        const timer = setInterval(() => {
          const { timeRemaining, roundActive } = get()

          if (timeRemaining <= 1) {
            clearInterval(timer)
            if (roundActive) {
              get().endRound()
            }
          } else {
            set({ timeRemaining: timeRemaining - 1 })
            if (timeRemaining % 10 === 0) {
              TimerManager.saveRoundTimer(roundStartTime, ROUND_DURATION, currentRound)
            }
          }
        }, 1000)

        set({ currentTimer: timer as any })
      },

      endRound: () => {
        const { selectedColor, selectedStake, balance, winningColors, currentRound, currentTimer } = get()

        if (currentTimer) {
          clearInterval(currentTimer)
        }

        TimerManager.clearRoundTimer()
        TimerManager.saveLastRoundEnd(Date.now())

        const winningColor = determineWinningColor()
        const currentUserBet =
          selectedColor && selectedStake ? { color: selectedColor, stake: selectedStake } : undefined

        // Use ONLY real participants (just the current user if they bet)
        const allParticipants = generateRealParticipants(currentUserBet)

        const totalStaked = allParticipants.reduce((sum, p) => sum + p.stake, 0)
        const winners = allParticipants.filter((p) => p.color === winningColor)
        const losers = allParticipants.filter((p) => p.color !== winningColor)

        const totalLoserAmount = losers.reduce((sum, p) => sum + p.stake, 0)
        const totalWinnerStake = winners.reduce((sum, p) => sum + p.stake, 0)
        const rewardPool = totalLoserAmount * (1 - PLATFORM_FEE)
        const totalDistributed = totalWinnerStake + rewardPool

        let newBalance = balance
        let userResult: {
          id: string
          user: string
          color: ColorType
          stake: number
          winAmount: number | null
          timestamp: Date
          isCurrentUser: boolean
          roundNumber: number
        } | null = null

        if (selectedColor && selectedStake) {
          const isWin = selectedColor === winningColor
          let userWinAmount = 0

          if (isWin) {
            // Since you're the only player, you get your stake back + any platform bonus
            userWinAmount = selectedStake * 2 // Simple 2x multiplier for wins
            newBalance = balance + selectedStake // Win = get your stake back
          } else {
            newBalance = balance - selectedStake // Loss = lose your stake
          }

          userResult = {
            id: Date.now().toString(),
            user: "You",
            color: selectedColor,
            stake: selectedStake,
            winAmount: isWin ? userWinAmount : null,
            timestamp: new Date(),
            isCurrentUser: true,
            roundNumber: currentRound,
          }
        }

        const roundSummary: RoundSummary = {
          roundNumber: currentRound,
          totalStaked,
          totalDistributed,
          participantCount: allParticipants.length, // Will be 0 or 1 (only you)
          winningColor,
          timestamp: new Date(),
          platformFee: totalStaked - totalDistributed,
        }

        const newWinningColors = [winningColor, ...winningColors].slice(0, 20)

        set({
          balance: newBalance,
          gameHistory: userResult ? [userResult, ...get().gameHistory] : get().gameHistory,
          winningColors: newWinningColors,
          colorStats: calculateColorStats(newWinningColors),
          roundSummaries: [roundSummary, ...get().roundSummaries],
          selectedColor: null,
          selectedStake: null,
          roundActive: false,
          currentTimer: undefined,
          currentRound: currentRound + 1,
        })

        setTimeout(() => {
          get().startNewRound()
        }, 3000)
      },

      placeBet: () => {
        const { selectedColor, selectedStake, balance } = get()

        if (!selectedColor || !selectedStake || balance < selectedStake) {
          return
        }

        set({ selectedColor, selectedStake })
      },
    }),
    {
      name: STORAGE_KEYS.GAME_STATE,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        balance: state.balance,
        gameHistory: state.gameHistory,
        winningColors: state.winningColors,
        colorStats: state.colorStats,
        currentRound: state.currentRound,
        roundSummaries: state.roundSummaries,
        selectedColor: state.selectedColor,
        selectedStake: state.selectedStake,
      }),
    },
  ),
)
