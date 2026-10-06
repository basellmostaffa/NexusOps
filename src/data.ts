export type Status = 'Active' | 'Trial' | 'Churned' | 'Paid' | 'Pending' | 'Failed'

export interface Customer {
  id: string; name: string; email: string; company: string; plan: string; status: Status; spend: string; joined: string; initials: string; color: string
}
export interface Order { id: string; customer: string; email: string; date: string; amount: string; status: Status; payment: Status; initials: string; color: string }

export const navItems = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { label: 'Analytics', path: '/analytics', icon: 'ChartNoAxesCombined' },
  { label: 'Customers', path: '/customers', icon: 'UsersRound' },
  { label: 'Products', path: '/products', icon: 'Package' },
  { label: 'Orders', path: '/orders', icon: 'ShoppingBag' },
]
export const workspaceItems = [
  { label: 'Team', path: '/team', icon: 'UserRoundCog' },
  { label: 'Notifications', path: '/notifications', icon: 'Bell' },
  { label: 'Settings', path: '/settings', icon: 'Settings2' },
]
export const customers: Customer[] = [
  { id: 'CUS-1024', name: 'Olivia Rhye', email: 'olivia@catalogue.com', company: 'Catalogue', plan: 'Enterprise', status: 'Active', spend: '$18,420', joined: 'Oct 12, 2024', initials: 'OR', color: 'bg-violet-100 text-violet-700' },
  { id: 'CUS-1023', name: 'Phoenix Baker', email: 'phoenix@qonto.io', company: 'Qonto', plan: 'Growth', status: 'Active', spend: '$9,640', joined: 'Oct 10, 2024', initials: 'PB', color: 'bg-sky-100 text-sky-700' },
  { id: 'CUS-1022', name: 'Lana Steiner', email: 'lana@layers.com', company: 'Layers', plan: 'Growth', status: 'Trial', spend: '$4,250', joined: 'Oct 08, 2024', initials: 'LS', color: 'bg-amber-100 text-amber-700' },
  { id: 'CUS-1021', name: 'Demi Wilkinson', email: 'demi@circooles.com', company: 'Circooles', plan: 'Starter', status: 'Active', spend: '$2,890', joined: 'Oct 06, 2024', initials: 'DW', color: 'bg-rose-100 text-rose-700' },
  { id: 'CUS-1020', name: 'Candice Wu', email: 'candice@command.com', company: 'Command+R', plan: 'Enterprise', status: 'Active', spend: '$22,105', joined: 'Oct 04, 2024', initials: 'CW', color: 'bg-teal-100 text-teal-700' },
  { id: 'CUS-1019', name: 'Natali Craig', email: 'natali@quotient.co', company: 'Quotient', plan: 'Growth', status: 'Churned', spend: '$8,120', joined: 'Sep 29, 2024', initials: 'NC', color: 'bg-orange-100 text-orange-700' },
  { id: 'CUS-1018', name: 'Drew Cano', email: 'drew@hourglass.app', company: 'Hourglass', plan: 'Starter', status: 'Active', spend: '$1,940', joined: 'Sep 25, 2024', initials: 'DC', color: 'bg-indigo-100 text-indigo-700' },
]
export const orders: Order[] = [
  { id: '#ORD-9842', customer: 'Olivia Rhye', email: 'olivia@catalogue.com', date: 'Oct 16, 2024', amount: '$1,240.00', status: 'Paid', payment: 'Paid', initials: 'OR', color: 'bg-violet-100 text-violet-700' },
  { id: '#ORD-9841', customer: 'Phoenix Baker', email: 'phoenix@qonto.io', date: 'Oct 16, 2024', amount: '$840.00', status: 'Paid', payment: 'Paid', initials: 'PB', color: 'bg-sky-100 text-sky-700' },
  { id: '#ORD-9840', customer: 'Lana Steiner', email: 'lana@layers.com', date: 'Oct 15, 2024', amount: '$420.00', status: 'Pending', payment: 'Pending', initials: 'LS', color: 'bg-amber-100 text-amber-700' },
  { id: '#ORD-9839', customer: 'Demi Wilkinson', email: 'demi@circooles.com', date: 'Oct 15, 2024', amount: '$2,100.00', status: 'Paid', payment: 'Paid', initials: 'DW', color: 'bg-rose-100 text-rose-700' },
  { id: '#ORD-9838', customer: 'Candice Wu', email: 'candice@command.com', date: 'Oct 14, 2024', amount: '$680.00', status: 'Failed', payment: 'Failed', initials: 'CW', color: 'bg-teal-100 text-teal-700' },
]
export const revenueData = [
  { month: 'May', revenue: 24, target: 20 }, { month: 'Jun', revenue: 31, target: 26 }, { month: 'Jul', revenue: 28, target: 29 }, { month: 'Aug', revenue: 38, target: 33 }, { month: 'Sep', revenue: 34, target: 37 }, { month: 'Oct', revenue: 48, target: 41 },
]
export const customerGrowth = [
  { month: 'May', value: 420 }, { month: 'Jun', value: 510 }, { month: 'Jul', value: 490 }, { month: 'Aug', value: 620 }, { month: 'Sep', value: 710 }, { month: 'Oct', value: 820 },
]
