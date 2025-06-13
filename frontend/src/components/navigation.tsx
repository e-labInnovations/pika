"use client";

import { Button } from "@/components/ui/button";
import { Home, List, Plus, Users, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavigationProps {
  isDesktop?: boolean;
}

const tabs = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  {
    id: "transactions",
    label: "Transactions",
    icon: List,
    href: "/transactions",
  },
  { id: "add", label: "Add", icon: Plus, isSpecial: true, href: "/add" },
  { id: "people", label: "People", icon: Users, href: "/people" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function Navigation({ isDesktop = false }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (href: string) => {
    if (href !== "/") {
      return location.pathname.includes(href);
    }
    return location.pathname === "/";
  };

  if (isDesktop) {
    return (
      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={isActive(tab.href) ? "default" : "ghost"}
              className={`w-full justify-start ${
                tab.isSpecial
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : isActive(tab.href)
                  ? "bg-primary/10 text-primary"
                  : ""
              }`}
              onClick={() => navigate(tab.href)}
            >
              <Icon className="w-5 h-5 mr-3" />
              {tab.label}
            </Button>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          if (tab.isSpecial) {
            return (
              <Button
                key={tab.id}
                className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                onClick={() => navigate(tab.href)}
              >
                <Icon className="w-6 h-6" />
              </Button>
            );
          }
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex-1 flex flex-col items-center py-3 ${
                isActive(tab.href) ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => navigate(tab.href)}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
