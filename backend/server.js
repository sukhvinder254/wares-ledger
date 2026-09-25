const express = require("express"); 
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

let products = [
  { id: 1, name: "Enamel Camp Mug", category: "Kitchen", price: 18, stock: 42, color: "#2B6E68", rating: 4 },
  { id: 2, name: "Waxed Canvas Tool Roll", category: "Workshop", price: 64, stock: 15, color: "#8A5A34", rating: 5 },
  { id: 3, name: "Brass Pocket Compass", category: "Outdoors", price: 32, stock: 27, color: "#B8860B", rating: 4 },
  { id: 4, name: "Cast Iron Skillet", category: "Kitchen", price: 45, stock: 33, color: "#3A3A3A", rating: 5 },
  { id: 5, name: "Wool Felt Coasters", category: "Home", price: 22, stock: 61, color: "#7A4B8A", rating: 3 }
];

let nextId = 6;

// (R)EAD ALL — get full list of products
app.get("/products", (req, res) => {
  res.json(products);
});

// (R)EAD ONE — get single product by id
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// (C)REATE — add brand new product
app.post("/products", (req, res) => {
  const { name, category, price, stock, color, rating } = req.body;
  const newProduct = {
    id: nextId++,
    name,
    category,
    price: Number(price),
    stock: Number(stock),
    color: color || "#6366f1",
    rating: Number(rating) || 3
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// (U)PDATE — update existing product
app.put("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, category, price, stock, color, rating } = req.body;
  products[index] = {
    id,
    name,
    category,
    price: Number(price),
    stock: Number(stock),
    color,
    rating: Number(rating)
  };

  res.json(products[index]);
});

// (D)ELETE — remove product
app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running! Open http://localhost:${PORT}/products in your browser.`);
});
