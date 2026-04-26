import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Components
import DashboardNavbar from './components/DashboardNavbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';
import useSocket from './hooks/useSocket';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/static/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const ReportLost = lazy(() => import('./pages/reports/ReportLost'));
const ReportFound = lazy(() => import('./pages/reports/ReportFound'));
const ItemsFeed = lazy(() => import('./pages/items/ItemsFeed'));
const ItemDetail = lazy(() => import('./pages/items/ItemDetail'));
const ClaimRequest = lazy(() => import('./pages/claims/ClaimRequest'));
const MyReports = lazy(() => import('./pages/items/MyReports'));
const MyMatches = lazy(() => import('./pages/items/MyMatches'));
const ClaimTracking = lazy(() => import('./pages/claims/ClaimTracking'));
const Notifications = lazy(() => import('./pages/dashboard/Notifications'));
const SearchResults = lazy(() => import('./pages/dashboard/SearchResults'));
const ProfileSettings = lazy(() => import('./pages/account/ProfileSettings'));
const Support = lazy(() => import('./pages/static/Support'));
const Legal = lazy(() => import('./pages/static/Legal'));
const AdminInfo = lazy(() => import('./pages/static/AdminInfo'));

function AppContent() {
  const { isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Define strictly public paths that should NEVER show the dashboard furniture
  const publicPaths = ['/', '/login', '/register', '/support', '/legal', '/admin-info'];
  const isPublicPage = publicPaths.includes(location.pathname);
  
  // Initialize Socket.io
  useSocket();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`flex min-h-screen ${isPublicPage ? 'bg-white' : 'bg-secondary-bg'}`}>
      {isAuthenticated && !isPublicPage && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      
      <div className="flex-1 flex flex-col min-w-0">
        {isAuthenticated && !isPublicPage && (
          <DashboardNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        )}
        
        <main className={`flex-1 ${!isPublicPage ? 'overflow-x-hidden overflow-y-auto' : ''}`}>
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          }>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
              <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
              <Route path="/support" element={<Support />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/admin-info" element={<AdminInfo />} />

              {/* Protected Student Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/report-lost" element={<ReportLost />} />
                <Route path="/report-found" element={<ReportFound />} />
                <Route path="/items-feed" element={<ItemsFeed />} />
                <Route path="/lost-feed" element={<Navigate to="/items-feed?mode=lost" replace />} />
                <Route path="/found-feed" element={<Navigate to="/items-feed?mode=found" replace />} />
                <Route path="/items/:id" element={<ItemDetail />} />
                <Route path="/claims/request/:reportId" element={<ClaimRequest />} />
                <Route path="/my-reports" element={<MyReports />} />
{/* <Route path="/my-matches" element={<MyMatches />} /> */}
                <Route path="/claims/tracking" element={<ClaimTracking />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/profile" element={<ProfileSettings />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <AppContent />
    </Router>
  );
}

export default App;
