import React, { useState } from 'react';
import { 
  Home, Briefcase, Wrench, Zap, MessageCircle, User, 
  Bell, Search, Menu, X, Settings, LogOut 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  userName?: string;
}

export function DashboardLayout({ children, activePage, onNavigate, userName = 'Friend' }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'jobs', name: 'Jobs', icon: Briefcase },
    { id: 'services', name: 'Services', icon: Wrench },
    { id: 'gigs', name: 'Gigs', icon: Zap },
    { id: 'messages', name: 'Messages', icon: MessageCircle, badge: 3 },
    { id: 'profile', name: 'Profile', icon: User }
  ];

  const mockNotifications = [
    { id: 1, text: 'New job match: Senior Developer', time: '5m ago', unread: true },
    { id: 2, text: 'Your service listing was approved', time: '1h ago', unread: true },
    { id: 3, text: 'Message from Sarah Adeyemi', time: '2h ago', unread: true },
    { id: 4, text: 'Application viewed by employer', time: '1d ago', unread: false }
  ];

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-border">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
            <div className="w-10 h-10 bg-gradient-to-br from-deep-blue to-emerald-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold text-foreground">EnvoysJobs</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-deep-blue text-white'
                      : 'text-foreground-secondary hover:bg-background-secondary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto w-6 h-6 rounded-full bg-emerald-green text-white text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-border">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground-secondary hover:bg-background-secondary transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-foreground/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-border">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-deep-blue to-emerald-green rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">E</span>
                  </div>
                  <span className="text-xl font-bold text-foreground">EnvoysJobs</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-foreground-secondary" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-deep-blue text-white'
                          : 'text-foreground-secondary hover:bg-background-secondary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto w-6 h-6 rounded-full bg-emerald-green text-white text-xs flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* User Menu */}
              <div className="p-4 border-t border-border">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground-secondary hover:bg-background-secondary transition-colors">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
                <button 
                  onClick={() => onNavigate('home')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-border sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground-secondary hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-tertiary" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="w-full pl-10 pr-4 py-2 bg-background-secondary rounded-lg border border-transparent focus:border-deep-blue focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-foreground-secondary hover:text-foreground transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-green rounded-full" />
                </button>

                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <h3 className="font-semibold text-foreground">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {mockNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-background-secondary cursor-pointer transition-colors ${
                              notification.unread ? 'bg-emerald-green/5' : ''
                            }`}
                          >
                            <p className="text-sm text-foreground mb-1">{notification.text}</p>
                            <p className="text-xs text-foreground-tertiary">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 border-t border-border text-center">
                        <button className="text-sm text-deep-blue hover:text-deep-blue-dark font-medium">
                          View All
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Avatar */}
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-deep-blue to-emerald-green flex items-center justify-center text-white font-medium">
                {userName.charAt(0)}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden px-4 pb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-tertiary" />
              <input
                type="text"
                placeholder="Search opportunities..."
                className="w-full pl-10 pr-4 py-2 bg-background-secondary rounded-lg border border-transparent focus:border-deep-blue focus:outline-none transition-colors"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'text-deep-blue' : 'text-foreground-tertiary'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.name}</span>
                {item.badge && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-green text-white text-xs flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
