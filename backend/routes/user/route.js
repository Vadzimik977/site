const app = require("..");
const { User, Wallet, History } = require("../../models/models");

//get user
app.get("/user", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ user: null });
    }

    User.findOne({ where: { adress: token } })
        .then((user) => {
            if (!user) {
                return res.status(401).send({ user: null });
            }

            return res.status(200).json(user);
        })
        .catch((err) => {
            return res.status(404).send({ user: null });
        });
});
// create user
app.post("/user", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).send("No token provided");
    }

    const isUserCreated = await User.findOne({ where: { adress: token } });

    if (isUserCreated) {
        return res.status(409).send("User already created");
    } else {
        const newUser = await User.create();
        const wallet = await Wallet.create({
            userId: newUser.dataValues.id,
        });
        const history = await History.create({
            userId: newUser.dataValues.id,
        });

        console.log("newUser: ", newUser.dataValues);

        return res.json({ user: newUser.dataValues });
    }
});

module.exports = app;
