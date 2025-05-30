"use client"

import { useState } from "react"
import BottomNavbar from "@/components/layout/BottomNavbar"
import Header from "@/components/layout/Header"
import DocsPage from "@/components/pages/DocsPage"
import GamePage from "@/components/pages/GamePage"
import HistoryPage from "@/components/pages/HistoryPage"
import type { TabType } from "@/types"

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("game")

  const getTitle = () => {
    switch (activeTab) {
      case "docs":
        return "Game Rules"
      case "game":
        return "Color Clash"
      case "history":
        return "Game History"
      default:
        return "Color Clash"
    }
  }

  const getContent = () => {
    switch (activeTab) {
      case "docs":
        return <DocsPage />
      case "game":
        return <GamePage />
      case "history":
        return <HistoryPage />
      default:
        return <GamePage />
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#424242]">
      <Header title={getTitle()} />
      <main className="pt-14 pb-16">{getContent()}</main>
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
