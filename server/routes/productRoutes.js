const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', authenticate, authorize('product:read'), async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('createdBy', 'username firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Get product by ID
router.get('/:id', authenticate, authorize('product:read'), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true })
      .populate('createdBy', 'username firstName lastName');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

// Create product
router.post('/', authenticate, authorize('product:create'), [
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('description').trim().isLength({ min: 1, max: 500 }),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('category').trim().isLength({ min: 1, max: 50 }),
  body('stock').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category, stock, imageUrl } = req.body;

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      imageUrl: imageUrl || '',
      createdBy: req.user._id
    });

    await product.save();
    await product.populate('createdBy', 'username firstName lastName');

    res.status(201).json({ 
      message: 'Product created successfully', 
      product 
    });
  } catch (error) {
    res.status(500).json({ message: 'Product creation failed', error: error.message });
  }
});

// Update product
router.put('/:id', authenticate, authorize('product:update'), [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ min: 1, max: 500 }),
  body('price').optional().isNumeric().isFloat({ min: 0 }),
  body('category').optional().trim().isLength({ min: 1, max: 50 }),
  body('stock').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, category, stock, imageUrl } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (imageUrl !== undefined) product.imageUrl = imageUrl;

    await product.save();
    await product.populate('createdBy', 'username firstName lastName');

    res.json({ 
      message: 'Product updated successfully', 
      product 
    });
  } catch (error) {
    res.status(500).json({ message: 'Product update failed', error: error.message });
  }
});

// Delete product
router.delete('/:id', authenticate, authorize('product:delete'), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Product deletion failed', error: error.message });
  }
});

module.exports = router;