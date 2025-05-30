"use client"

import { ArrowLeft } from "lucide-react"

interface TransactionPageProps {
  roundNumber: number
  onBack: () => void
}

export default function TransactionPage({ roundNumber, onBack }: TransactionPageProps) {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#424242] hover:text-[#1e1e1e] transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to History</span>
        </button>
      </div>

      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h2 className="font-serif text-xl font-bold text-[#1e1e1e] mb-2">Round {roundNumber} Transactions</h2>
        <p className="text-[#424242] mb-6">Detailed transaction information will be available here soon.</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            🚧 This feature is under development. Transaction details and analytics will be displayed here.
          </p>
        </div>
      </div>
    </div>
  )
}
