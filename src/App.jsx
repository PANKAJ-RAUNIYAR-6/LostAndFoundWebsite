import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './contexts/AuthContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';

// Layouts
import PublicLayout from './layouts/PublicLayout.jsx';
import UserLayout from './layouts/UserLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Public Pages
import Home from './pages/public/Home.jsx';
import About from './pages/public/About.jsx';
import LostItems from './pages/public/LostItems.jsx';
import FoundItems from './pages/public/FoundItems.jsx';
import ItemDetails from './pages/public/ItemDetails.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import OTPVerification from './pages/auth/OTPVerification.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';

// User Pages
import UserDashboard from './pages/user/UserDashboard.jsx';
import ReportLostItem from './pages/user/ReportLostItem.jsx';
import ReportFoundItem from './pages/user/ReportFoundItem.jsx';
import MyLostItems from './pages/user/MyLostItems.jsx';
import MyFoundItems from './pages/user/MyFoundItems.jsx';
import MyClaims from './pages/user/MyClaims.jsx';
import Chat from './pages/user/Chat.jsx';
import Rewards from './pages/user/Rewards.jsx';
import Notifications from './pages/user/Notifications.jsx';
import FeedbackRating from './pages/user/FeedbackRating.jsx';
import Profile from './pages/user/Profile.jsx';
import EditItem from './pages/user/EditItem.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminLostItems from './pages/admin/AdminLostItems.jsx';
import AdminFoundItems from './pages/admin/AdminFoundItems.jsx';
import AdminClaims from './pages/admin/AdminClaims.jsx';
import AdminAbuseReports from './pages/admin/AdminAbuseReports.jsx';
import AdminFeedback from './pages/admin/AdminFeedback.jsx';
import AdminRewards from './pages/admin/AdminRewards.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminActivity from './pages/admin/AdminActivity.jsx';
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/lost" element={<LostItems />} />
                <Route path="/found" element={<FoundItems />} />
                <Route path="/item/:id" element={<ItemDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<OTPVerification />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* User Dashboard & Portal Routes */}
              <Route element={<UserLayout />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/report-lost" element={<ReportLostItem />} />
                <Route path="/report-found" element={<ReportFoundItem />} />
                <Route path="/my-lost" element={<MyLostItems />} />
                <Route path="/my-found" element={<MyFoundItems />} />
                <Route path="/claims" element={<MyClaims />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/feedback" element={<FeedbackRating />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit-item/:id" element={<EditItem />} />
              </Route>

              {/* Admin Console Routes */}
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/lost" element={<AdminLostItems />} />
                <Route path="/admin/found" element={<AdminFoundItems />} />
                <Route path="/admin/claims" element={<AdminClaims />} />
                <Route path="/admin/abuse-reports" element={<AdminAbuseReports />} />
                <Route path="/admin/feedback" element={<AdminFeedback />} />
                <Route path="/admin/rewards" element={<AdminRewards />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/activity" element={<AdminActivity />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>

              {/* 404 Catch-All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
