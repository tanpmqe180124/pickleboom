import { Route, Routes } from 'react-router-dom';

import { Calendar13 } from '@/components/canlendarBook';
import BookingDate from '@/pages/BookingDate';
import CheckOut from '@/pages/CheckOut';
import PaymentSuccess from '@/pages/PaymentSuccess';
import { PlayerType } from '@/pages/PlayerType';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import Home from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ProfilePage from '../pages/ProfilePage';
import AdminDashboard from '../pages/AdminDashboard';
import MyBookings from '../pages/MyBookings';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import PartnerRoute from './PartnerRoute';
import SelectCourt from '../pages/SelectCourt';
import PartnerDashboardNew from '../pages/PartnerDashboardNew';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/playertype" element={<PlayerType />} />
      <Route path="/booking/select-court" element={<SelectCourt />} />
      <Route path="/booking/date" element={<BookingDate />} />
      <Route path="/booking/checkout" element={<CheckOut />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route element={<PartnerRoute />}>
        <Route path="/partner" element={<PartnerDashboardNew />} />
      </Route>
      <Route path="/112233" element={<Calendar13 />} />
    </Routes>
  );
};

export default AppRoutes;
