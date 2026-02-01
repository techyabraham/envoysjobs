import React, { useState } from 'react';
import { Header } from './components/homepage/Header';
import { Homepage } from './components/homepage/Homepage';
import { Footer } from './components/homepage/Footer';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { JobsModule } from './components/dashboard/JobsModule';
import { ServicesModule } from './components/dashboard/ServicesModule';
import { GigsModule } from './components/dashboard/GigsModule';
import { MessagingModule } from './components/dashboard/MessagingModule';
import { ProfilePage } from './components/dashboard/ProfilePage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DemoInstructions } from './components/DemoInstructions';

type Page = 
  | 'home' 
  | 'login' 
  | 'signup' 
  | 'dashboard' 
  | 'jobs' 
  | 'services' 
  | 'gigs' 
  | 'messages' 
  | 'profile'
  | 'admin';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email: string) => {
    // Mock login - In real app, this would authenticate with backend
    const mockUser: User = {
      firstName: email === 'admin@envoysjobs.com' ? 'Admin' : 'John',
      lastName: 'Doe',
      email: email,
      isAdmin: email === 'admin@envoysjobs.com'
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    setCurrentPage(mockUser.isAdmin ? 'admin' : 'dashboard');
  };

  const handleSignup = (data: { firstName: string; lastName: string; email: string }) => {
    // Mock signup - In real app, this would register with backend
    const newUser: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      isAdmin: false
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: Page) => {
    // If navigating to protected pages without auth, redirect to login
    if (!isAuthenticated && ['dashboard', 'jobs', 'services', 'gigs', 'messages', 'profile', 'admin'].includes(page)) {
      setCurrentPage('login');
      return;
    }

    // If logged out, clear user data
    if (page === 'home' && isAuthenticated) {
      setUser(null);
      setIsAuthenticated(false);
    }

    setCurrentPage(page);
  };

  // Render admin dashboard
  if (isAuthenticated && user?.isAdmin && currentPage === 'admin') {
    return <AdminDashboard />;
  }

  // Render public pages (home, login, signup)
  if (!isAuthenticated || currentPage === 'home') {
    return (
      <>
        <div className="min-h-screen flex flex-col">
          {currentPage === 'home' && (
            <>
              <Header onNavigate={handleNavigate} />
              <Homepage />
              <Footer />
            </>
          )}
          {currentPage === 'login' && (
            <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
          )}
          {currentPage === 'signup' && (
            <SignupPage onNavigate={handleNavigate} onSignup={handleSignup} />
          )}
        </div>
        {currentPage !== 'home' && <DemoInstructions />}
      </>
    );
  }

  // Render dashboard pages
  return (
    <DashboardLayout 
      activePage={currentPage} 
      onNavigate={handleNavigate}
      userName={user?.firstName || 'Friend'}
    >
      {currentPage === 'dashboard' && (
        <DashboardOverview 
          userName={user?.firstName || 'Friend'} 
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === 'jobs' && <JobsModule />}
      {currentPage === 'services' && <ServicesModule />}
      {currentPage === 'gigs' && <GigsModule />}
      {currentPage === 'messages' && <MessagingModule />}
      {currentPage === 'profile' && (
        <ProfilePage 
          userName={user?.firstName || 'Friend'}
          userEmail={user?.email || ''}
        />
      )}
    </DashboardLayout>
  );
}