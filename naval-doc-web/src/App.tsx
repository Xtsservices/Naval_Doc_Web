import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import LayoutWrapper from "./components/layout/layoutWrapper";
import AdminDB from "./modules/admin/adminDB";
import FinanceDB from "./modules/finance/dashboard";
import InventoryDB from "./modules/inventory/dashboard";
import Menu from "./modules/menu/menu";
import Profile from "./modules/profile/profile";
// import Wallet from "./modules/wallet/wallet";
import Billing from "./modules/billing";
import Notifications from "./modules/notifications/notifications";
import Cart from "./modules/cart/cart";
import SuperAdminDashboard from "./modules/superAdmin/dashboard";
import CanteenList from "./modules/superAdmin/canteensList";
import UsersList from "./modules/users/userList";
import ItemsList from "./modules/items/itemsList";
import MenuList from "./modules/adminMenus/menuList";
import NotFound from "./components/common/notFound";
import ProtectedRoute from "./auth/protectedRoute";
import LoginScreen from "./auth/loginScreen";
import CanteenAdminDB from "./modules/admin/canteenAdminDB";
import OrdersDashboard from "./modules/orders/ordersDB";
import Contact from "./modules/support/contactSupport";
import PaymentResponse from "./components/paymentmethods/paymentResponse";
import HomePage from "./homepage/homePage";
import Terms from "./homepage/components/Terms";
import Privacy from "./homepage/components/Privacy";
import AboutUs from "./homepage/components/About us";
import Overview from "./homepage/components/Overview";
import UserSelectCanteen from "./userModule/userSelectCanteen";
import SelectMenu from "./userModule/selectMenu";
import MenuByItems from "./userModule/menu/menubyItems";
import MyCart from "./userModule/cart/myCart";
import PaymentMethod from "./userModule/payment/paymentMethod";
import MyOrders from "./userModule/orders/MyOrders";
import Wallet from "./userModule/wallet/wallet";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/paymentResponse" element={<PaymentResponse />} />
        {/* Protected Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<LoginScreen />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutWrapper pageTitle="Naval Dashboard" />}>
            <Route path="/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/finance-management" element={<FinanceDB />} />
            <Route path="/inventory-management" element={<InventoryDB />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/wallet" element={<Wallet />} /> */}
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminDB />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/canteens-list" element={<CanteenList />} />
            <Route path="/contact-support" element={<Contact />} />
            <Route
              path="/canteens-list/canteen-dashboard/:canteenId/users-list"
              element={<UsersList />}
            />
            <Route path="/items-list" element={<ItemsList />} />
            <Route path="/menus-list" element={<MenuList />} />
            <Route path="/orders" element={<OrdersDashboard />} />
            <Route
              path="/canteens-list/canteen-dashboard/:canteenId/:canteenName"
              element={<CanteenAdminDB />}
            />
            <Route
              path="/canteens-list/canteen-dashboard/:canteenId/:canteenName/orders"
              element={<OrdersDashboard />}
            />
            <Route
              path="/canteens-list/canteen-dashboard/:canteenId/:canteenName/menu"
              element={<MenuList />}
            />
          </Route>

          <Route path="/user/select-canteen" element={<UserSelectCanteen />} />
          <Route path="/user/select-menu" element={<SelectMenu />} />
          <Route path="/user/selected-menu/:id" element={<MenuByItems />} />
          {/* <Route path="/user/myCart" element={<Cart />} /> */}
          <Route path="/user/myCart" element={<MyCart />} />
          <Route path="/user/paymentMethod" element={<PaymentMethod />} />
          <Route path="/user/orders" element={<MyOrders />} />
          <Route path="/user/wallet" element={<Wallet />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/user/contact-support" element={<Contact />} />


        {/* Add routes for Terms and Privacy */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about us" element={<AboutUs />} />
        <Route path="/Overview" element={<Overview />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toast Container at root level */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        aria-label="Notification container"
      />
    </Router>
  );
};

export default App;
