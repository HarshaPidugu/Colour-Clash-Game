"use client"
import { FileText, Grid3X3, History } from "lucide-react"
import type { TabType } from "@/types"

interface BottomNavbarProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export default function BottomNavbar({ activeTab, setActiveTab }: BottomNavbarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around shadow-lg">
      <button
        onClick={() => setActiveTab("docs")}
        className={`flex flex-col items-center justify-center w-1/3 py-2 px-3 transition-colors ${
          activeTab === "docs" ? "text-[#ffd93d]" : "text-[#424242]"
        }`}
      >
        <FileText size={20} />
        <span className="text-xs mt-1">Docs</span>
      </button>

      <button
        onClick={() => setActiveTab("game")}
        className={`flex flex-col items-center justify-center w-1/3 py-2 px-3 transition-colors ${
          activeTab === "game" ? "text-[#ffd93d]" : "text-[#424242]"
        }`}
      >
        <Grid3X3 size={20} />
        <span className="text-xs mt-1">Game</span>
      </button>

      <button
        onClick={() => setActiveTab("history")}
        className={`flex flex-col items-center justify-center w-1/3 py-2 px-3 transition-colors ${
          activeTab === "history" ? "text-[#ffd93d]" : "text-[#424242]"
        }`}
      >
        <History size={20} />
        <span className="text-xs mt-1">History</span>
      </button>
    </nav>
  )
}
