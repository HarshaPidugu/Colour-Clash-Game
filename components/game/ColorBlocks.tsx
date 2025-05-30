"use client"
import { useGameStore } from "@/store/gameStore"
import type { ColorType } from "@/types"

export default function ColorBlocks() {
  const { selectedColor, selectColor, balance } = useGameStore()

  const colors: { name: ColorType; base: string; hover: string; ring: string }[] = [
    { name: "red", base: "bg-red-600", hover: "hover:bg-red-700", ring: "ring-red-400" },
    { name: "green", base: "bg-green-600", hover: "hover:bg-green-700", ring: "ring-green-400" },
    { name: "blue", base: "bg-blue-600", hover: "hover:bg-blue-700", ring: "ring-blue-400" },
  ]

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow-sm p-3 text-center">
        <span className="text-2xl">💰</span>
        <span className="ml-2 text-xl font-bold text-[#1e1e1e]">{balance.toFixed(1)}</span>
        <span className="ml-1 text-[#424242]">coins</span>
      </div>

      <h3 className="text-[#424242] font-medium text-center">Choose your color</h3>

      <div className="grid grid-cols-3 gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => selectColor(color.name)}
            className={`
              h-12 rounded-lg flex items-center justify-center text-white font-semibold uppercase text-sm
              transition-all duration-300 transform
              ${color.base} ${color.hover}
              ${selectedColor === color.name ? `ring-2 ring-offset-1 ${color.ring}` : ""}
              hover:scale-105
            `}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  )
}
