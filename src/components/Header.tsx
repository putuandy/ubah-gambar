import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className={`border-b ${theme === "dark" ? "border-gray-800" : "border-border"}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/placeholder.svg?height=32&width=32"
              width={32}
              height={32}
              alt="TinyWebP Logo"
              className="rounded-full"
            />
            <h1 className="text-xl font-bold">Ubah Gambar</h1>
          </a>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
  )
}
