import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Home } from "./home";
import { Product_list } from "./product_list";
import { Orders } from "./orders";
import { Adminlayout } from "./Layouts/Adminlayout";
import { Userlayout } from "./Layouts/Userlayout";
import { Dashboard } from "./pages/Dashboard";
import { Shop } from "./pages/Shop";
import { Product_details } from "./pages/daetails";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Adminlogin } from "./pages/adminlogin";
import { Cart } from "./pages/cart";
import { Address } from "./pages/address";
import { My_Order } from "./pages/My_Order";
import { Buds } from "./pages/buds";
import { Laptop } from "./pages/laptop";
import { Headphone } from "./pages/headphone";
import { Wishlist } from "./pages/wishlsit";
import { ForgotPassword } from "./pages/Forgotpassword";
import { Reset } from "./pages/reset";
import { Profile } from "./pages/profile";
import { Users } from "./pages/users";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  Changepassword } from "./pages/change";
import { Showaddress } from "./pages/showaddress";




function App() {
  return (
    <>
     <ToastContainer
          position="top-right"
          autoClose={1500}
          pauseOnHover={false}
          theme="light"
        />
      <Routes>
        <Route path="/" element={<Userlayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="shop" element={<Shop />} />
          <Route path="products/:id" element={<Product_details />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="cart" element={<Cart />} />
          <Route path="address" element={<Address />} />
          <Route path="my-orders" element={<My_Order />} />
          <Route path="buds" element={<Buds />} />
          <Route path="laptop" element={<Laptop />} />
          <Route path="headphone" element={<Headphone />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<Reset />} />
          <Route path="profile" element={<Profile />} />
          <Route path="change-pasword" element={<Changepassword />} />
          <Route path="alladdress" element={<Showaddress />} />
          <Route path="address/:id" element={<Address />} />
        </Route>

        <Route path="/admin" element={<Adminlayout />}>
          <Route path="home" element={<Home />} />
          <Route path="products/:id" element={<Home />} />
          <Route path="products" element={<Product_list />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="admin/login" element={<Adminlogin />} />
      </Routes>
    </>
  );
}

export default App;
