import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router-dom";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const stripePromise = loadStripe("pk_test_51QUBJ1JvfF84QpkntUfnU4GI1PzwWaduwBE2HkxKGlcpaa5GxyiBjF9gbTwldrCHqCBo4fTCAIZ13qPh2M1Luqcd00fewNAHX3");

const ProductGrid = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const checkSellerRole = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await fetch(
          `https://firestore.googleapis.com/v1/projects/ecommerce-fb5aa/databases/(default)/documents/users/${currentUser.uid}`
        );
        const userData = await userDoc.json();
        setIsSeller(userData.fields.role.stringValue === "seller");
      }
    };

    checkSellerRole();
  }, [auth]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productosCollection = collection(db, 'product');
        const productosSnapshot = await getDocs(productosCollection);
        const data = productosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && filters) {
      const filtered = products.filter(product => {
        const priceInRange = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        const categoryMatch = filters.categories.length === 0 || filters.categories.includes(product.category);
        return priceInRange && categoryMatch;
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, filters]);

  const handleBuyNow = async (product) => {
    const stripe = await stripePromise;

    try {
      const response = await fetch("http://localhost:3001/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              name: product.name,
              price: product.price,
              quantity: 1,
            },
          ],
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
        }),
      });

      const { sessionId } = await response.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error al processar el pagament:", error);
      alert("No s'ha pogut completar el pagament.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Productes disponibles
      </Typography>
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.imageURL || "https://via.placeholder.com/200"}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <Typography variant="h6">{product.name}</Typography>
                </Link>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "10px" }}>
                  €{product.price}
                </Typography>
                {isSeller ? (
                  <Typography variant="body2" color="primary" sx={{ marginTop: "10px" }}>
                    Ets el propietari d'aquest producte.
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBuyNow(product)}
                    sx={{ marginTop: "10px" }}
                  >
                    Comprar ara
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;
