import React, { useContext } from 'react';
import { Offcanvas, Button, ListGroup, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { 
    isCartOpen, 
    toggleCart, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartTotal 
  } = useContext(CartContext);
  
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart(); // Close cart
    navigate('/checkout'); // Go to checkout page
  };

  return (
    <Offcanvas show={isCartOpen} onHide={toggleCart} placement="end" className="border-0 shadow">
      <Offcanvas.Header closeButton className="border-bottom pb-3">
        <Offcanvas.Title className="fw-bold fs-4">Your Cart 🛒</Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="d-flex flex-column p-0">
        {cartItems.length === 0 ? (
          <div className="text-center p-5 my-auto text-muted">
            <h3>🛒</h3>
            <p className="fs-5 mt-3">Your cart is empty</p>
            <Button variant="success" className="mt-2 rounded-pill px-4" onClick={toggleCart}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-grow-1 overflow-auto p-3">
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex align-items-center py-3 border-bottom px-0">
                    <Image 
                      src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'} 
                      rounded 
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                      className="me-3 border"
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="fw-bold mb-0 text-truncate" style={{ maxWidth: '150px' }}>{item.name}</h6>
                        <span className="fw-bold text-success">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="d-flex align-items-center bg-light rounded-pill p-1">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="rounded-circle d-flex align-items-center justify-content-center p-0 text-dark fw-bold border-0"
                            style={{ width: '24px', height: '24px' }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="px-2 fw-semibold fs-6 px-3">{item.quantity}</span>
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="rounded-circle d-flex align-items-center justify-content-center p-0 text-dark fw-bold border-0"
                            style={{ width: '24px', height: '24px' }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button 
                          variant="link" 
                          className="text-danger p-0 text-decoration-none fs-6"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            
            <div className="border-top p-4 bg-light mt-auto">
              <div className="d-flex justify-content-between mb-3 fs-5">
                <span className="text-secondary fw-semibold">Subtotal</span>
                <span className="fw-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <Button 
                variant="success" 
                size="lg" 
                className="w-100 rounded-pill fw-bold py-3 shadow-sm"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Cart;
