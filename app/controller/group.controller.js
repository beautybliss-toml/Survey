const db = require("../models");
const config = require("../config/app.config")
const lang = require('../lang/lang')
const Group = db.group;
const Papersetting = db.papersetting;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
    try {
        const group = await Group.create({ });
        group !== null ? res.json({ message: lang("created") }) : res.json({ message: lang("failed") })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await Group.destroy({
            where: {
                id: req.body.id
            }
        });
        const deleted1 = await Papersetting.destroy({
            where: {
                group_id: req.body.id
            }
        });

        (deleted && deleted1) ? res.json({ message: lang("deleted") }) : res.json({ message: lang("failed") })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.view = async (req, res) => {
    try {
        const group = await Group.findAll();
        res.json({
            group: group
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.clone = async (req, res) => {
    try {
        const group_id = req.body.id;

        const group = await Group.create({ });

        const clone_papersetting = await Papersetting.findAll({
            where: {
                group_id: group_id
            }
        })

        for(let i of clone_papersetting) {
            let list = i.select2 ? i.select2.split(",") : null;
            let select2_list = "";
            let connect = null;
            if(list) {
                for(let j of list) {
                    if(j === "最後のアンケート1") select2_list += "最後のアンケート1" + ","
                    else if(j === "最後のアンケート2") select2_list += "最後のアンケート2" + ","
                    else if(j !== "undefined") select2_list += group.id + "-" + j + ","
                    else select2_list += "undefined,";
                }
            }
            else {
                if(i.connect === "最後のアンケート1") connect = "最後のアンケート1"
                else if(i.connect === "最後のアンケート2") connect = "最後のアンケート2"
                else if(i.connect) connect = group.id + "-" + i.connect
                else connect = null;
            }

            const a = await Papersetting.create({
                select_type: i.select_type,
                question_id: group.id + "-" + i.question_id,
                question_no: i.question_no,
                question_name: i.question_name,
                select1: i.select1,
                select2: list ? select2_list : null,
                connect: connect,
                require: i.require,
                group_id: group.id 
            });
        }

        res.json({ message: lang("success") });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
