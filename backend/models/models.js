const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
    coins: { type: DataTypes.DOUBLE, defaultValue: 0 },
    ton: { type: DataTypes.DOUBLE, defaultValue: 0 },
    adress: { type: DataTypes.STRING, allowNull: true }
});

const Element = sequelize.define('element', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: true },
    symbol: { type: DataTypes.STRING, allowNull: true },
    rare: { type: DataTypes.ENUM("Обычная", "Редкая", "Эпическая"), defaultValue: "Обычная" },
    index: { type: DataTypes.INTEGER, allowNull: true },
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
    value: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
});

const UserPlanets = sequelize.define('user_planets', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    level: { type: DataTypes.STRING, allowNull: true, defaultValue: 1 },
});

const History = sequelize.define('user_history', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }
});

const Tasks = sequelize.define('tasks', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.ENUM("tgChannel", "tgChat", "video","refferal","bot") },
    amount: { type: DataTypes.DOUBLE, allowNull: true },
    link: { type: DataTypes.STRING, allowNull: true }
});

const Cosmoports = sequelize.define('spaceports', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    level: { type: DataTypes.TINYINT, allowNull: true, defaultValue: 1 },
    type: { type: DataTypes.ENUM("tanker", "corable") },
});

// PlanetUsers.hasOne(User);
// PlanetUsers.hasOne(Planet)
User.hasOne(Wallet);
User.hasMany(UserPlanets);
Planet.hasMany(UserPlanets);
User.hasOne(History);
User.hasMany(Cosmoports)
//Planet.hasMany(Element);

//Element.belongsTo(Planet);
Planet.belongsToMany(Element, {through: 'element_planets'})
Element.belongsToMany(Planet, {through: 'element_planets'})

Tasks.belongsToMany(User, { through: 'completed_tasks' });
User.belongsToMany(Tasks, { through: 'completed_tasks' });

Wallet.belongsTo(User);
UserPlanets.belongsTo(User);
UserPlanets.belongsTo(Planet);
History.belongsTo(User)
Cosmoports.belongsTo(User);

module.exports = {
    User,
    Planet,
    Wallet,
    Element,
    UserPlanets,
    History,
    Tasks,
    Cosmoports
}