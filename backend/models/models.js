const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
    coins: { type: DataTypes.FLOAT, defaultValue: 0 },
    ton: { type: DataTypes.FLOAT, defaultValue: 0 },
    wallet: { type: DataTypes.STRING, allowNull: true }
});

const Element = sequelize.define('element', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: true },
    symbol: { type: DataTypes.STRING, allowNull: true },
    rare: { type: DataTypes.ENUM("Обычная", "Редкая", "Эпическая"), defaultValue: "Обычная" },
    img: { type: DataTypes.STRING, allowNull: true },
})

const Planet = sequelize.define('planet', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: true },
    speed: { type: DataTypes.FLOAT, allowNull: true},
    updatePrice: { type: DataTypes.INTEGER, allowNull: true },
    img: { type: DataTypes.STRING, allowNull: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: false },
    forLaboratory: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Wallet = sequelize.define('wallet', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.FLOAT, allowNull: true },
});

// PlanetUsers.hasOne(User);
// PlanetUsers.hasOne(Planet)
User.hasMany(Wallet);
//Planet.hasMany(Element);

//Element.belongsTo(Planet);
Planet.belongsToMany(Element, {through: 'element_planets'})
Element.belongsToMany(Planet, {through: 'element_planets'})

Wallet.belongsTo(Element);
Wallet.belongsTo(User);

module.exports = {
    User,
    Planet,
    Wallet,
    Element
}