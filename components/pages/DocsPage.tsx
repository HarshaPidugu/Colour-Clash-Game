import { Award, AlertTriangle, Info, Target, DollarSign, Sparkles } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="px-4 py-6">
      <h2 className="font-serif text-2xl font-bold text-[#1e1e1e] mb-6">How to Play Color Clash</h2>

      <div className="mb-8">
        <div className="flex items-start mb-4">
          <div className="bg-[#ffd93d] p-2 rounded-full mr-3">
            <Target size={20} className="text-[#1e1e1e]" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1e1e1e] mb-1">Game Objective</h3>
            <p className="text-[#424242]">
              Stake your coins on one of three colors: Red, Green, or Blue. If your color is randomly selected as the
              winner, you double your stake!
            </p>
          </div>
        </div>

        <div className="flex items-start mb-4">
          <div className="bg-[#ffd93d] p-2 rounded-full mr-3">
            <DollarSign size={20} className="text-[#1e1e1e]" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1e1e1e] mb-1">Stakes & Rewards</h3>
            <p className="text-[#424242]">
              Choose your stake amount from 0.1 to 10 coins. Winning doubles your stake, while losing means you forfeit
              your stake.
            </p>
          </div>
        </div>

        <div className="flex items-start mb-4">
          <div className="bg-[#ffd93d] p-2 rounded-full mr-3">
            <Sparkles size={20} className="text-[#1e1e1e]" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1e1e1e] mb-1">Winning Chances</h3>
            <p className="text-[#424242]">
              Each color has an equal 1/3 chance of winning. The game uses a fair random selection algorithm to
              determine the winning color.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center mb-2">
          <Info size={18} className="text-blue-500 mr-2" />
          <h3 className="font-serif text-lg font-bold text-[#1e1e1e]">Game Flow</h3>
        </div>
        <ol className="list-decimal pl-5 text-[#424242] space-y-2">
          <li>Select one of three colors: Red, Green, or Blue</li>
          <li>Choose your stake amount from the available options</li>
          <li>{'Click "Place Bet" to confirm your selection'}</li>
          <li>The winning color is randomly determined</li>
          <li>If your color wins, you receive double your stake</li>
          <li>If your color loses, you forfeit your stake</li>
        </ol>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mb-6">
        <div className="flex items-center mb-2">
          <Award size={18} className="text-green-500 mr-2" />
          <h3 className="font-serif text-lg font-bold text-[#1e1e1e]">Pro Tips</h3>
        </div>
        <ul className="text-[#424242] space-y-2">
          <li>• Watch the daily win percentages to spot trends</li>
          <li>• Start with smaller stakes to learn the game</li>
          <li>• Track your personal history to improve your strategy</li>
        </ul>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
        <div className="flex items-center mb-2">
          <AlertTriangle size={18} className="text-yellow-500 mr-2" />
          <h3 className="font-serif text-lg font-bold text-[#1e1e1e]">Important Note</h3>
        </div>
        <p className="text-[#424242]">
          Color Clash is a game of chance. Play responsibly and only stake coins you can afford to lose. The game is
          designed for entertainment purposes.
        </p>
      </div>
    </div>
  )
}
