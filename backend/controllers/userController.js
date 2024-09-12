const jwt = require("jsonwebtoken");
const { User } = require("../models/models");

const createJWT = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
    async getAll(req, res) {
        try {
            return res.json(await User.findAll());
        } catch(err) {
            return res.json({ message: err })
        }
    }
  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    if (password !== user.password) {
      return res.status(401).json({ message: "Неправильный пароль" });
    }

    return res.status(200).json({message: 'OK'});
  }

  async register(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: {email} });
    if(user) {
      return res.status(409).json({ message: "Пользователь с такой почтой уже зарегистрирован" })
    }

    const newUser = await User.create({ email,password });
    const token = createJWT(newUser.dataValues.id, newUser.dataValues.email, newUser.dataValues.role );
    return res.json({ token })
  }
}

module.exports = new UserController();