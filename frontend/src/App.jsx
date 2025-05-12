import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";
import AdminProductDetails from "./components/Admin/AdminProductDetails";
import AdminOrderDetails from "./components/Admin/AdminOrderDetails";
import WhatsAppChatButton from "./components/Common/WhatsappChatButton";

import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import AddNewProductPage from "./components/Admin/AddNewProductPage";
import TShirtCustomizer from "./components/Customize T-Shirts/TShirtCustomizer";
import MyCustomDesigns from "./components/Customize T-Shirts/MyCustomDesigns";
import CustomDesign from "./components/Customize T-Shirts/CustomDesign";
import CustomOrderManagement from "./components/Admin/CustomOrderManagement";
import AdminCustomOrderDetails from "./components/Admin/AdminCustomOrderDetails";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter
        future={{ v7_startTransactions: true, v7_relativeSplatPath: true }}
      >
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={
            <>
              <UserLayout />
              <WhatsAppChatButton />
            </>
          }>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
            <Route path="customize-t-shirts" element={<TShirtCustomizer />} />
            <Route path="/my-custom-designs" element={<MyCustomDesigns />} />
            <Route path="/my-custom-designs/:id" element={<CustomDesign />} />
          </Route>

          {/* Admin Section */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="dashboard" element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id" element={<AdminProductDetails />} />
            <Route path="products/new" element={<AddNewProductPage />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="orders/:id" element={<AdminOrderDetails />} />
            <Route path="custom-orders" element={<CustomOrderManagement />} />
            <Route path="custom-orders/:id" element={<AdminCustomOrderDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;