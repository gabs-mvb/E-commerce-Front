import React from 'react';
import Template from "./components/Template";
import ProductDetail from "./pages/products/detail/ProductDetail";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import ProductList from "./pages/products/ProductList";
import Login from "./pages/login/Login";
import Singup from "./pages/login/Singup";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer
          limit={3}
          draggable
          rtl={false}
          pauseOnHover
          closeOnClick
          autoClose={2100}
          pauseOnFocusLoss
          newestOnTop={false}
          position="top-center"
          hideProgressBar={false}
      />
      <Template>
        <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/singup" element={<Singup />} />
        </Routes>
      </Template>
    </>
  );
}

export default App;
