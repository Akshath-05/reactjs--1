import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { getOrders } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const orderPlaced = location.state?.orderPlaced;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        // Sort by ID descending (newest first)
        setOrders(data.sort((a, b) => b.id - a.id));
        setError(null);
      } catch (err) {
        setError('Failed to fetch your orders. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusDetails = (status) => {
    switch (status) {
      case 'Order Placed':
        return { variant: 'info', progress: 25, icon: '📦' };
      case 'Preparing':
        return { variant: 'warning', progress: 50, icon: '🍳' };
      case 'Out for Delivery':
        return { variant: 'primary', progress: 75, icon: '🚚' };
      case 'Delivered':
        return { variant: 'success', progress: 100, icon: '✅' };
      default:
        return { variant: 'secondary', progress: 10, icon: '❓' };
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center mt-5">
        <Spinner animation="grow" variant="success" />
        <p className="mt-3 text-success fw-bold fs-5">Loading your order history...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {orderPlaced && (
        <Alert variant="success" className="mb-4 d-flex align-items-center rounded-4 shadow-sm border-0">
          <span className="fs-3 me-3">🎉</span>
          <div>
            <Alert.Heading className="mb-1 fw-bold fs-5">Order Placed Successfully!</Alert.Heading>
            <p className="mb-0 fw-semibold">Thank you for shopping with FreshCart. You can track its status below.</p>
          </div>
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
        <h2 className="fw-bold mb-0 text-dark">Order History</h2>
        <span className="text-secondary fw-semibold bg-light px-3 py-1 rounded-pill">{orders.length} Orders</span>
      </div>

      {error ? (
        <Alert variant="danger" className="rounded-4">{error}</Alert>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-5 shadow-sm my-4 border">
          <h1 className="display-1 text-muted mb-3">🛒</h1>
          <h4 className="fw-bold mt-4">No orders yet</h4>
          <p className="text-muted fs-5 mb-4">You haven't placed any orders with us.</p>
          <Link to="/" className="btn btn-success btn-lg rounded-pill px-5 fw-bold shadow-sm">
            Start Shopping
          </Link>
        </div>
      ) : (
        <Row className="g-4">
          {orders.map((order) => {
            const statusInfo = getStatusDetails(order.status);
            
            return (
              <Col md={12} lg={6} key={order.id}>
                <Card className="border-0 shadow-sm rounded-4 h-100 product-card transition-all">
                  <Card.Header className="bg-transparent border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-bold">Order #{order.id}</span>
                    <Badge bg={statusInfo.variant} className="px-3 py-2 rounded-pill fw-semibold fs-6">
                      {statusInfo.icon} {order.status}
                    </Badge>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="mb-4 bg-light p-3 rounded-4">
                      <div className="d-flex justify-content-between text-muted mb-2 fw-semibold text-uppercase" style={{ fontSize: '0.8rem' }}>
                        <span>Order Placed</span>
                        <span>Delivered</span>
                      </div>
                      <ProgressBar 
                        now={statusInfo.progress} 
                        variant={statusInfo.variant} 
                        className="rounded-pill bg-white shadow-sm"
                        style={{ height: '10px' }} 
                        animated={order.status !== 'Delivered'}
                      />
                    </div>
                    
                    <Row className="mb-4">
                      <Col xs={6}>
                        <p className="text-muted mb-1 fw-semibold fs-6">Deliver To</p>
                        <p className="fw-bold mb-0 text-truncate">{order.customer_name}</p>
                        <p className="text-secondary text-truncate small mb-0">{order.address}</p>
                      </Col>
                      <Col xs={6} className="text-end">
                        <p className="text-muted mb-1 fw-semibold fs-6">Total Amount</p>
                        <h4 className="fw-bold text-success mb-0">${order.total_price.toFixed(2)}</h4>
                        {order.coupon_code && (
                          <Badge bg="success" className="mt-1">Code: {order.coupon_code}</Badge>
                        )}
                      </Col>
                    </Row>
                    
                    <div className="border-top pt-3">
                      <p className="text-muted mb-2 fw-semibold fs-6">Items ({order.items?.length || 0})</p>
                      <ul className="list-unstyled mb-0">
                        {order.items?.map((item, index) => (
                           <li key={index} className="d-flex justify-content-between align-items-center mb-2 px-3 py-2 bg-light rounded-3">
                            <span className="fw-semibold text-truncate me-3">{item.quantity}x {item.name}</span>
                            <span className="text-secondary opacity-75 fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                           </li>
                        ))}
                      </ul>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default Orders;
