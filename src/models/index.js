import User from "./user.js";
import Product from "./product.js";
import Todo from "./todo.js";

User.hasMany(Product,{
    foreignKey:'userId',
    as:'products',
    onDelete:'CASCADE'
})

Product.belongsTo(User,{
    foreignKey:'userId',
    as:'user'
})


User.hasMany(Todo,{
    foreignKey:'userId',
    as:'todos',
    onDelete:'CASCADE'
})

Todo.belongsTo(User,{
    foreignKey:'userId',
    as:'user'
})

export {User,Product,Todo};