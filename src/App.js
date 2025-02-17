import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import ProductDetails from "./components/ProductDetails";
import SidebarFilters from "./components/SidebarFilters";
import { Box, CssBaseline } from "@mui/material";

const Success = () => <h1>Pagament completat!</h1>;
const Cancel = () => <h1>El pagament s'ha cancel·lat.</h1>;

const App = () => {
  const [filters, setFilters] = useState({ priceRange: [0, 1000], categories: [] });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <SidebarFilters onFilterChange={handleFilterChange} />
                  <Box sx={{ flexGrow: 1 }}>
                    <ProductGrid filters={filters} />
                  </Box>
                </Box>
              </>
            }
          />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;
