import {
  Wallet,
  CreditCard,
  PiggyBank,
  ShoppingCart,
  Coffee,
  Car,
  Briefcase,
  Gift,
  Home,
  User,
  Tag,
  Building,
  Smartphone,
} from "lucide-react"

// Icon mapping for string-based icon references
export const iconMap = {
  Wallet,
  CreditCard,
  PiggyBank,
  ShoppingCart,
  Coffee,
  Car,
  Briefcase,
  Gift,
  Home,
  User,
  Tag,
  Building,
  Smartphone,
  // Add string-based mappings for settings
  "Finance-0": Wallet,
  "Finance-1": PiggyBank,
  "Finance-2": CreditCard,
  "Finance-3": Briefcase,
  "Finance-4": Briefcase,
  "Food-0": ShoppingCart,
  "Food-1": ShoppingCart,
  "Food-2": Coffee,
  "Transport-0": Car,
  "Transport-1": Car,
  "Transport-2": Car,
  "Other-0": Tag,
  "People-0": User,
  "Lifestyle-0": Home,
}

interface IconRendererProps {
  iconName: string | any
  className?: string
}

export function IconRenderer({ iconName, className = "w-5 h-5" }: IconRendererProps) {
  // If iconName is already a React component, use it directly
  if (typeof iconName === "function" || (iconName && iconName.$$typeof)) {
    const IconComponent = iconName
    return <IconComponent className={className} />
  }

  // If iconName is a string, look it up in the map
  if (typeof iconName === "string") {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Wallet
    return <IconComponent className={className} />
  }

  // Fallback to Wallet icon
  return <Wallet className={className} />
}
