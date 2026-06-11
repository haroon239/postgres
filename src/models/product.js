import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Product = db.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name is required' },
      len: { args: [3, 100], msg: 'Name must be 3-100 characters' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'Price must be a number' },
      min: { args: [0], msg: 'Price cannot be negative' }
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: { msg: 'Stock must be a whole number' },
      min: { args: [0], msg: 'Stock cannot be negative' }
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

export default Product;