import React from 'react';
import { Nav } from 'react-bootstrap';

const CategoryList = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white p-3 rounded-4 shadow-sm mb-4 sticky-top" style={{ top: '80px', zIndex: 10 }}>
      <h5 className="fw-bold mb-3 px-2 text-dark">Categories</h5>
      <Nav className="flex-column gap-2">
        <Nav.Item>
          <Nav.Link 
            className={`rounded-3 py-2 px-3 fw-semibold transition-all ${selectedCategory === null ? 'bg-success text-white' : 'text-secondary hover-bg-light'}`}
            onClick={() => onSelectCategory(null)}
          >
            All Products
          </Nav.Link>
        </Nav.Item>
        {categories.map((category) => (
          <Nav.Item key={category.id}>
            <Nav.Link 
              className={`rounded-3 py-2 px-3 fw-semibold transition-all ${selectedCategory === category.id ? 'bg-success text-white' : 'text-secondary hover-bg-light'}`}
              onClick={() => onSelectCategory(category.id)}
            >
              {category.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default CategoryList;
