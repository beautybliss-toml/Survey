const db = require("../models");
var rimraf = require("rimraf");

const User = db.user;
const Store = db.store;
const Group = db.group;
const Papersetting = db.papersetting;
const Review1 = db.review1;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/app.config");
const lang = require("../lang/lang")

exports.insertOne = async (req, res) => {
    try {

        const salt = await bcrypt.genSalt(10);
        const password1 = await bcrypt.hash("qazxsw", salt)

        const [user, created] = await User.findOrCreate({
            where: { username: 'a.shibayama@hgsgroup.site' },
            defaults: {
                password: password1
            }
        });
        if (created) {
            return res.json({ message: "created" })
        }
        else {
            return res.json({ message: "user alreay exist" })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.insertOne1 = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const password1 = await bcrypt.hash("crypto@*", salt)

        const [user1, created1] = await User.findOrCreate({
            where: { username: 'admin@gmail.com' },
            defaults: {
                password: password1
            }
        })
        if (created1) {
            return res.json({ message: "admin created" })
        }
        else {
            return res.json({ message: "admin alreay exist" })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.signin = async (req, res) => {
    try {
        // const queryInterface = db.sequelize.getQueryInterface();
        // queryInterface.changeColumn('review1s', 'question_names', {
        //     type: db.Sequelize.TEXT,
        //   });
        if (req.user.statusCode === 460)
            return res.status(400).json({ message: "no username" });

        if (req.user.statusCode === 461)
            return res.status(400).json({ message: "no password" });

        const payload = {
            id: req.user.id,
            username: req.user.username,
        };

        jwt.sign(payload, config.secret, { expiresIn: "3650d" }, (err, token) => {
            if (err) {
                throw err;
            }
            res.json({
                message: "Jwt Login Success.",
                token: `JWT ${token}`,
                user: payload,
                serverTime: Date.now()
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.tokenLogin = async (req, res) => {
    try {
        const payload = {
            id: req.user.id,
            username: req.user.username,
        };
        jwt.sign(payload, config.secret, { expiresIn: 360000 }, (err, token) => {
            if (err) {
                throw err;
            }
            res.json({
                message: "Jwt Login Success.",
                token: `JWT ${token}`,
                user: payload,
                serverTime: Date.now()
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.putPassword = async (req, res) => {
    try {
        const user_one = await User.findOne({ where: { username: req.user.username } });

        if (!user_one) return res.status(400).send({ message: "no username" });

        if (req.body.password !== "" && req.body.newPassword !== "") {
            const isMatch = await bcrypt.compare(req.body.password, user_one.password);
            if (!isMatch)
                return res.status(400).send({ message: "no password" });

            const salt = await bcrypt.genSalt(10);
            var newPassword = await bcrypt.hash(req.body.newPassword, salt);

            var updated = await User.update({ password: newPassword, password1: req.body.newPassword }, {
                where: {
                    username: req.user.username
                }
            });

            updated ? res.send({ message: "sucess" }) : res.status(400).send({ message: lang("failed") });
        }
        else {
            return res.status(400).send({ message: "no username" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
