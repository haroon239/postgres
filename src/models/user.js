import db from '../config/db.js';
import {DataTypes} from 'sequelize';
import bcrypt from 'bcrypt';

const User=db.define('User',{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{msg:'Name is required'},
            len:{args:[2,10],msg:'Name must be between 2 and 10 characters'}
        }
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
           notEmpty:{msg:'Email is required'},
           isEmail:{msg:'Invalid email format'}
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{msg:'Password is required'},
            len:{args:[6,100],msg:'Password must be between 6 and 100 characters'}
        }
    },



})


// Hash password before saving
User.beforeCreate(async(user)=>{
    user.password=await bcrypt.hash(user.password,10);
})

User.beforeUpdate(async(user)=>{
    if(user.changed('password')){
        user.password=await bcrypt.hash(user.password,10);
    }
})

User.prototype.checkPassword = async function(password) {
  console.log('Comparing:', password, this.password); // ← debug
  return await bcrypt.compare(password, this.password);
};

export default User;