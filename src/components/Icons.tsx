import {
  ArrowUpRight, BarChart3, Bell, ChartNoAxesCombined, ChevronRight, ChevronsUpDown,
  Circle, CircleDollarSign, CreditCard, FileCheck2, LayoutDashboard, MessageSquare,
  LogOut, MoreHorizontal, Monitor, Package, Palette, Percent, Settings2, ShoppingBag, Sparkles, UserPlus,
  UserRoundCog, UsersRound, Zap,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'

const iconRegistry: Record<string, ComponentType<LucideProps>> = {
  ArrowUpRight, BarChart3, Bell, ChartNoAxesCombined, ChevronRight, ChevronsUpDown,
  Circle, CircleDollarSign, CreditCard, FileCheck2, LayoutDashboard, MessageSquare,
  LogOut, MoreHorizontal, Monitor, Package, Palette, Percent, Settings2, ShoppingBag, Sparkles, UserPlus,
  UserRoundCog, UsersRound, Zap,
}

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = iconRegistry[name] ?? Circle
  return <Component {...props} />
}
