import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getCategories, getProducts } from '../services/api';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts(selectedCategory)
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <Container className="py-5">
      <Row>
        <Col md={3} className="d-none d-md-block">
          {loading && categories.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
            </div>
          ) : (
            <CategoryList 
              categories={categories} 
              selectedCategory={selectedCategory} 
              onSelectCategory={setSelectedCategory} 
            />
          )}
        </Col>
        
        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <h2 className="fw-bold mb-0 text-dark header-title">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name 
                : 'All Fresh Products'}
            </h2>
            <span className="text-muted fw-semibold bg-light px-3 py-1 rounded-pill">
              {products.length} items
            </span>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          
          {loading ? (
            <div className="text-center py-5 my-5">
              <Spinner animation="grow" variant="success" className="mb-3" />
              <p className="text-success fw-bold fs-5">Loading fresh groceries...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 bg-light rounded-4 shadow-sm my-4">
              <h3 className="text-muted mb-3">😕</h3>
              <h4>No products found</h4>
              <p className="text-muted">Try selecting a different category.</p>
            </div>
          ) : (
            <Row xs={1} sm={2} lg={3} className="g-4">
              {products.map((product) => (
                <Col key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
