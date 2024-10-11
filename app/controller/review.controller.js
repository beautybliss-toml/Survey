const db = require("../models");
const config = require("../config/app.config")
const lang = require('../lang/lang')
const Sequelize = require("sequelize");
const Papersetting = db.papersetting;
const Store = db.store;
const Review = db.review;
const Review1 = db.review1;
const Notification = db.notification;
const moment = require('moment')
const valueData = require("../const/data")
const excelJS = require("exceljs")

exports.create = async (req, res) => {

    try {
        const review = await Review1.create({
            question_nos: req.body.question_nos,
            question_names: req.body.question_names,
            answers: req.body.answers,

            store_name: req.body.store_name,
            store_business_url: req.body.store_business_url,
            store_questionnare_url: `${config.server_url}/questionnaire?name=${req.body.store_url_name}`
        });

        review !== null ? res.json({ message: lang("success") }) : res.json({ message: lang("failed") })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

/**
 * 
 * @param {*} req.body.keyword "" | any
 * @param {*} req.body.unread 1 | -1
 * @param {*} req.body.year -1 | any
 * @param {*} req.body.month -1 | any
 * @param {*} req.body.day -1 | any
 * @param {*} req.body.sort 1 | 2
 * @param {*} req.body.pageno 1, 2, 3, ...
 * 
 * @returns reviewData, allCount, matchCount
 *  
 */

exports.getReviewData = async (req, res) => {
    try {

        let where = {}

        if (req.body.keyword !== "") {
            where = {
                [Sequelize.Op.or]: [
                    {
                        question_nos: {
                            [Sequelize.Op.like]: '%' + req.body.keyword + '%'
                        }
                    },
                    {
                        question_names: {
                            [Sequelize.Op.like]: '%' + req.body.keyword + '%'
                        }
                    },
                    {
                        answers: {
                            [Sequelize.Op.like]: '%' + req.body.keyword + '%'
                        }
                    },
                    {
                        store_name: {
                            [Sequelize.Op.like]: '%' + req.body.keyword + '%'
                        }
                    },
                    {
                        store_business_url: {
                            [Sequelize.Op.like]: '%' + req.body.keyword + '%'
                        }
                    },
                    {
                        store_questionnare_url: {
                            [Sequelize.Op.like]: '%' + req.body.keyword + '%'
                        }
                    }
                ]
            }
        }
        if (req.body.unread === 1 || req.body.unread === "1") {
            where = {
                ...where,
                readState: 0
            }
        }
        if (req.body.storeName != "All") {
            where = {
                ...where,
                store_name: req.body.storeName
            }
        }
        if (req.body.startDate) {
            where = {
                ...where,
                createdAt: {
                    [Sequelize.Op.between]: [new Date(moment(req.body.startDate).tz("Africa/Nouakchott").format()), new Date(moment(req.body.endDate).add(24, 'hours').tz("Africa/Nouakchott").format())]
                }
            }
        }

        let order = [
            ['createdAt', 'ASC']
        ]

        if (req.body.sort === 2 || req.body.sort === "2") {
            order = [
                ['createdAt', 'DESC']
            ]
        }

        let reviewAll = await Review1.findAll() //all count
        let matchAll = await Review1.findAll({
            where
        }) //match count

        let reviewData = await Review1.findAll({
            where,
            order,
            offset: (req.body.pageno - 1) * 30,
            limit: 30
        })

        res.json({
            allCount: reviewAll.length,
            matchCount: matchAll.length,
            reviewData
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}

exports.sendExcel = async (req, res) => {
    try {

        console.log(req.query.storeName)

        let where = {}

        if (req.query.keyword !== "") {
            where = {
                [Sequelize.Op.or]: [
                    {
                        question_nos: {
                            [Sequelize.Op.like]: '%' + req.query.keyword + '%'
                        }
                    },
                    {
                        question_names: {
                            [Sequelize.Op.like]: '%' + req.query.keyword + '%'
                        }
                    },
                    {
                        answers: {
                            [Sequelize.Op.like]: '%' + req.query.keyword + '%'
                        }
                    },
                    {
                        store_name: {
                            [Sequelize.Op.like]: '%' + req.query.keyword + '%'
                        }
                    },
                    {
                        store_business_url: {
                            [Sequelize.Op.like]: '%' + req.query.keyword + '%'
                        }
                    },
                    {
                        store_questionnare_url: {
                            [Sequelize.Op.like]: '%' + req.query.keyword + '%'
                        }
                    }
                ]
            }
        }
        if (req.query.unread === 1 || req.query.unread === "1") {
            where = {
                ...where,
                readState: 0
            }
        }
        if (req.query.storeName != "All") {
            where = {
                ...where,
                store_name: req.query.storeName
            }
        }
        if (req.query.startdate !== "undefined" && req.query.startdate !== "null" && req.query.enddate !== "undefined" && req.query.enddate !== "null") {
            where = {
                ...where,
                createdAt: {
                    [Sequelize.Op.between]: [new Date(moment(req.query.startdate).tz("Africa/Nouakchott").format()), new Date(moment(req.query.enddate).add(24, 'hours').tz("Africa/Nouakchott").format())]
                }
            }
        }

        let order = [
            ['createdAt', 'ASC']
        ]

        if (req.query.sort === 2 || req.query.sort === "2") {
            order = [
                ['createdAt', 'DESC']
            ]
        }

        // let reviewAll = await Review1.findAll() //all count
        // let matchAll = await Review1.findAll({
        //     where
        // }) //match count

        let reviewData = await Review1.findAll({
            where,
            order
        })

        const workbook = new excelJS.Workbook();
        workbook.creator = 'Me';

        let worksheet;

        let apapersetting = []

        if (req.query.storeName == "All") {

            let all_store = await Store.findAll() //all count

            for (let j of all_store) {

                let sheetName = j.store_name;
                if (req.query.startdate !== "undefined" && req.query.startdate !== "null" && req.query.enddate !== "undefined" && req.query.enddate !== "null") {
                    sheetName += "(" + req.query.startdate + "~" + req.query.enddate + ")";
                }

                worksheet = workbook.addWorksheet(sheetName);

                let astore = await Store.findOne({ where: { store_name: j.store_name } }) //all count

                apapersetting = await Papersetting.findAll({
                    where: {
                        group_id: astore.store_group_id
                    },
                    order: [
                        ['question_no', 'ASC']
                    ],
                })

                // Define columns in the worksheet 
                worksheet.columns = [
                    { header: "ID", key: "id", width: 5 },
                    { header: "店舗名", key: "store_name", width: 25 },
                    { header: "店舗url名", key: "store_url_name", width: 45 },
                ];

                apapersetting.sort((item1, item2) => {
                    let a = parseInt(item1.question_no.slice(1, item1.question_no.length));
                    let b = parseInt(item2.question_no.slice(1, item2.question_no.length))
                    if (a > b) return 1;
                    if (a == b) return 0;
                    if (a < b) return -1;
                })

                for (let i of apapersetting) {
                    worksheet.columns.push({
                        header: i.question_no + ". " + i.question_name, key: i.question_no + ". " + i.question_name, width: 55
                    })
                }

                // Define columns in the worksheet 
                worksheet.columns = [
                    ...worksheet.columns,
                    { header: "調査調査url", key: "business_url", width: 75 },
                    { header: "登録日", key: "created_at", width: 20 },
                ];

                for (let i = 65; i <= 90; i++) {
                    worksheet.getColumn(String.fromCharCode(i)).alignment = { vertical: "bottom", horizontal: "center" }
                }

                let excel_data = [];

                for (let i in reviewData) {
                    excel_data.push({
                        id: parseInt(i) + 1,
                        store_name: reviewData[i].store_name,
                        store_url_name: reviewData[i].store_business_url,
                        ...makeQuestionAndAnswer(reviewData[i].question_nos, reviewData[i].question_names, reviewData[i].answers),
                        business_url: reviewData[i].store_questionnare_url,
                        created_at: moment(reviewData[i].createdAt).format("YYYY-MM-DD HH:mm:ss")
                    })
                }

                // Add data to the worksheet 
                excel_data.forEach(data => { worksheet.addRow(data); });
            }

            // let fileName = "All"
            // if (req.query.startdate !== "undefined" && req.query.startdate !== "null" && req.query.enddate !== "undefined") {
            //     fileName += req.query.startdate + "~" + req.query.enddate;
            // }

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); res.setHeader("Content-Disposition", "attachment; filename=" + (new Date()).getTime() + ".xlsx");

            // Write the workbook to the response object 
            workbook.xlsx.write(res).then(() => res.end());
        }
        else {
            let sheetName = req.query.storeName;
            if (req.query.startdate !== "undefined" && req.query.startdate !== "null" && req.query.enddate !== "undefined") {
                sheetName += "(" + req.query.startdate + "~" + req.query.enddate + ")";
            }

            worksheet = workbook.addWorksheet(sheetName);

            let astore = await Store.findOne({ where: { store_name: req.query.storeName } }) //all count

            apapersetting = await Papersetting.findAll({
                where: {
                    group_id: astore.store_group_id
                },
                order: [
                    ['question_no', 'ASC']
                ],
            })

            // Define columns in the worksheet 
            worksheet.columns = [
                { header: "ID", key: "id", width: 5 },
                { header: "店舗名", key: "store_name", width: 25 },
                { header: "店舗url名", key: "store_url_name", width: 45 },
            ];

            apapersetting.sort((item1, item2) => {
                let a = parseInt(item1.question_no.slice(1, item1.question_no.length));
                let b = parseInt(item2.question_no.slice(1, item2.question_no.length))
                if (a > b) return 1;
                if (a == b) return 0;
                if (a < b) return -1;
            })

            for (let i of apapersetting) {
                worksheet.columns.push({
                    header: i.question_no + ". " + i.question_name, key: i.question_no + ". " + i.question_name, width: 55
                })
            }

            // Define columns in the worksheet 
            worksheet.columns = [
                ...worksheet.columns,
                { header: "調査調査url", key: "business_url", width: 75 },
                { header: "登録日", key: "created_at", width: 20 },
            ];

            for (let i = 65; i <= 90; i++) {
                worksheet.getColumn(String.fromCharCode(i)).alignment = { vertical: "bottom", horizontal: "center" }
            }

            let excel_data = [];

            for (let i in reviewData) {
                excel_data.push({
                    id: parseInt(i) + 1,
                    store_name: reviewData[i].store_name,
                    store_url_name: reviewData[i].store_business_url,
                    ...makeQuestionAndAnswer(reviewData[i].question_nos, reviewData[i].question_names, reviewData[i].answers),
                    business_url: reviewData[i].store_questionnare_url,
                    created_at: moment(reviewData[i].createdAt).format("YYYY-MM-DD HH:mm:ss")
                })
            }

            // Add data to the worksheet 
            excel_data.forEach(data => { worksheet.addRow(data); });

            // let fileName = req.query.storeName;
            // if (req.query.startdate !== "undefined" && req.query.startdate !== "null" && req.query.enddate !== "undefined") {
            //     fileName += req.query.startdate + "~" + req.query.enddate;
            // }

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=" + (new Date()).getTime() + ".xlsx");

            // Write the workbook to the response object 
            workbook.xlsx.write(res).then(() => res.end());
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}

function makeQuestionAndAnswer(question_nos, question_names, answers) {
    let question_nos_arr = question_nos.split(",");
    let question_names_arr = question_names.split(",");
    let answers_arr = answers.split(",");

    let len = question_nos_arr.length;

    let q_and_a = {};

    for (let i = 0; i < len; i++) {
        q_and_a = {
            ...q_and_a,
            [question_nos_arr[i] + ". " + question_names_arr[i]]: answers_arr[i] !== "-1" ? answers_arr[i] : "回答なし"
        }
    }

    return q_and_a;
}

exports.setReadState = async (req, res) => {
    try {
        let updated = await Review1.update({ readState: 1 }, {
            where: {
                id: req.body.id
            }
        });
        updated !== null ? res.json({ message: lang("updated") }) : res.status(500).json({ message: error.message });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}