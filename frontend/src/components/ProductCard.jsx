import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useContext(CartContext);
  
  const inCart = cartItems.find(item => item.id === product.id);

  return (
    <Card className="h-100 border-0 shadow-sm product-card transition-all">
      <div className="position-relative overflow-hidden rounded-top" style={{ height: '200px' }}>
        <Card.Img 
          variant="top" 
          src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80'} 
          className="h-100 w-100 object-fit-cover product-img" 
          alt={product.name}
        />
        {product.category_name && (
          <Badge bg="success" className="position-absolute top-0 end-0 m-2 px-3 py-2">
            {product.category_name}
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold mb-1 fs-5 text-truncate">{product.name}</Card.Title>
        <Card.Text className="text-success fw-bold fs-4 mb-3">
          ${product.price.toFixed(2)}
        </Card.Text>
        
        <div className="mt-auto">
          {inCart ? (
            <div className="d-flex align-items-center justify-content-between bg-light rounded-pill p-1">
              <Button 
                variant="success" 
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ width: '36px', height: '36px' }}
                onClick={() => addToCart({...product, quantity: -1})} // Handled by updateQuantity context logic
              >
                -
              </Button>
              <span className="fw-bold fs-5 px-3">{inCart.quantity}</span>
              <Button 
                variant="success" 
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ width: '36px', height: '36px' }}
                onClick={() => addToCart(product)}
              >
                +
              </Button>
            </div>
          ) : (
            <Button 
              variant="success" 
              className="w-100 rounded-pill fw-bold py-2 add-to-cart-btn" 
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
