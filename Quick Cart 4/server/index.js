const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require('body-parser');
const app = express(); 
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const router = require('./routes/products.routes')
const path = require('path');
const adminroutes = require('./routes/admin_auth');
const userrouter = require('./routes/user.routes');
const cartroutes = require('./routes/Cart.routes');
const orderroutes = require('./routes/order.routes');
const paymentroutes = require("./routes/payment.routes");
const addressroutes = require("./routes/addressroutes");
const wishlsitroutes = require("./routes/wishlist.routes");


mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
});

app.use(cors({
  origin: ["http://localhost:5173","https://quick-cart2-beta.vercel.app"],
  methods: "GET,POST,PUT,DELETE"
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api" , router);
app.use("/api", adminroutes);
app.use("/api" , userrouter)
app.use("/api" , cartroutes)
app.use("/api" , orderroutes)
app.use("/api" , paymentroutes);
app.use("/api" , addressroutes);
app.use("/api" , wishlsitroutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/", (req, res) => {
  res.send("API is working...");
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
