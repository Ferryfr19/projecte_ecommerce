import React, { useState, useEffect } from 'react';
import { Box, Slider, Checkbox, FormGroup, FormControlLabel, Typography } from '@mui/material';
import { db } from '../firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';

const categoryLabels = {
  'teclado': 'Categoria 1',
  'mouse': 'Categoria 2',
  'monitor': 'Categoria 3',
  'portatil': 'Categoria 4'
};

const SidebarFilters = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndPrices = async () => {
      try {
        const productosCollection = collection(db, 'product');
        const productosSnapshot = await getDocs(productosCollection);
        
        let maxProductPrice = 0;
        const fetchedCategories = new Set();

        productosSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.category) fetchedCategories.add(data.category);
          if (data.price > maxProductPrice) maxProductPrice = data.price;
        });

        setMaxPrice(maxProductPrice);
        setPriceRange([0, maxProductPrice]);
        
        const orderedCategories = Object.keys(categoryLabels)
          .filter(cat => fetchedCategories.has(cat));
        
        setCategories(orderedCategories);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchCategoriesAndPrices();
  }, []);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    onFilterChange({ priceRange: newValue, categories: selectedCategories });
  };

  const handleCategoryChange = (event) => {
    const category = event.target.name;
    const isChecked = event.target.checked;
    const updatedCategories = isChecked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    setSelectedCategories(updatedCategories);
    onFilterChange({ priceRange, categories: updatedCategories });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 300, margin: '0 auto' }}>
      <Typography gutterBottom>Filtra per preu</Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={maxPrice}
      />
      <Typography gutterBottom sx={{ mt: 2 }}>Filtra per categoria:</Typography>
      <FormGroup>
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={handleCategoryChange}
                name={category}
              />
            }
            label={categoryLabels[category] || category}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default SidebarFilters;
