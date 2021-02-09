/**
 * Created by cliff on 2021/1/26.
 */
//
// const { Sequelize, Model, DataTypes } = require('sequelize');
// // const db = require('./sequelizeConnectDb.js')
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: '/Users/cliff/develop/sqlite3db/medical.db'//我这里用的是绝对路径
// });
//
// //模型是 Sequelize 的本质. 模型是代表数据库中表的抽象
// class User extends Model {}
// User.init({
//     username: DataTypes.STRING,
//     birthday: DataTypes.DATE
// }, { sequelize, modelName: 'user' });
//
// (async () => {
//     await sequelize.sync();
//     const jane = await User.create({
//         username: 'janedoe',
//         birthday: new Date(1980, 6, 20)
//     });
//     console.log(jane.toJSON());
// })();
// module.exports = User;