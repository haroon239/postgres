import { Op, QueryTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { Product, User } from '../models/index.js';

// GET ALL — pagination + filtering + search + sorting
export const getProducts = async (req, res) => {
  try {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // filters
    const { search, minPrice, maxPrice, inStock, category, sortBy, order } = req.query;

    const where = {};

    if (search)
      where.name = { [Op.iLike]: `%${search}%` };

    if (category)
      where.category = { [Op.iLike]: `%${category}%` };

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    if (inStock === 'true')
      where.stock = { [Op.gt]: 0 };

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy || 'createdAt', order || 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      totalProducts: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      products: rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    res.json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      userId: req.user.id  // from JWT token
    });

    res.status(201).json({
      message: 'Product created ✅',
      product
    });

  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(e => e.message);
      return res.status(400).json({ errors });
    }
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // only owner can update
    if (product.userId !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    const { name, description, price, stock, category } = req.body;
    await product.update({ name, description, price, stock, category });

    res.json({ message: 'Product updated ✅', product });

  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(e => e.message);
      return res.status(400).json({ errors });
    }
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // only owner can delete
    if (product.userId !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await product.destroy();
    res.json({ message: 'Product deleted ✅' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RAW QUERY — get products with seller info
// export const getProductsWithStats = async (req, res) => {
//   try {
//     const result = await sequelize.query(
//       `SELECT
//         u.name AS sellerName,
//         u.email AS sellerEmail,
//         COUNT(p.id) AS totalProducts,
//         AVG(p.price) AS averagePrice,
//         SUM(p.stock) AS totalStock
//        FROM "Users" u
//        LEFT JOIN "Products" p ON u.id = p."userId"
//        GROUP BY u.id, u.name, u.email
//        ORDER BY "totalProducts" DESC`,
//       { type: QueryTypes.SELECT }
//     );

//     res.json(result);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };