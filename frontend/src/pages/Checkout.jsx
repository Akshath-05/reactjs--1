import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { createOrder, validateCoupon } from '../services/api';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: '',
    address: '',
    city: '',
    zip: ''
  });
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  const finalTotal = cartTotal - (cartTotal * (discount / 100));

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    
    setCouponError('');
    setCouponSuccess('');
    
    try {
      const result = await validateCoupon(couponCode);
      setDiscount(result.discount_percentage);
      setCouponSuccess(`Coupon applied! ${result.discount_percentage}% off`);
    } catch (err) {
      setDiscount(0);
      setCouponError(err.response?.data?.error || 'Invalid coupon code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const fullAddress = `${formData.address}, ${formData.city}, ${formData.zip}`;
    
    const orderData = {
      customer_name: formData.customer_name,
      address: fullAddress,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total_price: cartTotal,
      coupon_code: discount > 0 ? couponCode : null
    };

    try {
      setLoading(true);
      setOrderError('');
      await createOrder(orderData);
      clearCart();
      navigate('/orders', { state: { orderPlaced: true } });
    } catch (err) {
      setOrderError('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center my-5">
        <h2 className="mb-4">Your cart is empty</h2>
        <Button variant="success" size="lg" onClick={() => navigate('/')}>
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 border-bottom pb-3">Checkout Securely</h2>
      
      {orderError && <Alert variant="danger">{orderError}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          <Col md={7} lg={8}>
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">Delivery Details</h4>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-secondary">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className="p-3 bg-light border-0"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-secondary">Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="123 Main St, Apt 4B"
                    className="p-3 bg-light border-0"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-secondary">City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="City"
                        className="p-3 bg-light border-0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-secondary">ZIP Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                        placeholder="ZIP Code"
                        className="p-3 bg-light border-0"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={5} lg={4}>
            <Card className="border-0 shadow-sm rounded-4 sticky-top" style={{ top: '100px' }}>
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">Order Summary</h4>
                
                <ListGroup variant="flush" className="mb-4">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item.id} className="px-0 d-flex justify-content-between align-items-center bg-transparent border-bottom-0 pb-2">
                      <div>
                        <span className="fw-semibold">{item.name}</span>
                        <br />
                        <small className="text-secondary">Qty: {item.quantity}</small>
                      </div>
                      <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <div className="mb-4 border-top pt-4">
                  <Form.Label className="fw-semibold text-secondary">Discount Code</Form.Label>
                  <InputGroup>
                    <Form.Control
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="border-success"
                    />
                    <Button variant="outline-success" onClick={handleApplyCoupon} className="fw-bold">
                      Apply
                    </Button>
                  </InputGroup>
                  {couponError && <small className="text-danger mt-1 d-block fw-semibold">{couponError}</small>}
                  {couponSuccess && <small className="text-success mt-1 d-block fw-bold">{couponSuccess}</small>}
                </div>

                <div className="border-top pt-3 mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Subtotal</span>
                    <span className="fw-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Discount ({discount}%)</span>
                      <span className="fw-semibold">-${(cartTotal * (discount / 100)).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Delivery</span>
                    <span className="fw-bold text-success">FREE</span>
                  </div>
                  <div className="d-flex justify-content-between mt-3 pt-3 border-top pb-1">
                    <span className="fw-bold fs-5">Total</span>
                    <span className="fw-bold fs-4 text-success">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  variant="success" 
                  type="submit" 
                  size="lg" 
                  className="w-100 rounded-pill fw-bold shadow-sm py-3"
                  disabled={loading}
                >
                  {loading ? (
                    <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/> Placing Order...</>
                  ) : (
                    'Place Order Securely'
                  )}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Checkout;
