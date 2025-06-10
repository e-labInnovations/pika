"use client"

import { Button } from "@/components/ui/button"
import { Home, List, Plus, Users, Settings } from "lucide-react"

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isDesktop?: boolean
}

export function Navigation({ activeTab, setActiveTab, isDesktop = false }: NavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "transactions", label: "Transactions", icon: List },
    { id: "add", label: "Add", icon: Plus, isSpecial: true },
    { id: "people", label: "People", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  if (isDesktop) {
    return (
      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                tab.isSpecial
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                  : activeTab === tab.id
                    ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                    : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="w-5 h-5 mr-3" />
              {tab.label}
            </Button>
          )
        })}
      </nav>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          if (tab.isSpecial) {
            return (
              <Button
                key={tab.id}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg"
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="w-6 h-6 text-white" />
              </Button>
            )
          }
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex-1 flex flex-col items-center py-3 ${
                activeTab === tab.id ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
