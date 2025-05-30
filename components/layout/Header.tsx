import { useGameStore } from "@/store/gameStore"

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const balance = useGameStore((state) => state.balance)

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#1e1e1e] text-white z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-center">
        <h1 className="font-serif text-xl font-bold">{title}</h1>
      </div>
    </header>
  )
}
