import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Homepage from "./homePage";
import BlogDetails from "./components/blogDetails";
import Nav from "./components/nav/nav";
import { Login } from "./components/login/Login";
import { Signup } from "./components/signUp/signUp";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { AuthProvider, useAuth } from "./AuthContext";
import ContactUs from "./components/contactUs/contactUs";
import ForgetPassword from "./components/forgetPassword/forgetPassword";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthWrapper>
          <Routes>
            <Route path="/" element={<ProtectedRoute element={<Homepage />} />} />
            <Route path="/login" element={<PublicRoute element={<Login />} />} />
            <Route path="/blog/:id" element={<ProtectedRoute element={<BlogDetails />} />} />
            <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
            <Route path="/home" element={<ProtectedRoute element={<Homepage />} />} />
            <Route path="/contact" element={<ProtectedRoute element={<ContactUs />} />} />
            <Route path="/forget" element={<PublicRoute element={<ForgetPassword />} />} />
          </Routes>
        </AuthWrapper>
      </BrowserRouter>
    </AuthProvider>
  );
}

const AuthWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const hideNavPaths = ["/login", "/signup"];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNav && isAuthenticated && <Nav />}
      {children}
    </>
  );
};

export default App;