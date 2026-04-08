import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BsNavbar, Container, Nav, Badge, Button } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { cartCount, toggleCart } = useContext(CartContext);

  return (
    <BsNavbar bg="white" expand="lg" className="shadow-sm py-3 sticky-top">
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="fw-bold text-success fs-3">
          🛒 FreshCart
        </BsNavbar.Brand>
        
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-4">
            <Nav.Link as={Link} to="/" className="fw-semibold">Home</Nav.Link>
            <Nav.Link as={Link} to="/orders" className="fw-semibold">Orders</Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center">
            <Button 
              variant="outline-success" 
              className="position-relative border-2 px-4 py-2 rounded-pill fw-bold"
              onClick={toggleCart}
            >
              Cart
              {cartCount > 0 && (
                <Badge 
                  pill 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
