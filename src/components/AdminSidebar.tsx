'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  ChevronRight, 
  Settings, 
  ExternalLink,
  Briefcase,
  Home,
  Share2,
  Users,
  Mail,
  Layout,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { portfolioConfig } from '@/config/portfolio';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Home Section', href: '/admin/home', icon: Home },
    { name: 'About Section', href: '/admin/about', icon: Users },
    { name: 'Skills Section', href: '/admin/skills', icon: Layout },
    { name: 'Projects Edit', href: '/admin/projects', icon: Briefcase },
    { name: 'Follow Me', href: '/admin/follow-me', icon: Share2 },
    { name: 'Contact Section', href: '/admin/contact', icon: Mail },
    { name: 'CV Upload', href: '/admin/cv', icon: Upload },
    { name: 'Messages', href: '/admin/messages', icon: Mail },
    { name: 'Footer Settings', href: '/admin/socials', icon: Settings },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Sidebar Container */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-card border-r border-white/10 z-[100] transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } hidden md:flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          {!isCollapsed && (
            <Link href="/admin" className="text-xl font-black tracking-tighter flex items-center gap-2">
              <span className="text-primary">ADMIN</span>PANEL
            </Link>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="mb-4">
            {!isCollapsed && <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 px-2">Main Menu</p>}
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all group ${
                  pathname === item.href 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} className={pathname === item.href ? 'text-white' : 'group-hover:text-primary transition-colors'} />
                {!isCollapsed && <span className="font-bold text-sm">{item.name}</span>}
              </Link>
            ))}
          </div>


        </div>
      </aside>

      {/* Mobile Top Nav (visible only on small screens) */}
      <nav className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-white/10 z-[100] flex items-center justify-between px-6">
        <Link href="/admin" className="text-lg font-black tracking-tighter">
          <span className="text-primary">ADMIN</span>PANEL
        </Link>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed left-0 top-0 h-full w-72 bg-card border-r border-white/10 z-[120] flex flex-col shadow-2xl"
          >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <Link href="/admin" className="text-xl font-black tracking-tighter">
                  <span className="text-primary">ADMIN</span>PANEL
                </Link>
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
                      pathname === item.href 
                        ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                        : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-bold text-sm">{item.name}</span>
                  </Link>
                ))}
              </div>
              <div className="p-6 border-t border-white/5">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
