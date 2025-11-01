"use client"

interface TabNavigationProps {
  activeTab: "virgo" | "anyon_e"
  onTabChange: (tab: "virgo" | "anyon_e") => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-4 border-b border-slate-700">
      <button
        onClick={() => onTabChange("virgo")}
        className={`px-6 py-3 font-semibold transition-colors ${
          activeTab === "virgo" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400 hover:text-slate-300"
        }`}
      >
        System76 Virgo
      </button>
      <button
        onClick={() => onTabChange("anyon_e")}
        className={`px-6 py-3 font-semibold transition-colors ${
          activeTab === "anyon_e" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400 hover:text-slate-300"
        }`}
      >
        Framework anyon_e
      </button>
    </div>
  )
}
