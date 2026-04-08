import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100 bg-light" style={{ backgroundColor: '#f8f9fa' }}>
          <Navbar />
          <Cart />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </main>
          
          <footer className="bg-white py-4 mt-auto border-top text-center text-muted shadow-sm">
            <div className="container">
              <p className="mb-0 fw-semibold">© 2024 FreshCart Groceries. Delivering quality straight to your door. 🚚</p>
            </div>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
