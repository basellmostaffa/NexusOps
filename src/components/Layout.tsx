import { useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, Moon, Search, Sun, X } from 'lucide-react'
import { navItems, workspaceItems } from '../data'
import { Icon } from './Icons'

export function Layout({ children, dark, setDark }: { children: ReactNode; dark: boolean; setDark: (v: boolean) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const current = [...navItems, ...workspaceItems].find((item) => item.path === location.pathname)?.label ?? 'Dashboard'
  const Sidebar = () => <aside className="sidebar">
    <div className="brand"><div className="brand-mark">N</div><span>Nexus<span className="brand-accent">Ops</span></span></div>
    <div className="workspace-switch"><div className="workspace-logo">A</div><div><p className="workspace-name">Acme Inc.</p><p className="workspace-meta">Business workspace</p></div><Icon name="ChevronsUpDown" size={14} /></div>
    <p className="nav-label">Overview</p>
    <nav>{navItems.map((item) => <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon name={item.icon} size={17} /><span>{item.label}</span></NavLink>)}</nav>
    <p className="nav-label nav-label-spaced">Workspace</p>
    <nav>{workspaceItems.map((item) => <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon name={item.icon} size={17} /><span>{item.label}</span>{item.label === 'Notifications' && <span className="nav-count">3</span>}</NavLink>)}</nav>
    <div className="sidebar-bottom"><div className="upgrade-box"><div className="upgrade-icon"><Icon name="Sparkles" size={15} /></div><p className="upgrade-title">Unlock more with Pro</p><p className="upgrade-copy">Get deeper insights and custom reports.</p><button className="upgrade-btn">Explore Pro <Icon name="ArrowUpRight" size={13} /></button></div><div className="user-mini"><div className="avatar avatar-pink">BM</div><div className="user-details"><p className="user-name">Basel Mostafa</p><p className="user-email">basel@nexusops.io</p><button className="sign-out-button" onClick={() => { localStorage.removeItem('nexusops-token'); localStorage.removeItem('nexusops-user'); window.dispatchEvent(new Event('nexusops-auth')) }}><Icon name="LogOut" size={13} /> Sign out</button></div></div></div>
  </aside>
  const signOut = () => { localStorage.removeItem('nexusops-token'); localStorage.removeItem('nexusops-user'); window.dispatchEvent(new Event('nexusops-auth')) }
  return <div className="app-shell"><div className={`mobile-overlay ${mobileOpen ? 'show' : ''}`} onClick={() => setMobileOpen(false)} /><div className={`sidebar-wrap ${mobileOpen ? 'open' : ''}`}><Sidebar /></div><main className="main-content"><header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button><div className="breadcrumb"><span>Workspace</span><Icon name="ChevronRight" size={14} /><strong>{current}</strong></div><div className="topbar-actions"><button className="icon-button hide-mobile" aria-label="Search"><Search size={18} /></button><button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button><button className="icon-button notification-button" aria-label="Notifications"><Icon name="Bell" size={18} /><span /></button><div className="avatar avatar-pink hide-mobile">BM</div><button className="topbar-signout" onClick={signOut}><Icon name="LogOut" size={14} /> Sign out</button></div></header><div className="page-content">{children}</div></main></div>
}
