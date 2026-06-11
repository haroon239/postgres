import User from "./user.js";
import Product from "./product.js";

User.hasMany(Product,{
    foreignKey:'userId',
    as:'products',
    onDelete:'CASCADE'
})

Product.belongsTo(User,{
    foreignKey:'userId',
    as:'user'
})

export {User,Product};