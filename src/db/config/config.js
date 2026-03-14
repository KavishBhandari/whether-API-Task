 require("dotenv").config();
 const databaseConfig = {
    username: "root",
    password: "",
    database: "wheterApi",
    host: "127.0.0.1",
    dialect: "mysql"
};
module.exports = databaseConfig;