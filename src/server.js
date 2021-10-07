const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Routes
const productsRoutes = require('./API/products');
const ordersRoutes = require('./API/orders');
const ordersCategories = require('./API/categories');

const PORT = process.env.SERVER_PORT || 3000;

const app = express();

// middleware
app.use(morgan('common'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello express');
});

// use routes
app.use('/products', productsRoutes);
app.use('/order', ordersRoutes);
app.use('/categories', ordersCategories);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
