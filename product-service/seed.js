require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/amazon_clone_product';
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);

  const Category = mongoose.model('Category', new mongoose.Schema({
    name: String,
    description: String,
    slug: String
  }, { timestamps: true }));

  const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: mongoose.Schema.Types.ObjectId,
    stock: Number,
    images: [String],
    rating: Number,
    numReviews: Number
  }, { timestamps: true }));

  // Clear existing
  await Category.deleteMany({});
  await Product.deleteMany({});
  console.log('Cleared existing products and categories.');

  // Categories seed data
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics', description: 'Computers, gadgets, and tech accessories' },
    { name: 'Books', slug: 'books', description: 'Novels, technical books, and textbooks' },
    { name: 'Clothing', slug: 'clothing', description: 'Apparel, shoes, and clothing accessories' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Furniture, kitchenware, and decor' }
  ];

  const categories = await Category.insertMany(categoriesData);
  console.log(`Seeded ${categories.length} categories.`);

  // Find category map
  const catMap = {};
  categories.forEach(c => {
    catMap[c.slug] = c._id;
  });

  // Products seed data
  const productsData = [
    {
      name: 'Kindle Paperwhite (16 GB)',
      description: '6.8" display, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.',
      price: 139.99,
      category: catMap['electronics'],
      stock: 45,
      images: ['https://images-na.ssl-images-amazon.com/images/I/61BQD80mJ4L._AC_SX679_.jpg'],
      rating: 4.8,
      numReviews: 240
    },
    {
      name: 'Echo Dot (5th Gen)',
      description: 'Smart speaker with Alexa. Enjoy vibrant sound, check weather, set timers, and control smart home devices.',
      price: 49.99,
      category: catMap['electronics'],
      stock: 120,
      images: ['https://images-na.ssl-images-amazon.com/images/I/61Z1A%2Bu1nEL._AC_SX679_.jpg'],
      rating: 4.5,
      numReviews: 890
    },
    {
      name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      description: 'A handbook of agile software craftsmanship. Master the art of writing clean, maintainable, and elegant code.',
      price: 37.49,
      category: catMap['books'],
      stock: 30,
      images: ['https://images-na.ssl-images-amazon.com/images/I/41xShOLQDGI._SX379_BO1,204,203,200_.jpg'],
      rating: 4.7,
      numReviews: 1450
    },
    {
      name: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      description: 'The classic book by the Gang of Four outlining core reusable design solutions for object-oriented systems.',
      price: 54.99,
      category: catMap['books'],
      stock: 15,
      images: ['https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg'],
      rating: 4.6,
      numReviews: 610
    },
    {
      name: 'Men\'s Hooded Water Resistant Windbreaker Jacket',
      description: 'Lightweight, water-resistant windbreaker jacket featuring front zipper, side pockets, and adjustable hood.',
      price: 29.99,
      category: catMap['clothing'],
      stock: 75,
      images: ['https://images-na.ssl-images-amazon.com/images/I/81fH6e7r7EL._AC_UX679_.jpg'],
      rating: 4.2,
      numReviews: 180
    },
    {
      name: 'Instant Pot Duo 7-in-1 Smart Cooker',
      description: 'Pressure cooker, slow cooker, rice cooker, yogurt maker, steamer, sauté pan, and food warmer all-in-one.',
      price: 89.99,
      category: catMap['home-garden'],
      stock: 60,
      images: ['https://images-na.ssl-images-amazon.com/images/I/61F17VjS9kL._AC_SX679_.jpg'],
      rating: 4.7,
      numReviews: 3200
    }
  ];

  const products = await Product.insertMany(productsData);
  console.log(`Seeded ${products.length} products.`);

  await mongoose.disconnect();
  console.log('Seeding complete. MongoDB connection closed.');
}

run().catch(err => {
  console.error('Error seeding DB:', err);
  process.exit(1);
});
