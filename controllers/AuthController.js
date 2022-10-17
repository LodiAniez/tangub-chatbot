var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({extended: false});
var mysql = require('mysql');
var validator = require('express-validator');
const csvtojson = require('csvtojson');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csv = require('fast-csv');
const crypto = require('crypto');
const { hashSync, genSaltSync } = require('bcrypt');
const url = require('url');

const bcryptX1 = require('bcrypt');

const APP_URL = 'https://nmscstchatbot.serv00.net:3153';

const nodemailer = require('nodemailer');

const querystring = require("querystring");


//global.gradeSY= "";
port = process.env.PORT || 3153;

var apikeySMS = "816677ff0422ad99c4cdb32eddfc46d2";

var gradeSY = "";
var gradeSEM = "";
var StudentName = "";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const uploadStorage = multer({storage: storage})

// To check your account status:


//Receive = require('../services/receive');
GraphApi = require('../services/graph-api');
//User = require('../services/user');


var users = {};
var axios = require("axios");

var MockAdapter = require("axios-mock-adapter");

const request = require('request');

// This sets the mock adapter on the default instance


var FB_ACCESS_TOKEN = 'EAAQJ6TWZBAnwBAMMPauQ4pdx9CZBwUZCRFOxHZAGmhmQBU7C5oDnC8ES8nSlQd0iIyzfQVrOvP8UUlB2TZB57JHjtEE1nlxDT4Uj1FhBzvzgQfusJCXrcwJHzbQZCUsZCJITZAcgqCi0I1wFMKcWwZASUX9ZCt6RFqQArfTUcZCvg7VIdhyloYrx8lAqWEfGAxMtCk96QJ4KSJpggZDZD';
var FB_VERIFY_TOKEN = 'ambotlangjudnimo';
var FB_APP_SECRET = '4f2d2035df9dd79dbc7c649a6f342509';

let users2 = [
    {id: 1, username: 'admin', password: '123456', email: 'admin@nmscst.edu.ph'}
];


const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'mysql0.serv00.com',
    user: 'm1007_tangub',
    password: 'Access30Granted',
    database: 'm1007_nmscstchatbot'
});


var connection = mysql.createConnection({
    connectionLimit: 100,
    host: 'mysql0.serv00.com',
    user: 'm1007_tangub',
    password: 'Access30Granted',
    database: 'm1007_nmscstchatbot'
});

//connection.connect(function(error) { if (error) throw error;});
//connection2.connect(function(error) { if (error) throw error;});
let db = {};

module.exports = function (app) {

    (function loop() {
        setTimeout(() => {
            // Your logic here

            console.log("Checking SMS API...");
            smsAPIgetMESSAGES();
            loop();
        }, 30000);
    })();


    (function loop2() {
        setTimeout(() => {
            // Your logic here
            console.log("Check SMS for V...");
            smsAPICheckMESSAGES();
            loop2();
        }, 60000);
    })();


    //
    function getCurrentTimestamp() {
        return Date.now();
    }


    function dateFormat(inputDate, format) {
        //parse the input date
        const date = new Date(inputDate);

        //extract the parts of the date
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        //replace the month
        format = format.replace("MM", month.toString().padStart(2, "0"));

        //replace the year
        if (format.indexOf("yyyy") > -1) {
            format = format.replace("yyyy", year.toString());
        } else if (format.indexOf("yy") > -1) {
            format = format.replace("yy", year.toString().substr(2, 2));
        }

        //replace the day
        format = format.replace("dd", day.toString().padStart(2, "0"));

        return format;
    }

//JS
    function addHoursToDate(date, hours) {
        return new Date(new Date(date).setHours(date.getHours() + hours));
    }


    function smsAPIgetMESSAGES() {

// var senderID = event.sender.id;
        var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";

        request({
                //https://semysms.net/api/3/inbox_sms.php?token=2d9d148edeb50768c22dc6d96f85d60b&device=1&start_id=1&end_id=371&phone=123457890
                url: "https://semysms.net/api/3/inbox_sms.php?token=" + tokeings + "&device=321584",
                method: 'GET',
                headers: {'Content-Type': 'application/json'}

            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);

                    // var user = JSON.parse(body);

                    var user = JSON.parse(body);
                    //  console.log(user.data[ihap].msg);
                    console.log("SMS Count: " + user.count);

                    if (user.count > 0) {
                        //naay sulod
                        var ihap = 0;

                        while (ihap < user.count) {

                            console.log(user.data[ihap].msg);


                            //------ start-save to db

                            var inquirySMS = user.data[ihap].msg;  //user.data[ihap].phone
                            var inquirerCelNo = user.data[ihap].phone;  //
                            var SMSmessageID = user.data[ihap].id;
                            var SMSdatetime = user.data[ihap].date;

                            var outputstr = inquirySMS.replace(/'/g, '"');
                            const encoded = encodeURI(outputstr);


                            const str = SMSdatetime;


                            const [dateComponents, timeComponents] = str.split(' ');

                            var Converteddate = dateFormat(SMSdatetime, 'MM-dd-yyyy');

//console.log(Converteddate);
//console.log(timeComponents);

                            const [month, day, year] = Converteddate.split('-');
                            const [hours, minutes, seconds] = timeComponents.split(':');
                            const date = new Date(+year, month - 1, +day, +hours, +minutes, +seconds);
//console.log(addHoursToDate(date,2))
                            const timestamp = addHoursToDate(date, 2).getTime();
//console.log(timestamp);


                            var SaveSMSReceivedtoDB = new Promise(function (resolve, reject) {

                                var sqlw2 = "INSERT INTO conversation values('','',0,'" + encoded + "','" + timestamp + "','" + inquirerCelNo + "', 'SMS', '" + SMSmessageID + "',0)";
                                console.log(sqlw2);

                                connection.query(sqlw2, function (error, results) {
                                    if (error) {
                                        console.error(error);
                                        return;
                                    } else {
                                        return;
                                    }

                                    resolve(SaveSMSReceivedtoDB)
                                });

                            });
                            //-------end-save to db

                            ihap++;
                        }

                    } else {

                        //walay sulod
                        console.log("walay sulod");

                        // return;

                    }

                    //-----------------------&start_id=1&end_id=371
                    request({
                            //https://semysms.net/api/3/inbox_sms.php?token=2d9d148edeb50768c22dc6d96f85d60b&device=1&start_id=1&end_id=371&phone=123457890
                            url: "https://semysms.net/api/3/del_inbox_sms.php?token=" + tokeings + "&device=321584",
                            method: 'GET',
                            headers: {'Content-Type': 'application/json'}

                        },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {

                            } else {
                                // TODO: Handle errors
                                //response.send(body);
                            }
                        });

                    //------


                } else {
                    // TODO: Handle errors
                    //response.send(body);
                }
            });
    }


    function smsAPICheckMESSAGES() {
        var gsm = "";
        var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";
        // var s1 = studentCP;
//var s2 = s1.substring(1);
//  var text1="+63";
//let numeroCP= text1.concat(s2);
//  console.log(numeroCP);

        var getCheckMessages = new Promise(function (resolve, reject) {
            var studentCPDB = "";
            var sqlquery = "SELECT * FROM conversation WHERE channel='SMS' and inquirystatus=0";
            var xvsemX = ""
            connection.query(sqlquery, function (error, results) {
                if (error) {
                    studentCPDB = "";
                    console.error(error);
                    return;
                } else {
                    let studentRows;

                    if (results.length > 0) {
                        smsRows = JSON.parse(JSON.stringify(results));

                        var ihap = 0;


                        console.log("\n\nSMSDBCount: " + results.length + "\n\n");
                        while (ihap < results.length) {

                            var smsMsgConverID = smsRows[ihap].conversion_id;
                            var smsMsgConverDateTIme = smsRows[ihap].date_time;
                            var smsMsgContactNo = smsRows[ihap].inquirer_contactno;
                            var smsMsgchannel = smsRows[ihap].channel;
                            var smsMsgstatus = smsRows[ihap].inquirystatus;

                            var smsMsg = decodeURI(smsRows[ihap].inquiry);

                            var id = smsMsgContactNo;
                            var numero = id.substr(id.length - 10);
                            if (smsMsgContactNo == "Globe") {
                                console.log("Nagchat si Globe");
                            } else if (numero == "9639231290") {
                                console.log("my number");
                            } else if (numero == "SMART") {
                                console.log("Nagchat si smart");
                            }else {
                                //notglobe
                                let c1 = smsMsg.toUpperCase();
                                console.log("\n" + c1);
                                if (c1.includes("KEYWORDS")) {
                                    console.log("Contact No: " + smsMsgContactNo);
                                    console.log("Conversation ID: " + smsMsgConverID);
                                    ReplySendStudentSMSKeywords(smsMsgContactNo, smsMsgConverID);

                                } else if (c1.includes("GRADE")) {
                                    var smsgsm = smsMsg;
                                    let arr = smsgsm.split(' ');

                                    let string1 = arr[0];
                                    let string2 = arr[1];
                                    let string3 = arr[2];
                                    var xS12 = string2;
                                    var xSy12 = string3;


                                    const SYear = ["2018-2019", "2019-2020", "2020-2021", "2021-2022", "2022-2023", "2023-2024"];
                                    const Semdata1 = ["1", "2"];
//SYear.includes(string2);  

                                    if (string1.toUpperCase() == "GRADE") {
                                        //correct keyword GRADE
                                        if (SYear.includes(string2)) {
                                            //naa sa list sa school year
                                            if (Semdata1.includes(string3)) {


                                                console.log("pwede");
                                                console.log("celno: " + numero);
                                                //naa sa list sa sem

                                                SendGradeviaSMS(smsMsgContactNo, xS12, xSy12, smsMsgConverID);
                                                //------

                                                ///-----

                                            } else {
                                                //wala sa possible choices sa sem
                                                // console.log("wrong sem");
                                                var msg = "Wrong Semester. \n GRADE< space>SCHOOLYEAR< space> SEMESTER (Ex. GRADE 2018-2019 1)";
                                                SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                                            }
                                        } else {
                                            //wala sa possible choices  sa school year
                                            console.log("wrong sy");
                                            var msg = "Wrong School Year. \n GRADE< space>SCHOOLYEAR< space> SEMESTER (Ex. GRADE 2018-2019 1)";
                                            SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                                        }
                                    } else {
                                        // wrong keyword grade
                                        console.log("wrong keyword");
                                        var msg = "Wrong Keyword. \n GRADE< space>SCHOOLYEAR< space> SEMESTER (Ex. GRADE 2018-2019 1)";
                                        SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                                    }


                                } else if (c1.includes("INQUIRE")) {
                                    // var msg = "Wrong Keyword. \n GRADE< space>SCHOOLYEAR< space> SEMESTER (Ex. GRADE 2018-2019 1)";
                                    //SendStudentSMSError(numero, msg, smsMsgConverID);
                                    console.log("MO INQUIRE KA");
                                    SaveSMSInquirytoDB(smsMsgContactNo, smsMsg, smsMsgConverID);


                                } else if (c1.includes("EVENTS")) {
                                    console.log("MO tan aw  KA sa EVENTS");
                                    console.log(numero); //smsMsgConverID
//if (string1.toUpperCase() == "GRADE") {
                                    //str.toUpperCase().includes('Stark'.toLowerCase()); // true
                                    EventSMS(smsMsgContactNo, smsMsgConverID, smsMsg);


                                } else if (c1.toUpperCase().includes("FORGOTPASSWORD")) {
                                    console.log("MO FORGOTPASSWORD KA");
                                    // console.log(numero); //smsMsgConverID
                                    SendStudentNewPasswordSMS(smsMsgContactNo, smsMsgConverID)

                                } else if (c1.toUpperCase().includes("FORGOTSCHOOLID")) {
                                    console.log("MO FORGOTSCHOOLID KA");
                                    console.log(numero); //smsMsgConverID
                                    SendStudentIDNoSMS(smsMsgContactNo, smsMsgConverID);

                                } else if (c1.toUpperCase().includes("CHANGENUMBER")) {
                                    console.log("MO CHANGENUMBER KA");
                                    console.log(numero); //smsMsgConverID

                                    ChangeRegisterStudentNo(smsMsgContactNo, smsMsgConverID, smsMsg);
                                } else {
                                    console.log("SPAM");
                                    var msgq1 = smsMsg;
                                    console.log(msgq1.length);
                                    if (msgq1.length > 5) {

                                    } else {
                                        console.log("spam");
                                        var msg = "Invalid Keywords. To know more about, just type KEYWORDS and send to 09639231290.)";
                                        SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                                    }
                                }

                            } //else


                            console.log("\n");
                            ihap++;
                        } //end whileloop
                    }//end if
                }//end else

            });
        });
    }

    function SaveSMSInquirytoDB(smsMsgContactNo, smsMsg, smsMsgConverID) {
        var conidno = smsMsgConverID;
        var inquirerCPno = smsMsgContactNo;
        let gsm = smsMsg;

        console.log(gsm);
        // id.substr(id.length - 10);
//console.log("msg noofcharacters: " + gsm)

        console.log(gsm.slice(0, 7));
        console.log(gsm.slice(8, gsm.length - 1));

        let part1 = gsm.slice(0, 7);
        let part2 = gsm.slice(8, gsm.length - 1);
        // console.log(gsm.length-1);
        // console.log(second);


        console.log("ihapniya: " + gsm.length)
        if (gsm.length > 7) {
            //daghang message

            //---------

            var getNewStudentInfo = new Promise(function (resolve, reject) {
                var convereIDno = "";
                var sqlquery = "SELECT * FROM conversation  WHERE conversion_id = " + conidno + "";

                connection.query(sqlquery, function (error, results) {
                    if (error) {
                        convereIDno = "";
                        console.error(error);
                        return;
                    } else {
                        let studentRows;

                        if (results.length > 0) {
                            studentRows = JSON.parse(JSON.stringify(results));

                            console.log(studentRows);

                            convereIDno = studentRows[0].conversion_id;
                            var inquaIdno = studentRows[0].inquirer_PSID;
                            var adminIDno = studentRows[0].admin_id;
                            var converseDateT = studentRows[0].date_time;
                            var inquacelNo = studentRows[0].inquirer_contactno;
                            var converseChan = studentRows[0].channel;
                            var converseMsgID = studentRows[0].messageID;
                            var converseInqStat = studentRows[0].inquirystatus;


                            var gsm = part2;
                            var outputstr = gsm.replace(/'/g, '"');

                            const encoded = encodeURI(outputstr);

                            var SaveSMSReceivedtoDB = new Promise(function (resolve, reject) {

                                var sqlw2 = "INSERT INTO unhandledqueries values('','" + inquaIdno + "'," + adminIDno + ",'" + encoded + "','" + converseDateT + "','" + inquacelNo + "', '" + converseChan + "', '" + converseMsgID + "'," + converseInqStat + ")";
                                console.log(sqlw2);

                                connection.query(sqlw2, function (error, results) {
                                    if (error) {
                                        console.error(error);
                                        return;
                                    } else {


                                        var gsmv1 = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. Your concern has been forwarded. Please wait for a reply within a day or two. Do not reply this message. Reference No. " + Date.now();
                                        var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";

                                        ////------------
                                        axios({  //?token=" + tokeings + "&device=321584"
                                            url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + inquirerCPno + "&msg=" + gsmv1,
                                            method: "post",
                                            headers: {
                                                "Content-type": "application/json"
                                            },
                                            data: {
                                                token: "730461e4a7ba7f2d64e2632b2d8c6493",
                                                phone: inquirerCPno,
                                                device: "321584",
                                                msg: gsmv1
                                            },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
                                            responseType: "json"
                                        }).then(function (response) {
                                            // console.log(response.data);

                                            var user = JSON.parse(JSON.stringify(response.data));
                                            //console.log("user[0].id= "+user[0].message_id);

                                            var k1 = user.id;

                                            console.log(k1);

                                            UpdateStatusQuery(smsMsgConverID, k1, gsm);

                                        });

                                        ////------------


                                        var queryc1 = "DELETE FROM conversation WHERE conversion_id = " + convereIDno;
                                        // res.locals = { title: 'Prospectus' };
                                        // res.render('Tables/prospectus');
                                        console.log(queryc1);
                                        connection.query(queryc1, function (err2, data2, fields2) {
                                            if (err2) throw err2;
                                        });

                                        return;
                                    }

                                    resolve(SaveSMSReceivedtoDB)
                                });

                            });


                        } else {

                            return;
                        }

                    } //end else
                });
            });

            ///--------------

            return;
        } else {

            console.log("No question");
            var msg = "You did not ask anything., To inquire about  other matters. Just text \n\n INQUIRE< space>(CONCERN) (Ex. INQUIRE How much is the tuition for BSIT?) \n send to 09639231290.)";
            SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
        }


    }


    function SendStudentSMSError(numero, msg, smsMsgConverID) {
        var studentCP = numero;
        var gsm = msg;

        // var gsm ="Hi, Welcome to NMSCST Chatbot. We're here to cater your queries. \n0. To ask for the list of keywords. Just text KEYWORDS\n 1. To inquire about  your Grades. Just text \nGRADE< space >SCHOOLYEAR< space >SEMESTER (Ex. GRADE 2018-2019 1ST) \n2. To inquire about  School Events. Just text\nEVENTS< space >(THISWEEK/THISMONTH) (Ex. EVENTS THISWEEK) \n3. To inquire about  other matters. Just text \nINQUIRE< space >(CONCERN) (Ex. INQUIRE How much is the tuition for BSIT?) \n4. To change password. Just text FORGOTPASSWORD \n5. To retrieve schoolID. Just text FORGOTSCHOOLID \n6. To changenumber, Just text CHANGENUMBER< space >SCHOOLIDID/PASSWORD/NEWNUMBER (Ex. CHANGENUMBER 0000-0001/nmsc/09123456789)\n\nThank you you for using NMSCST Chatbot. Have a great day!";

        var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";
//  var s1 = studentCP;
//var s2 = s1.substring(1);
        // var text1="+63";
        let numeroCP = studentCP; // text1.concat(s2);
        console.log(numeroCP);


        axios({  //?token=" + tokeings + "&device=321584"
            url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + numeroCP + "&msg=" + gsm,
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            data: {
                token: "730461e4a7ba7f2d64e2632b2d8c6493",
                phone: numeroCP,
                device: "321584",
                msg: gsm
            },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
            responseType: "json"
        }).then(function (response) {

            var user = JSON.parse(JSON.stringify(response.data));
            //  console.log(user);
            //console.log("user[0].id= "+user[0].message_id);

            var k1 = user.id;

            console.log(user.id);

            UpdateStatusQuery(smsMsgConverID, k1, msg);

            // console.log(response.data);

        });
    }

    function SendGradeviaSMS(smsMsgContactNo, xS12, xSy12, smsMsgConverID) {

        var id = smsMsgContactNo;
        var numero = id.substr(id.length - 10);
        var numero2 = id.substr(id.length - 11);

        var xvsemX = "";
        // var xvsyfX="";
        if (xSy12 == "1") {
            xvsemX = "First Semester";
        } else if (xSy12 == "2") {
            xvsemX = "Second Semester";
        }
        var eww1 = smsMsgConverID;
        console.log(xSy12);
        console.log(xS12);
        var getNewPass2 = new Promise(function (resolve, reject) {
            var studentCPDB = "";
            var sqlquery = "SELECT * FROM students WHERE student_contactno LIKE '%" + numero + "%'";

            connection.query(sqlquery, function (error, results) {
                if (error) {
                    studentCPDB = "";
                    console.error(error);
                    return;
                } else {
                    let studentRows;

                    if (results.length > 0) {
                        studentRows = JSON.parse(JSON.stringify(results));

                        console.log(studentRows);

                        studentCPDB = studentRows[0].student_contactno;
                        var studentIDNOa = studentRows[0].id_studschoolno;
                        var idxno = studentCPDB;
                        var numdb = idxno.substr(idxno.length - 10);

                        console.log("Number on DB: " + numdb);
                        console.log("Number on Sender: " + numero);


                        if (numdb == numero) {
                            console.log("pareha");
                            var getStudentGG = new Promise(function (resolve, reject) {
                                var studentCPDB = "";
                                var sql23 = "SELECT grades.subject_code,grades.grade  FROM grades, students where grades.id_studschoolno = students.id_studschoolno and grades.semester='" + xvsemX + "' and grades.schoolyear='" + xS12 + "' and students.id_studschoolno = '" + studentIDNOa + "'";

                                console.log(sql23);
                                connection.query(sql23, function (error2, results2) {
                                    if (error2) {
                                        studentCPDB = "";
                                        console.error(error2);
                                        return;
                                    } else {
                                        let studentRows;
                                        let xc = 0;
                                        if (results2.length > 0) {
                                            studentRows = JSON.parse(JSON.stringify(results2));
                                            //console.log(studentRows);
                                            console.log("Records: " + results2.length);
                                            var subs = [];


                                            while (xc < results2.length) {
                                                //console.log(studentRows[xc].subject_code);
                                                var c1 = studentRows[xc].subject_code + " - " + studentRows[xc].grade;
                                                subs.push(c1);
                                                xc++;
                                            }

                                            let text = subs.join("\n");
                                            let text2 = StudentName + "\nYour " + xvsemX + " Grades for the Academic Year " + xS12 + "\n\n";

                                            //studentCPDB=studentRows[0].otp;

                                            //  var msg ="Welcome to NMSCST, Your gateway to the World! Choose your query from the options below." ;

                                            var msg = text2 + text
                                            console.log(eww1);

                                            var senderID = idxno;
                                            SendGradetoStudentSMS(senderID, msg, eww1);

                                            return;
                                        } else {
                                            console.log(msg);
                                            var msg = "You don't have any grades";
                                            // var senderID = eww1;
                                            var senderID
                                            SendGradetoStudentSMS(id, msg, eww1);
                                            return;
                                        }
                                    }
                                    resolve(getStudentGG);
                                });
                            });
                        } else {

                        }


                    } else {
                        var msg = "You don't have any grades associated with this Celphone No. " + numero2;
                        var senderID = id;
                        SendGradetoStudentSMS(senderID, msg, eww1);

                        return;
                    }

                } //end else
            });
        });
    }

    function SendGradetoStudentSMS(senderID, msg, eww1) {
        var x12x1 = eww1;
        var x12x = senderID;
        var gsmn = msg;
        //var xnw ="Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. Your new password is "  + newpassword + ". Do not reply this message. Reference No. " + Date.now();

        axios({
            url: " https://api.semaphore.co/api/v4/messages",
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            data: {
                apikey: "816677ff0422ad99c4cdb32eddfc46d2",
                number: x12x,
                sendername: "NMSC",
                message: gsmn
            },
            responseType: "json"
        }).then(function (response) {
//console.log(response.data);

            var user = JSON.parse(JSON.stringify(response.data));
            // console.log(user[0].message_id);
            var k1 = user[0].message_id;
            console.log(k1);
            UpdateStatusQuery(x12x1, k1, msg);
        });
    }

    function UpdateStatusQuery(x12x1, k1, msg) {
        smsMsgConverID = x12x1;
        var SaveReplySMSReceivedtoDB = new Promise(function (resolve, reject) {
            var gsm = msg;
            var outputstr = gsm.replace(/'/g, '"');

            const encoded = encodeURI(outputstr);

            var sqlw2 = "INSERT INTO dialog values(''," + smsMsgConverID + ", '" + encoded + "','" + k1 + "','" + Date.now() + "')";
            console.log(sqlw2);
            connection.query(sqlw2, function (error, results) {
                if (error) {
                    console.error(error);
                    return;
                } else {
                    return;
                }
                resolve(SaveReplySMSReceivedtoDB)
            });

        });


        var StorePSID = new Promise(function (resolve, reject) {

            var sqlq1 = "UPDATE conversation SET inquirystatus=1 WHERE conversion_id= " + smsMsgConverID;
            console.log(sqlq1);

            connection.query(sqlq1, function (error, results) {
                if (error) {
                    console.error(error);
                    return;
                } else {
                    return;
                }
                resolve(studentPSIDNO)
            });

        });

    }

    // Inner Auth
    app.get('/pages-login', function (req, res) {
        res.locals = {title: 'Login'};
        res.render('AuthInner/pages-login');
    });
    app.get('/pages-register', function (req, res) {
        res.locals = {title: 'Register'};
        res.render('AuthInner/pages-register');
    });
    app.get('/pages-recoverpw', function (req, res) {
        res.locals = {title: 'Recover Password'};
        res.render('AuthInner/pages-recoverpw');
    });

    app.get('/setup', function (req, res) {
        setupGetStartedButton(res);

    });


    app.get('/setup2', function (req, res) {

        menuButton(res);

    });


    //uploadgrades

    app.post("/import-csv", uploadStorage.single("import-csv"), (req, res) => {
        // console.log(req.file.path);

        const fileName = req.file.path;
        console.log(fileName);
        csvtojson().fromFile(fileName).then(source => {

            // Fetching the data from each row
            // and inserting to the table "sample" id_studschoolno,subject_code,grade,instructor,semester,schoolyear
            for (var i = 0; i < source.length; i++) {
                var SchoolID = source[i]["id_studschoolno"],
                    SUBJECTCode = source[i]["subject_code"],
                    STUDGrade = source[i]["grade"],
                    SubjectInstructor = source[i]["instructor"],
                    Semester = source[i]["semester"],
                    SY = source[i]["schoolyear"]
                var insertStatement =
                    `INSERT INTO grades values(?,?, ?, ?, ?, ?, ?)`;
                var items = ['', SchoolID, SUBJECTCode, STUDGrade, SubjectInstructor, Semester, SY];

                // Inserting data of current row
                // into database
                connection.query(insertStatement, items,
                    (err, results, fields) => {
                        if (err) {
                            console.log(
                                "Unable to insert item at row ", i + 1);
                            return console.log(err);
                        }
                    });
            }
            console.log("All items stored into database successfully");
      
        });
        res.redirect('/grades');
    });
      
    
      //uploadstudents

    app.post("/import-csv3", uploadStorage.single("import-csv"), (req, res) => {
        // console.log(req.file.path);

        const fileName = req.file.path;
        console.log(fileName);
        csvtojson().fromFile(fileName).then(source => {

            // Fetching the data from each row
            // and inserting to the table "sample" id_studschoolno,subject_code,grade,instructor,semester,schoolyear
            for (var i = 0; i < source.length; i++) {
                var SchoolID = source[i]["id_studschoolno"],
                    STUDENTpass = source[i]["student_password"],
                    STUDENTfname = source[i]["student_fname"],
                    STUDENTlname = source[i]["student_lname"],
                    STUDENTpsid = source[i]["student_PSID"],
                    STUDENTdept = source[i]["student_dept"],
                    STUDENTstatus = source[i]["student_status"],
                    STUDENTcontact = source[i]["student_contactno"],
                    STUDENTcourse = source[i]["student_course"],
                    STUDENTyl = source[i]["student_yearlevel"],
                    otp = source[i]["otp"]
                var insertStatement =
                    `INSERT INTO students values(?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                var items = ['', SchoolID, STUDENTpass, STUDENTfname, STUDENTlname, STUDENTpsid, 
                 STUDENTdept, STUDENTstatus, STUDENTcontact, STUDENTcourse, STUDENTyl, otp    ];

                // Inserting data of current row
                // into database
                connection.query(insertStatement, items,
                    (err, results, fields) => {
                        if (err) {
                            console.log(
                                "Unable to insert student at row ", i + 1);
                           return console.log(err);
                        }
                    });
            }
            console.log("All students stored into database successfully");
      
        });
        res.redirect('/students');
    });
      
      
   
      
      // import-csv2
    app.post("/import-csv2", uploadStorage.single("import-csv"), (req, res) => {
        // console.log(req.file.path);

        const fileName = req.file.path;
        console.log(fileName);
    //    csvtojson().fromFile(fileName).then(source => {

            // Fetching the data from each row
            // and inserting to the table "sample" id_studschoolno,subject_code,grade,instructor,semester,schoolyear
   //         for (var i = 0; i < source.length; i++) {
    //            var SchoolID = source[i]["id_studschoolno"],
    //                SUBJECTCode = source[i]["subject_code"],
   //                 STUDGrade = source[i]["grade"],
   //                 SubjectInstructor = source[i]["instructor"],
   //                 Semester = source[i]["semester"],
   //                 SY = source[i]["schoolyear"]
    //            var insertStatement =
   //                 `INSERT INTO grades values(?,?, ?, ?, ?, ?, ?)`;
    //           var items = ['', SchoolID, SUBJECTCode, STUDGrade, SubjectInstructor, Semester, SY];

                // Inserting data of current row
                // into database
     //           connection.query(insertStatement, items,
        //            (err, results, fields) => {
       //                 if (err) {
      //                      console.log(
      //                          "Unable to insert item at row ", i + 1);
       //                     return console.log(err);
      //                  }
      //              });
      //      }
      //      console.log(
       //         "All items stored into database successfully");
      //  });

    });


    app.post("/upload", uploadStorage.single("uploadprospectus"), (req, res) => {
        // console.log(req.file.path);

        const fileName = req.file.path;
        var text = fileName;
        const myArray = text.split("/");
        var namefile = myArray[2];
        console.log(fileName);
        console.log(namefile);
        var studcourse = req.body.studentcourse;
        var studdept = req.body.studentdeptname;
        console.log("Dept " + studdept);
        console.log("Course " + studcourse);
        var StoreOTP = new Promise(function (resolve, reject) {
            var studentCPOTP = "";
            var sqlw2 = "INSERT INTO prospectus values('','" + studdept + "','" + studcourse + "','" + fileName + "','" + namefile + "')";
            console.log(sqlw2);

            connection.query(sqlw2, function (error, results) {
                if (error) {
                    console.error(error);
                    return;
                } else {
                    return;
                }

                resolve(studentCPOTP)
            });

        });


        res.redirect('/prospectus');
        //return res.send("Single file")
    })


    // Verify Webhook URL
    app.get('/webhook/', function (req, res) {
        console.log('Webhook verification step.')
        if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
            res.status(200).send(req.query['hub.challenge']);
        } else {
            console.error("Authentication Failed!.");
            res.sendStatus(403);
        }
    })

    app.post("/webhook", (req, res) => {
        let body = req.body;


        console.log(`\u{1F7EA} Received webhook:`);
        //  console.dir(body, { depth: null });

        // Check if this is an event from a page subscription
        if (body.object === "page") {

            // Returns a '200 OK' response to all requests


            // Iterate over each entry - there may be multiple if batched
            body.entry.forEach(async function (entry) {

                var pageID = entry.id;
                var timeOfEvent = entry.time;


                entry.messaging.forEach(function (event) {


                    //console.log(event.message);
                    if (event.message) {
                        let sender_psid = event.sender.id;
                        console.log('Sender PSID: ' + sender_psid);

                        receivedMessage(event);

                        console.log("Got a read event");
                        //console.log(event);
                    } else {

                        if (event.postback) {
                            //console.log(event);
                            receivedPostback(event);
                            console.log("Got a Postback event");
                        }

                    }
                });
            });

            // You should return a 200 status code to Facebook

            res.status(200).send("EVENT_RECEIVED");


        } else {
            // Return a '404 Not Found' if event is not from a page subscription
            res.sendStatus(404);
        }
    });

    function receivedMessage(event) {
        // console.log(event);
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfMessage = event.timestamp;
        var message = event.message;

        var messageId = message.mid;

        var messageText = message.text;
        var messageAttachments = message.attachments;

        if (messageText) {

            // If we receive a text message, check to see if it matches a keyword
            // and send back the example. Otherwise, just echo the text we received.
            switch (messageText) {
                //case 'help' :
                // var msg = "So you need my help ? ";
                // handleMessage(senderID, msg);
                // break;

                default :


                    checkTexthandleMessage(senderID, messageText);

                    //
                    break;
            }
        }
    }

    function checkTexthandleMessage(senderID, text) {
        if (text.includes("ID")) {
            let studentCP;
            let arr = text.split('/');
            let string2 = arr[0];


            let arr2 = string2.split(' ');

            //  console.log("studidno:" + arr2[1]);
            //  console.log("Password:" + arr[1]);

            var studschoolidno = arr2[1];
            var studuserpass = arr[1];
            //console.log(senderID);

//----  


            var getSlaveURL = new Promise(function (resolve, reject) {
                var studentCP = "";
                var studentPSID = "";
                var sqlquery2 = "SELECT * FROM students WHERE id_studschoolno = '" + studschoolidno + "' AND student_password='" + studuserpass + "'";

                //    console.log(sqlquery2);
                pool.query(sqlquery2, function (error, results) {
                    if (error) {
                        studentCP = "";
                        console.error(error);
                        return;
                    } else {
                        let usersRows;

                        if (results.length > 0) {
                            usersRows = JSON.parse(JSON.stringify(results));
                            studentPSID = usersRows[0].student_PSID
                            studentCP = usersRows[0].student_contactno;

                            if (studentPSID == "") {

                                // console.log("dili registered sa fb");

                                RegisterStudentFB(studschoolidno, senderID, studentCP);

                                var msg = "Please input the OTP that has been sent to your registered mobile number. Kindly follow this format \"code ######\"";
                                handleMessage(senderID, msg);
                            } else {
                                //registered na sa fb
                                // console.log(studentPSID );
                                SendStudentOTP2(studentCP, senderID);

                                var msg = "Please input the OTP that has been sent to your registered mobile number. Kindly follow this format \"code ######\"";
                                handleMessage(senderID, msg);
                            }
                            //
                            //console.log("in function result: " + studentCP);
                            return;
                        } else {
                            var msg = "Wrong Student ID NO / Password!";
                            handleMessage(senderID, msg);

                            // console.log("wala dili register");
                            return;
                        }

                    }
                    resolve(studentCP);
                });


            });


        } else if (text.includes("code")) {

            let arr = text.split(' ');

            let string2 = arr[1];


            // console.log(otpcode);

            var otpcode = string2;


            var getStudentOTP = new Promise(function (resolve, reject) {
                var studentCPDB = "";
                var sqlquery = "SELECT * FROM students WHERE otp=" + otpcode + " AND student_PSID=" + senderID;

                connection.query(sqlquery, function (error, results) {
                    if (error) {
                        studentCPDB = "";
                        console.error(error);
                        return;
                    } else {
                        let studentRows;

                        if (results.length > 0) {
                            studentRows = JSON.parse(JSON.stringify(results));
                            studentCPDB = studentRows[0].otp;

                            var msg = "Welcome to NMSCST, Your gateway to the World! Choose your query from the options below.";

                            handleMessageCHOOSEmeStudent(senderID, msg);
                            //SendStudentOTP2(studentCPDB,senderID);
                            console.log("in function result: " + studentCPDB);
                            return;
                        } else {

                            console.log("dli pareho ug dili registered");

                        }

                    }
                    resolve(studentCPDB);
                });
            });

        } else {
            var msg2 = "I'm not sure I can understand you !\n Please Select The Menu";
            //console.log(senderID);
            handleMessageUnknownQuery(senderID, msg2);
        }
    }

    function generateP() {
        var pass = '';
        var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789';

        for (let i = 1; i <= 4; i++) {
            var char = Math.floor(Math.random() * str.length + 1);
            pass += str.charAt(char)
        }
        return pass;
    }


    function SendNewPassword(senderID) {
        var newpassword = generateP();


        var getNewPass = new Promise(function (resolve, reject) {
            var studentCPDB = "";
            var sqlquery = "SELECT * FROM students WHERE student_PSID=" + senderID;

            connection.query(sqlquery, function (error, results) {
                if (error) {
                    studentCPDB = "";
                    console.error(error);
                    return;
                } else {
                    let studentRows;

                    if (results.length > 0) {
                        studentRows = JSON.parse(JSON.stringify(results));
                        studentCPDB = studentRows[0].student_contactno;


                        //var xnw= "Your New Password is " + newpassword;

                        var xnw = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. Your new password is " + newpassword + ". Do not reply this message. Reference No. " + Date.now();

                        axios({
                            url: " https://api.semaphore.co/api/v4/messages",
                            method: "post",
                            headers: {
                                "Content-type": "application/json"
                            },
                            data: {
                                apikey: "816677ff0422ad99c4cdb32eddfc46d2",
                                number: studentCPDB,
                                sendername: "NMSC",
                                message: xnw
                            },
                            responseType: "json"
                        }).then(function (response) {

                            //StudentRows= JSON.parse(JSON.stringify(response.data));
                            //studentOTP=StudentRows[0].code;

                            //console.log(response.data);


                            UpdatePassword(newpassword, senderID);


                        });


                        return;
                    } else {
                        return;


                    }

                }
                resolve(studentCPDB)
            });
        });


    }

    function wordCount(text = '') {
        return text.split(/\S+/).length - 1;
    };

    function EventSMS(smsMsgContactNo, smsMsgConverID, smsMsg) {
        console.log(smsMsg);


        let smsgsm = smsMsg;
        //console.log(wordCount(smsgsm));

        if (wordCount(smsgsm) > 1) {
            let arr = smsgsm.split(' ');
            let string1 = arr[0];
            console.log(string1);

            let string2 = arr[1];

            if (string2 == "THISWEEK") {

                var getNewStudentInfo = new Promise(function (resolve, reject) {
                    var studentCPDB = "";
                    var sqlquery = "SELECT Count(events_id) as ihap FROM events where (YEARWEEK(NOW())=YEARWEEK(eventdate))";

                    connection.query(sqlquery, function (error, results) {
                        if (error) {
                            studentCPDB = "";
                            console.error(error);
                            return;
                        } else {
                            let studentRows;

                            if (results.length > 0) {
                                studentRows = JSON.parse(JSON.stringify(results));

                               // console.log(studentRows);

                                pilajud = studentRows[0].ihap;
                                console.log(pilajud);

                                if (pilajud == 1) {

                                    var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. We have only " + doConvert(pilajud) + " (" + pilajud + ") activity for this week.\n";

                                    var getEventTitle = new Promise(function (resolve, reject) {
                                        var SchoolEventTitle = "";
                                        var sqlquery21 = "SELECT events_id,venue,title, description, date_format(eventdate, '%M %e, %Y') as b1, date_format(eventtime, '%l:%i %p') as b2, adminID, YEARWEEK(NOW()) as KaronnaWeek,YEARWEEK(eventdate) as DBWeek  FROM events where (YEARWEEK(NOW())=YEARWEEK(eventdate))";

                                        connection.query(sqlquery21, function (error21, results21) {
                                            if (error21) {
                                                SchoolEventTitle = "";
                                                console.error(error21);
                                                return;
                                            } else {
                                                let studentRows21;

                                                if (results21.length > 0) {
                                                    studentRows21 = JSON.parse(JSON.stringify(results21));
                                                    var EventIDx = studentRows21[0].events_id;

                                                    var xc = 0;

                                                    var subs = [];


                                                    while (xc < results21.length) {

                                                        var c1 = "WHAT: " + studentRows21[xc].title + "\nWHEN: " + studentRows21[xc].b1 + " @ " + studentRows21[xc].b2 + "\nWHERE: " + studentRows21[xc].venue + "\nWHO: " + studentRows21[xc].description + "\n";
                                                        subs.push(c1);
                                                        xc++;
                                                    }
                                                    let text21 = subs.join("\n");

                                                    var msg2 = msg + text21;
                                                    // var msg = "Welcome to NMSCST, Your gateway to the World! Choose your query from the options below.";

                                                    console.log(msg);

                                                    console.log(msg2);


                                                    var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";


                                                    axios({  //?token=" + tokeings + "&device=321584"
                                                        url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + smsMsgContactNo + "&msg=" + msg2,
                                                        method: "post",
                                                        headers: {
                                                            "Content-type": "application/json"
                                                        },
                                                        data: {
                                                            token: "730461e4a7ba7f2d64e2632b2d8c6493",
                                                            phone: smsMsgContactNo,
                                                            device: "321584",
                                                            msg: msg2
                                                        },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
                                                        responseType: "json"
                                                    }).then(function (responsex1) {

                                                        var user = JSON.parse(JSON.stringify(responsex1.data));
                                                        //  console.log(user);
                                                        //console.log("user[0].id= "+user[0].message_id);

                                                        var k1 = user.id;

                                                        console.log(user.id);

                                                        UpdateStatusQuery(smsMsgConverID, k1, msg2);

                                                        // console.log(response.data);
                                                        return;
                                                    });

                                                    ///--------------
                                                    //EventhandleMessage(senderID, msg2);
                                                    return;
                                                } else {


                                                }

                                            }
                                            resolve(SchoolEventTitle);
                                        });
                                    });


                                } else {
                                    var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. We have  " + doConvert(pilajud) + " (" + pilajud + ") activities for this week.\n";

                                    var getEventTitle = new Promise(function (resolve, reject) {
                                        var SchoolEventTitle = "";
                                        var sqlquery21 = "SELECT events_id,venue,title, description, date_format(eventdate, '%M %e, %Y') as b1, date_format(eventtime, '%l:%i %p') as b2, adminID, YEARWEEK(NOW()) as KaronnaWeek,YEARWEEK(eventdate) as DBWeek  FROM events where (YEARWEEK(NOW())=YEARWEEK(eventdate))";

                                        connection.query(sqlquery21, function (error21, results21) {
                                            if (error21) {
                                                SchoolEventTitle = "";
                                                console.error(error21);
                                                return;
                                            } else {
                                                let studentRows21;

                                                if (results21.length > 0) {
                                                    studentRows21 = JSON.parse(JSON.stringify(results21));
                                                    var EventIDx = studentRows21[0].events_id;

                                                    var xc = 0;

                                                    var subs = [];


                                                    while (xc < results21.length) {

                                                        var c1 = "WHAT: " + studentRows21[xc].title + "\nWHEN: " + studentRows21[xc].b1 + " @ " + studentRows21[xc].b2 + "\nWHERE: " + studentRows21[xc].venue + "\nWHO: " + studentRows21[xc].description + "\n";
                                                        subs.push(c1);
                                                        xc++;
                                                    }
                                                    let text21 = subs.join("\n");

                                                    var msg2 = msg + text21;
                                                    // var msg = "Welcome to NMSCST, Your gateway to the World! Choose your query from the options below.";

                                                    console.log(msg);

                                                    console.log(msg2);


                                                    var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";


                                                    axios({  //?token=" + tokeings + "&device=321584"
                                                        url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + smsMsgContactNo + "&msg=" + msg2,
                                                        method: "post",
                                                        headers: {
                                                            "Content-type": "application/json"
                                                        },
                                                        data: {
                                                            token: "730461e4a7ba7f2d64e2632b2d8c6493",
                                                            phone: smsMsgContactNo,
                                                            device: "321584",
                                                            msg: msg2
                                                        },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
                                                        responseType: "json"
                                                    }).then(function (responsex1) {

                                                        var user = JSON.parse(JSON.stringify(responsex1.data));
                                                        //  console.log(user);
                                                        //console.log("user[0].id= "+user[0].message_id);

                                                        var k1 = user.id;

                                                        console.log(user.id);

                                                        UpdateStatusQuery(smsMsgConverID, k1, msg2);

                                                        // console.log(response.data);
                                                        return;
                                                    });

                                                    ///--------------
                                                    //EventhandleMessage(senderID, msg2);
                                                    return;
                                                } else {


                                                }

                                            }
                                            resolve(SchoolEventTitle);
                                        });
                                    });


                                }


                            } else {


                            }
                            if (pilajud != 0) {
                            } else {
                                var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. We have no activities for this week.\n";

                                SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                            }


                            return;
                        } //end else
                    });
                });


            } else if (string2 == "THISMONTH") {

                var getNewStudentInfo = new Promise(function (resolve, reject) {
                    var studentCPDB = "";
                    var sqlquery = "SELECT Count(events_id) as ihap FROM events where (MONTH(NOW())=MONTH(eventdate))";

                    connection.query(sqlquery, function (error, results) {
                        if (error) {
                            studentCPDB = "";
                            console.error(error);
                            return;
                        } else {
                            let studentRows;

                            if (results.length > 0) {
                                studentRows = JSON.parse(JSON.stringify(results));

                                // console.log(studentRows);

                                pilajud = studentRows[0].ihap;
                                console.log(pilajud);

                                if (pilajud == 1) {

                                    var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. We have only " + doConvert(pilajud) + " (" + pilajud + ") activity for this month.\n";

                                    var getEventTitle = new Promise(function (resolve, reject) {
                                        var SchoolEventTitle = "";
                                        var sqlquery21 = "SELECT events_id,venue,title, description, date_format(eventdate, '%M %e, %Y') as b1, date_format(eventtime, '%l:%i %p') as b2, adminID, MONTHNAME(NOW()) as KaronnaMonth,MONTH(eventdate) as DBWeek  FROM events where (MONTH(NOW())=MONTH(eventdate))";

                                        connection.query(sqlquery21, function (error21, results21) {
                                            if (error21) {
                                                SchoolEventTitle = "";
                                                console.error(error21);
                                                return;
                                            } else {
                                                let studentRows21;

                                                if (results21.length > 0) {
                                                    studentRows21 = JSON.parse(JSON.stringify(results21));
                                                    var EventIDx = studentRows21[0].events_id;

                                                    var xc = 0;

                                                    var subs = [];


                                                    while (xc < results21.length) {

                                                        var c1 = "WHAT: " + studentRows21[xc].title + "\nWHEN: " + studentRows21[xc].b1 + " @ " + studentRows21[xc].b2 + "\nWHERE: " + studentRows21[xc].venue + "\nWHO: " + studentRows21[xc].description + "\n";
                                                        subs.push(c1);
                                                        xc++;
                                                    }
                                                    let text21 = subs.join("\n");

                                                    var msg2 = studentRows21[0].KaronnaMonth + " Activity\n\n" + msg +  text21;
                                                    // var msg = "Welcome to NMSCST, Your gateway to the World! Choose your query from the options below.";

                                                    console.log(msg);

                                                    console.log(msg2);


                                                    var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";


                                                    axios({  //?token=" + tokeings + "&device=321584"
                                                        url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + smsMsgContactNo + "&msg=" + msg2,
                                                        method: "post",
                                                        headers: {
                                                            "Content-type": "application/json"
                                                        },
                                                        data: {
                                                            token: "730461e4a7ba7f2d64e2632b2d8c6493",
                                                            phone: smsMsgContactNo,
                                                            device: "321584",
                                                            msg: msg2
                                                        },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
                                                        responseType: "json"
                                                    }).then(function (responsex1) {

                                                        var user = JSON.parse(JSON.stringify(responsex1.data));
                                                        //  console.log(user);
                                                        //console.log("user[0].id= "+user[0].message_id);

                                                        var k1 = user.id;

                                                        console.log(user.id);

                                                        UpdateStatusQuery(smsMsgConverID, k1, msg2);

                                                        // console.log(response.data);
                                                        return;
                                                    });

                                                    ///--------------
                                                    //EventhandleMessage(senderID, msg2);
                                                    return;
                                                } else {


                                                }

                                            }
                                            resolve(SchoolEventTitle);
                                        });
                                    });


                                } else {
                                    var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. We have  " + doConvert(pilajud) + " (" + pilajud + ") activities for this week.\n";

                                    var getEventTitle = new Promise(function (resolve, reject) {
                                        var SchoolEventTitle = "";
                                        var sqlquery21 = "SELECT events_id,venue,title, description, date_format(eventdate, '%M %e, %Y') as b1, date_format(eventtime, '%l:%i %p') as b2, adminID, MONTHNAME(NOW()) as KaronnaMonth,MONTH(eventdate) as DBWeek  FROM events where (MONTH(NOW())=MONTH(eventdate))";

                                        connection.query(sqlquery21, function (error21, results21) {
                                            if (error21) {
                                                SchoolEventTitle = "";
                                                console.error(error21);
                                                return;
                                            } else {
                                                let studentRows21;

                                                if (results21.length > 0) {
                                                    studentRows21 = JSON.parse(JSON.stringify(results21));
                                                    var EventIDx = studentRows21[0].events_id;

                                                    var xc = 0;

                                                    var subs = [];


                                                    while (xc < results21.length) {

                                                        var c1 = "WHAT: " + studentRows21[xc].title + "\nWHEN: " + studentRows21[xc].b1 + " @ " + studentRows21[xc].b2 + "\nWHERE: " + studentRows21[xc].venue + "\nWHO: " + studentRows21[xc].description + "\n";
                                                        subs.push(c1);
                                                        xc++;
                                                    }
                                                    let text21 = subs.join("\n");

                                                    var msg2 = studentRows21[0].KaronnaMonth + " Activities\n\n" + msg +  text21;
                                                    // var msg = "Welcome to NMSCST, Your gateway to the World! Choose your query from the options below.";

                                                    console.log(msg);

                                                    console.log(msg2);


                                                    var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";


                                                    axios({  //?token=" + tokeings + "&device=321584"
                                                        url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + smsMsgContactNo + "&msg=" + msg2,
                                                        method: "post",
                                                        headers: {
                                                            "Content-type": "application/json"
                                                        },
                                                        data: {
                                                            token: "730461e4a7ba7f2d64e2632b2d8c6493",
                                                            phone: smsMsgContactNo,
                                                            device: "321584",
                                                            msg: msg2
                                                        },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
                                                        responseType: "json"
                                                    }).then(function (responsex1) {

                                                        var user = JSON.parse(JSON.stringify(responsex1.data));
                                                        //  console.log(user);
                                                        //console.log("user[0].id= "+user[0].message_id);

                                                        var k1 = user.id;

                                                        console.log(user.id);

                                                        UpdateStatusQuery(smsMsgConverID, k1, msg2);

                                                        // console.log(response.data);
                                                        return;
                                                    });

                                                    ///--------------
                                                    //EventhandleMessage(senderID, msg2);
                                                    return;
                                                } else {


                                                }

                                            }
                                            resolve(SchoolEventTitle);
                                        });
                                    });


                                }


                            } else {


                            }
                            if (pilajud != 0) {
                            } else {
                                var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. We have no activities for this week.\n";

                                SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                            }


                            return;
                        } //end else
                    });
                });


            }else{
                console.log("Wrong keyword");
                var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. WRONG KEYWORD. To inquire about  School Events. Just text EVENTS<space>(THISWEEK/THISMONTH) (Ex. EVENTS THISWEEK) Reference No. " + Date.now();
                SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                return;
            }

            // console.log(StudentIdno.charAt(4));


            var id = smsMsgContactNo;
            var numero = id.substr(id.length - 10);


            console.log(numero);
            console.log(smsMsgConverID);


            return;
        } else {
            console.log("Wrong keyword");
            var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. WRONG KEYWORD. To inquire about  School Events. Just text EVENTS<space>(THISWEEK/THISMONTH) (Ex. EVENTS THISWEEK) Reference No. " + Date.now();
            SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
            return;
        }


    }

    function ChangeRegisterStudentNo(smsMsgContactNo, smsMsgConverID, smsMsg) {
        console.log(smsMsg);


        let smsgsm = smsMsg;
        //console.log(wordCount(smsgsm));

        if (wordCount(smsgsm) > 1) {
            let arr = smsgsm.split(' ');
            let string1 = arr[0];
            //console.log(string1);

            let string2 = arr[1];
            let arr2 = string2.split('/');

            var StudentIdno = arr2[0];
            var StudentPasswd = arr2[1];
            var StudentNewContactNo = arr2[2];

            console.log(StudentIdno.charAt(4));


            var id = smsMsgContactNo;
            var numero = id.substr(id.length - 10);

            let c1x1 = string2.split('/').length;

            if (c1x1 == 3) {
                //correct number of keywords (id/pass/newno)
                // console.log("correct number of keywords (id/pass/newno)");
                //---
                if (StudentIdno.charAt(4) == "-") {
                    //correct format id-no
                    //console.log("correct format id-no");
                    var filteredStudentCPNo = StudentNewContactNo.trim();
                    console.log(filteredStudentCPNo.length);
                    if (filteredStudentCPNo.length == 11) {
                        //correct format celno
                        console.log("correct format celno");

                        //pwede

                        //---------------
                        if (string1 == "CHANGENUMBER") {
                            if (StudentIdno != "") {
                                if (StudentPasswd != "") {
                                    if (StudentNewContactNo != "") {
                                        console.log("Complete- Pwede");


                                        //----
                                        var getstudentCpNo = new Promise(function (resolve, reject) {
                                            var studentCPDB = "";
                                            var sqlquery = "SELECT * FROM students WHERE id_studschoolno = '" + StudentIdno + "'";

                                            connection.query(sqlquery, function (error, results) {
                                                if (error) {
                                                    studentCPDB = "";
                                                    console.error(error);
                                                    return;
                                                } else {
                                                    let studentRows;

                                                    if (results.length > 0) {
                                                        studentRows = JSON.parse(JSON.stringify(results));

                                                        console.log(studentRows);

                                                        studentCPDB = studentRows[0].student_contactno;
                                                        var studentIDNOa = studentRows[0].id_studschoolno;
                                                        var idxno = studentCPDB;
                                                        var numdb = idxno.substr(idxno.length - 10);

                                                        var ssidno = studentRows[0].student_id;
                                                        studentpass = studentRows[0].student_password;
                                                        console.log("Number on DB: " + numdb);
                                                        console.log("Number on Sender: " + numero);

                                                        console.log("ID on on DB: " + studentIDNOa);
                                                        console.log("Password on DB: " + studentpass);

                                                        console.log("student id no is  registered");


                                                        //---updating student  info with new number
                                                        var UpdateStudentCPno = new Promise(function (resolve, reject) {
                                                            var studentNewConNx = StudentNewContactNo;

                                                            var sql12 = "UPDATE students SET student_contactno='" + studentNewConNx + "' WHERE student_id= " + ssidno;
                                                            console.log(sql12);
                                                            connection.query(sql12, function (error2, results2) {
                                                                if (error2) {
                                                                    console.error(error2);
                                                                    return;
                                                                } else {


                                                                    //console.log(results.affectedRows + " record(s) updated");
                                                                    console.log("New Student CPNo is: " + studentNewConNx);


                                                                    // var gsm ="Hi, Welcome to NMSCST Chatbot. We're here to cater your queries. \n0. To ask for the list of keywords. Just text KEYWORDS\n 1. To inquire about  your Grades. Just text \nGRADE< space >SCHOOLYEAR< space >SEMESTER (Ex. GRADE 2018-2019 1ST) \n2. To inquire about  School Events. Just text\nEVENTS< space >(THISWEEK/THISMONTH) (Ex. EVENTS THISWEEK) \n3. To inquire about  other matters. Just text \nINQUIRE< space >(CONCERN) (Ex. INQUIRE How much is the tuition for BSIT?) \n4. To change password. Just text FORGOTPASSWORD \n5. To retrieve schoolID. Just text FORGOTSCHOOLID \n6. To changenumber, Just text CHANGENUMBER< space >1111-1111/PASSWORD/NEWNUMBER \n\nThank you you for using NMSCST Chatbot. Have a great day!";

                                                                    var gsm1 = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. Your  NMSCST New Contact No.  " + studentNewConNx + " has been registered successfully. Do not reply this message. Reference No. " + Date.now();


                                                                    var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";


                                                                    axios({  //?token=" + tokeings + "&device=321584"
                                                                        url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + smsMsgContactNo + "&msg=" + gsm1,
                                                                        method: "post",
                                                                        headers: {
                                                                            "Content-type": "application/json"
                                                                        },
                                                                        data: {
                                                                            token: "730461e4a7ba7f2d64e2632b2d8c6493",
                                                                            phone: smsMsgContactNo,
                                                                            device: "321584",
                                                                            msg: gsm1
                                                                        },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
                                                                        responseType: "json"
                                                                    }).then(function (responsex1) {

                                                                        var user = JSON.parse(JSON.stringify(responsex1.data));
                                                                        //  console.log(user);
                                                                        //console.log("user[0].id= "+user[0].message_id);

                                                                        var k1 = user.id;

                                                                        console.log(user.id);

                                                                        UpdateStatusQuery(smsMsgConverID, k1, gsm1);

                                                                        // console.log(response.data);
                                                                        return;
                                                                    });


                                                                }

                                                                resolve(UpdateStudentCPno);
                                                            });

                                                        });
                                                        ///---------------updating student  info with new number

                                                    } else {
                                                        //no such idnonumber
                                                        console.log("student id no is NOT registered");
                                                        var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. The School ID No# " + StudentIdno + ", is NOT REGISTERED. Reference No. " + Date.now();
                                                        SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                                                        return;
                                                    }


                                                } //end else

                                            });

                                        });

                                        //-----
                                    } else {
                                        console.log("walay contactnumber");
                                        var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. You DID NOT input your contact no. Reference No. " + Date.now();
                                        SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                                        return;
                                    }


                                } else {
                                    console.log("walay password gihatag");
                                    var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. You DID NOT input your password. Reference No. " + Date.now();
                                    SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                                    return;
                                }

                            } else {
                                console.log("walay sulod ID number");
                                var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. You DID NOT input your School ID No. Reference No. " + Date.now();
                                SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                                return;
                            }

                        } else {
                            console.log("Wrong keyword");
                            var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. WRONG KEYWORD. Example(CHANGENUMBER< space >1111-1111/PASSWORD/NEWNUMBER) Reference No. " + Date.now();
                            SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                            return;
                        }
                        //---------------

                    } else {
                        console.log("wrong format celno dapat 11 numbers");
                        var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. CelNo should be 11 numbers (Ex.09121122334). Example(CHANGENUMBER< space >1111-1111/PASSWORD/NEWNUMBER) Reference No. " + Date.now();
                        SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                        return;
                    }

                } else {
                    //correct wrong format id-no
                    console.log("correct wrong format id-no");
                    var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. Invalid School ID No. Example(CHANGENUMBER< space >1111-1111/PASSWORD/NEWNUMBER) Reference No. " + Date.now();
                    SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                    return;
                }

                //-----
            } else if (c1x1 == 2) {
                //2 keywords only(id/pass)

                if (StudentIdno.charAt(4) == "-") {
                    //correct format id-no
                    // console.log("correct format id-no");
                    console.log("2 keywords only(id/pass)");
                    var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. WRONG KEYWORD. Example(CHANGENUMBER< space >1111-1111/PASSWORD/NEWNUMBER) Reference No. " + Date.now();
                    SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                    return;

                } else {
                    //correct wrong format id-no
                    // console.log("correct wrong format id-no");
                    console.log("2 keywords only(id/pass)");
                    var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. WRONG KEYWORD. Example(CHANGENUMBER< space >1111-1111/PASSWORD/NEWNUMBER) Reference No. " + Date.now();
                    SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                    return;
                }
            } else {
                //wrong keywords
                console.log("wrong keywords");
                var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. WRONG KEYWORD. Example(CHANGENUMBER< space >1111-1111/PASSWORD/NEWNUMBER) Reference No. " + Date.now();
                SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
                return;
            }


            console.log(numero);
            console.log(smsMsgConverID);


            return;
        } else {
            console.log("Wrong keyword");
            var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. WRONG KEYWORD. Example(CHANGENUMBER< space >1111-1111/PASSWORD/NEWNUMBER) Reference No. " + Date.now();
            SendStudentSMSError(smsMsgContactNo, msg, smsMsgConverID);
            return;
        }


    }

    function SendStudentIDNoSMS(smsMsgContactNo, smsMsgConverID) {

        var id = smsMsgContactNo;
        var numero = id.substr(id.length - 10);

        console.log(numero);
        console.log(smsMsgConverID);

        // var newpassword =generateP();
        var studentCPDB = "";

        //----
        var getstudentCpNo = new Promise(function (resolve, reject) {
            var studentCPDB = "";
            var sqlquery = "SELECT * FROM students WHERE student_contactno LIKE '%" + numero + "%'";

            connection.query(sqlquery, function (error, results) {
                if (error) {
                    studentCPDB = "";
                    console.error(error);
                    return;
                } else {
                    let studentRows;

                    if (results.length > 0) {
                        studentRows = JSON.parse(JSON.stringify(results));

                        console.log(studentRows);

                        studentCPDB = studentRows[0].student_contactno;
                        var studentIDNOa = studentRows[0].id_studschoolno;
                        var idxno = studentCPDB;
                        var numdb = idxno.substr(idxno.length - 10);

                        studentFIDNO = studentRows[0].id_studschoolno;
                        console.log("Number on DB: " + numdb);
                        console.log("Number on Sender: " + numero);


                        if (numdb == numero) {
                            console.log("cp  registered");

                            var studentCP = numero;


                            // var gsm ="Hi, Welcome to NMSCST Chatbot. We're here to cater your queries. \n0. To ask for the list of keywords. Just text KEYWORDS\n 1. To inquire about  your Grades. Just text \nGRADE< space >SCHOOLYEAR< space >SEMESTER (Ex. GRADE 2018-2019 1ST) \n2. To inquire about  School Events. Just text\nEVENTS< space >(THISWEEK/THISMONTH) (Ex. EVENTS THISWEEK) \n3. To inquire about  other matters. Just text \nINQUIRE< space >(CONCERN) (Ex. INQUIRE How much is the tuition for BSIT?) \n4. To change password. Just text FORGOTPASSWORD \n5. To retrieve schoolID. Just text FORGOTSCHOOLID \n6. To changenumber, Just text CHANGENUMBER< space >1111-1111/PASSWORD/NEWNUMBER \n\nThank you you for using NMSCST Chatbot. Have a great day!";

                            var gsm = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. Your  NMSCST School ID Number is " + studentFIDNO + ". Do not reply this message. Reference No. " + Date.now();


                            var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";

                            // var text1="+63";
                            let numeroCP = studentCPDB; // text1.concat(s2);
                            console.log(numeroCP);


                            axios({  //?token=" + tokeings + "&device=321584"
                                url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + numeroCP + "&msg=" + gsm,
                                method: "post",
                                headers: {
                                    "Content-type": "application/json"
                                },
                                data: {
                                    token: "730461e4a7ba7f2d64e2632b2d8c6493",
                                    phone: numeroCP,
                                    device: "321584",
                                    msg: gsm
                                },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
                                responseType: "json"
                            }).then(function (response) {

                                var user = JSON.parse(JSON.stringify(response.data));
                                //  console.log(user);
                                //console.log("user[0].id= "+user[0].message_id);

                                var k1 = user.id;

                                console.log(user.id);

                                UpdateStatusQuery(smsMsgConverID, k1, gsm);

                                // console.log(response.data);

                            });

                        } else {
                            // console.log("cp not registered");


                        }


                    } else {
                        var gsm = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. You request is denied. Your  Celphone No. " + numero + " is NOT Registered. Do not reply this message. Reference No. " + Date.now();
                        var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";

                        console.log(id);

                        axios({  //?token=" + tokeings + "&device=321584"
                            url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + id + "&msg=" + gsm,
                            method: "post",
                            headers: {
                                "Content-type": "application/json"
                            },
                            data: {
                                token: "730461e4a7ba7f2d64e2632b2d8c6493",
                                phone: id,
                                device: "321584",
                                msg: gsm
                            },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
                            responseType: "json"
                        }).then(function (response) {

                            var user = JSON.parse(JSON.stringify(response.data));
                            //  console.log(user);
                            //console.log("user[0].id= "+user[0].message_id);

                            var k1 = user.id;

                            console.log(user.id);

                            UpdateStatusQuery(smsMsgConverID, k1, gsm);

                            // console.log(response.data);

                        });

                        return;
                    }

                } //end else

            });

        });

        //-----
    }

    function SendStudentNewPasswordSMS(smsMsgContactNo, smsMsgConverID) {

        var id = smsMsgContactNo;
        var numero = id.substr(id.length - 10);

        console.log(numero);
        console.log(smsMsgConverID);

        var newpassword = generateP();

        var studentCPDB = "";

        //----
        var getstudentCpNo = new Promise(function (resolve, reject) {
            var studentCPDB = "";
            var sqlquery = "SELECT * FROM students WHERE student_contactno LIKE '%" + numero + "%'";

            connection.query(sqlquery, function (error, results) {
                if (error) {
                    studentCPDB = "";
                    console.error(error);
                    return;
                } else {
                    let studentRows;

                    if (results.length > 0) {
                        studentRows = JSON.parse(JSON.stringify(results));

                        console.log(studentRows);

                        studentCPDB = studentRows[0].student_contactno;
                        var studentIDNOa = studentRows[0].id_studschoolno;
                        var studentID = studentRows[0].student_id;

                        var idxno = studentCPDB;
                        var numdb = idxno.substr(idxno.length - 10);

                        studentFIDNO = studentRows[0].id_studschoolno;
                        console.log("Number on DB: " + numdb);
                        console.log("Number on Sender: " + numero);


                        if (numdb == numero) {
                            console.log("cp  registered");

                            //---update new password
                            var UpdatePasswd = new Promise(function (resolve, reject) {
                                var studentNewPassword = newpassword;

                                var sql12 = "UPDATE students SET student_password='" + studentNewPassword + "' WHERE student_id= " + studentID;
                                console.log(sql12);
                                connection.query(sql12, function (error, results) {
                                    if (error) {
                                        console.error(error);
                                        return;
                                    } else {


                                        //console.log(results.affectedRows + " record(s) updated");
                                        console.log("New Pass is: " + studentNewPassword);
                                        return;
                                    }

                                    resolve(UpdatePasswd);
                                });

                            });

                            //--sending new password

                            var gsm = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. Your new password is " + newpassword + ". Do not reply this message. Reference No. " + Date.now();
                            var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";

                            console.log(id);

                            axios({  //?token=" + tokeings + "&device=321584"
                                url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + id + "&msg=" + gsm,
                                method: "post",
                                headers: {
                                    "Content-type": "application/json"
                                },
                                data: {
                                    token: "730461e4a7ba7f2d64e2632b2d8c6493",
                                    phone: id,
                                    device: "321584",
                                    msg: gsm
                                },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
                                responseType: "json"
                            }).then(function (response) {

                                var user = JSON.parse(JSON.stringify(response.data));
                                //  console.log(user);
                                //console.log("user[0].id= "+user[0].message_id);

                                var k1 = user.id;

                                //  console.log(user.id);

                                UpdateStatusQuery(smsMsgConverID, k1, gsm);

                                // console.log(response.data);

                            });

                            //---end sending new password

                        } else {
                            // console.log("cp not registered");


                        }


                    } else {
                        console.log("cp not registered");

                        var gsm = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. You cannot change pass because your  Celphone No. 0" + numero + " is NOT Registered. Do not reply this message. Reference No. " + Date.now();
                        var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";

                        console.log(id);

                        axios({  //?token=" + tokeings + "&device=321584"
                            url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + id + "&msg=" + gsm,
                            method: "post",
                            headers: {
                                "Content-type": "application/json"
                            },
                            data: {
                                token: "730461e4a7ba7f2d64e2632b2d8c6493",
                                phone: id,
                                device: "321584",
                                msg: gsm
                            },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
                            responseType: "json"
                        }).then(function (response) {

                            var user = JSON.parse(JSON.stringify(response.data));
                            //  console.log(user);
                            //console.log("user[0].id= "+user[0].message_id);

                            var k1 = user.id;

                            console.log(user.id);

                            UpdateStatusQuery(smsMsgConverID, k1, gsm);

                            // console.log(response.data);

                        });

                        return;
                    }

                } //end else

            });

        });

        //-----
    }

    function SendStudentIDNo(senderID) {


        // var newpassword =generateP();
        var studentCPDB = "";

        var getFStudentIDNo = new Promise(function (resolve, reject) {
            var studentFIDNO = "";
            var sqlquery = "SELECT * FROM students WHERE student_PSID=" + senderID;

            connection.query(sqlquery, function (error, results) {
                if (error) {
                    studentFIDNO = "";
                    console.error(error);
                    return;
                } else {
                    let studentRows;

                    if (results.length > 0) {
                        studentRows = JSON.parse(JSON.stringify(results));
                        studentCPDB = studentRows[0].student_contactno;
                        studentFIDNO = studentRows[0].id_studschoolno;

                        var xnw = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. Your  NMSCST School ID Number is " + studentFIDNO + ". Do not reply this message. Reference No. " + Date.now();

                        //  var xnw= "NMSC School ID No is " + studentFIDNO;
                        axios({
                            url: " https://api.semaphore.co/api/v4/messages",
                            method: "post",
                            headers: {
                                "Content-type": "application/json"
                            },
                            data: {
                                apikey: "816677ff0422ad99c4cdb32eddfc46d2",
                                number: studentCPDB,
                                sendername: "NMSC",
                                message: xnw
                            },
                            responseType: "json"
                        }).then(function (response) {
                        });
                        return;
                    } else {
                        return;


                    }

                }
                resolve(studentCPDB)
            });
        });


    }

    function SendStudentOTP2(studentCP, senderID) {
        let studentOTP;

        // console.log(Date.now());


        var gsm = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. Please input your One-Time-Pin {otp} in NMSCST Chatbot. Do not reply this message. Reference No. " + Date.now();

        axios({
            url: " https://api.semaphore.co/api/v4/otp",
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            data: {
                apikey: "816677ff0422ad99c4cdb32eddfc46d2",
                number: studentCP,
                sendername: "NMSC",
                message: gsm
            },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
            responseType: "json"
        }).then(function (response) {

            StudentRows = JSON.parse(JSON.stringify(response.data));
            studentOTP = StudentRows[0].code;

            console.log(studentOTP);

            //console.log(response.data);

            SaveOTP(studentOTP, senderID);

            //-----


            //------

        });


    }


    function ReplySendStudentSMSKeywords(studentCP, smsMsgConverID) {

        // var gsm ="Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. Please input your One-Time-Pin {otp} in NMSCST Chatbot. Do not reply this message. Reference No. " + Date.now();

        var gsm = "Hi, Welcome to NMSCST Chatbot. We're here to cater your queries. \n0. To ask for the list of keywords. Just text KEYWORDS\n 1. To inquire about  your Grades. Just text \nGRADE< space >SCHOOLYEAR< space >SEMESTER (Ex. GRADE 2018-2019 1) \n2. To inquire about  School Events. Just text\nEVENTS< space >(THISWEEK/THISMONTH) (Ex. EVENTS THISWEEK) \n3. To inquire about  other matters. Just text \nINQUIRE< space >(CONCERN) (Ex. INQUIRE How much is the tuition for BSIT?) \n4. To change password. Just text FORGOTPASSWORD \n5. To retrieve schoolID. Just text FORGOTSCHOOLID \n6. To changenumber, Just text CHANGENUMBER< space >1111-1111/PASSWORD/NEWNUMBER \n\nThank you you for using NMSCST Chatbot. Have a great day!";
        var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";
//  var s1 = studentCP;
//var s2 = s1.substring(1);
        // var text1="+63";
        var numeroCP = studentCP; // text1.concat(s2);
        //console.log(numeroCP);


        axios({  //?token=" + tokeings + "&device=321584"
            url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + numeroCP + "&msg=" + gsm,
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            data: {
                token: "730461e4a7ba7f2d64e2632b2d8c6493",
                phone: numeroCP,
                device: "321584",
                msg: gsm
            },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
            responseType: "json"
        }).then(function (response) {


            console.log(response.data.id);
            //--------------------------
            var SaveReplySMSReceivedtoDB = new Promise(function (resolve, reject) {

                var outputstr = gsm.replace(/'/g, '"');

                const encoded = encodeURI(outputstr);

                var sqlw2 = "INSERT INTO dialog values(''," + smsMsgConverID + ", '" + encoded + "','" + response.data.id + "','" + Date.now() + "')";
                console.log(sqlw2);


                connection.query(sqlw2, function (error, results) {
                    if (error) {
                        console.error(error);
                        return;
                    } else {
                        return;
                    }

                    resolve(SaveReplySMSReceivedtoDB)
                });

            });


            var StorePSID = new Promise(function (resolve, reject) {

                var sqlq1 = "UPDATE conversation SET inquirystatus=1 WHERE conversion_id= " + smsMsgConverID;
                // console.log(sqlq1);

                connection.query(sqlq1, function (error, results) {
                    if (error) {
                        console.error(error);
                        return;
                    } else {

                        return;
                    }

                    resolve(studentPSIDNO)
                });

            });


            //--------------------------
            //  StudentRows= JSON.parse(JSON.stringify(response.data));
            //         studentOTP=StudentRows[0].code;


            // console.log(studentOTP);

            console.log(response.data);


            //-----


            //------

        });
        return;
    }


    function RegisterStudentFB(studschoolidno, senderID, studentCP) {

        var StorePSID = new Promise(function (resolve, reject) {
            var studentPSIDNO = senderID;
            var sqlq1 = "UPDATE students SET student_PSID='" + senderID + "' WHERE id_studschoolno = '" + studschoolidno + "'";
            // console.log(sqlq1);

            connection.query(sqlq1, function (error, results) {
                if (error) {
                    console.error(error);
                    return;
                } else {

                    studentPSIDNO = senderID;

                    var msg = "Your Facebook has been registered.";
                    handleMessage(senderID, msg);
                    SendStudentOTP2(studentCP, senderID);
                    SendStudentSMSKeywords(studentCP);
                    //console.log(results.affectedRows + " record(s) updated");
                    // console.log("PSID : " + studentPSIDNO);
                    return;
                }

                resolve(studentPSIDNO)
            });
        });
    }

    function SendStudentSMSKeywords(studentCP) {

        // var gsm ="Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. Please input your One-Time-Pin {otp} in NMSCST Chatbot. Do not reply this message. Reference No. " + Date.now();

        var gsm = "Hi, Welcome to NMSCST Chatbot. We're here to cater your queries. \n0. To ask for the list of keywords. Just text KEYWORDS\n 1. To inquire about  your Grades. Just text \nGRADE< space >SCHOOLYEAR< space >SEMESTER (Ex. GRADE 2018-2019 1) \n2. To inquire about  School Events. Just text\nEVENTS< space >(THISWEEK/THISMONTH) (Ex. EVENTS THISWEEK) \n3. To inquire about  other matters. Just text \nINQUIRE< space >(CONCERN) (Ex. INQUIRE How much is the tuition for BSIT?) \n4. To change password. Just text FORGOTPASSWORD \n5. To retrieve schoolID. Just text FORGOTSCHOOLID \n6. To changenumber, Just text CHANGENUMBER< space >1111-1111/PASSWORD/NEWNUMBER \n\nThank you you for using NMSCST Chatbot. Have a great day!";
        var tokeings = "730461e4a7ba7f2d64e2632b2d8c6493";
//  var s1 = studentCP;
//var s2 = s1.substring(1);
        // var text1="+63";
        let numeroCP = studentCP; // text1.concat(s2);
        console.log(numeroCP);


        axios({  //?token=" + tokeings + "&device=321584"
            url: "https://semysms.net/api/3/sms.php?token=" + tokeings + "&device=321584&phone=" + numeroCP + "&msg=" + gsm,
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            data: {
                token: "730461e4a7ba7f2d64e2632b2d8c6493",
                phone: numeroCP,
                device: "321584",
                msg: gsm
            },  //"reply with 'code {otp}' in the nmscst chatbot. ref# abc-000000"
            responseType: "json"
        }).then(function (response) {

            //  StudentRows= JSON.parse(JSON.stringify(response.data));
            //         studentOTP=StudentRows[0].code;

            // console.log(studentOTP);

            console.log(response.data);


            //-----


            //------

        });

    }

    function RegisterStudentFB(studschoolidno, senderID, studentCP) {

        var StorePSID = new Promise(function (resolve, reject) {
            var studentPSIDNO = senderID;
            var sqlq1 = "UPDATE students SET student_PSID='" + senderID + "' WHERE id_studschoolno = '" + studschoolidno + "'";
            // console.log(sqlq1);

            connection.query(sqlq1, function (error, results) {
                if (error) {
                    console.error(error);
                    return;
                } else {

                    studentPSIDNO = senderID;

                    var msg = "Your Facebook has been registered.";
                    handleMessage(senderID, msg);
                    SendStudentOTP2(studentCP, senderID);
                    SendStudentSMSKeywords(studentCP);
                    //console.log(results.affectedRows + " record(s) updated");
                    // console.log("PSID : " + studentPSIDNO);
                    return;
                }

                resolve(studentPSIDNO);
            });
        });
    }

    function SaveOTP(studentOTP, senderID) {

        var StoreOTP = new Promise(function (resolve, reject) {
            var studentCPOTP = "";

            connection.query("UPDATE students SET otp=" + studentOTP + " WHERE student_PSID= " + senderID, function (error, results) {
                if (error) {
                    console.error(error);
                    return;
                } else {

                    studentCPOTP = studentOTP;

                    //console.log(results.affectedRows + " record(s) updated");
                    console.log("OTP ni: " + studentCPOTP);
                    return;
                }

                resolve(studentCPOTP);
            });

        });

    }

    function UpdatePassword(newpassword, senderID) {

        var UpdatePasswd = new Promise(function (resolve, reject) {
            var studentNewPassword = newpassword;

            var sql12 = "UPDATE students SET student_password='" + studentNewPassword + "' WHERE student_PSID= '" + senderID + "'";
            console.log(sql12);
            connection.query(sql12, function (error, results) {
                if (error) {
                    console.error(error);
                    return;
                } else {

                    // studentNewPassword=studentNewPassword ;

                    //console.log(results.affectedRows + " record(s) updated");
                    console.log("New Pass is: " + studentNewPassword);
                    return;
                }

                resolve(studentNewPassword);
            });

        });

    }

    function doConvert(no1) {
        let numberInput = no1;


        let oneToTwenty = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        let tenth = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        //if(numberInput.toString().length > 7) return 'overlimit' ;
        console.log(numberInput);
        //let num = ('0000000000'+ numberInput).slice(-10).match(/^(\d{1})(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        let num = ('0000000' + numberInput).slice(-7).match(/^(\d{1})(\d{1})(\d{2})(\d{1})(\d{2})$/);
        console.log(num);
        if (!num) return;

        let outputText = num[1] != 0 ? (oneToTwenty[Number(num[1])] || `${tenth[num[1][0]]} ${oneToTwenty[num[1][1]]}`) + ' million ' : '';

        outputText += num[2] != 0 ? (oneToTwenty[Number(num[2])] || `${tenth[num[2][0]]} ${oneToTwenty[num[2][1]]}`) + 'hundred ' : '';
        outputText += num[3] != 0 ? (oneToTwenty[Number(num[3])] || `${tenth[num[3][0]]} ${oneToTwenty[num[3][1]]}`) + ' thousand ' : '';
        outputText += num[4] != 0 ? (oneToTwenty[Number(num[4])] || `${tenth[num[4][0]]} ${oneToTwenty[num[4][1]]}`) + 'hundred ' : '';
        outputText += num[5] != 0 ? (oneToTwenty[Number(num[5])] || `${tenth[num[5][0]]} ${oneToTwenty[num[5][1]]} `) : '';

        return outputText;
    }

    function receivedPostback(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfMessage = event.timestamp;
        var payload = event.postback.payload;
        var fbmid = event.postback.mid;
        console.log("POSTBACK DATA");
        console.log(event);

        console.log(senderID);
        var schoolyear;
        switch (payload) {
            case 'GET_STARTED':

                greetUserText(senderID);
                break;

            case 'STUDENT':
                greetStudentText(senderID);
                break;

            case 'VISITOR':
                greetVisitorText(senderID);
                break;

            case 'GRADESStud':
                //grades;
                console.log("Grades");
                //GetStudGrades(senderID);
                var msg = "Select the Year in which you wish to see your grade.";
                StudentGradeText(senderID, msg);

                break;

            case 'EVENTSstud':
                // greetVisitorText(senderID);
                var msg = "Select the event schedule you want to know.";
                console.log("Events");
                FBMsgStudSchoolEvent(senderID, msg);
                break;

            case 'DLProspectus':
                // greetVisitorText(senderID);
                // var msg = "Select the event schedule you want to know.";
                console.log("DOwnload Prospectus");

                SendPdfCopyProspectus(senderID, msg);
                break;
            case 'OtherInquiry':
                // greetVisitorText(senderID);
                //var msg = "Select the event schedule you want to know.";
                console.log("Other Inquiry");

                break;

            case 'SEEMORE2':
                // greetVisitorText(senderID);
                //var msg = "Select the event schedule you want to know.";
                console.log("See more 2");

                var getEventTitle = new Promise(function (resolve, reject) {
                    var SchoolEventTitle = "";
                    var sqlquery21 = "SELECT events_id,venue,title, description, date_format(eventdate, '%M %e, %Y') as b1, date_format(eventtime, '%l:%i %p') as b2, adminID, MONTHNAME(NOW()) as KaronnaMonth,MONTH(eventdate) as DBWeek  FROM events where (MONTH(NOW())=MONTH(eventdate))";

                    connection.query(sqlquery21, function (error21, results21) {
                        if (error21) {
                            SchoolEventTitle = "";
                            console.error(error21);
                            return;
                        } else {
                            let studentRows21;

                            if (results21.length > 0) {
                                studentRows21 = JSON.parse(JSON.stringify(results21));
                                var EventIDx = studentRows21[0].events_id;

                                var xc = 0;

                                var subs = [];
                                //var EventVenue = studentRows[0].venue;
                                // var EventTitle = studentRows[0].title;
                                // var EventDate = studentRows[0].b1;
                                // var EventTime = studentRows[0].b2;
                                //KaronnaMonth

                                while (xc < results21.length) {

                                    var c1 = "WHAT: " + studentRows21[xc].title + "\nWHEN: " + studentRows21[xc].b1 + " @ " + studentRows21[xc].b2 + "\nWHERE: " + studentRows21[xc].venue + "\nWHO: " + studentRows21[xc].description + "\n";
                                    subs.push(c1);
                                    xc++;
                                }
                                let text21 = subs.join("\n");

                                var msg2 = studentRows21[0].KaronnaMonth + " Activities\n\n" + text21;
                                // var msg = "Welcome to NMSCST, Your gateway to the World! Choose your query from the options below.";

                                //console.log(msg);
                                console.log(msg2);

                                handleMessage(senderID, msg2);
                                return;
                            } else {


                            }

                        }
                        resolve(SchoolEventTitle);
                    });
                });
                break;

            case 'SEEMORE':
                // greetVisitorText(senderID);
                //var msg = "Select the event schedule you want to know.";
                console.log("SEE mORE");
                var getEventTitle = new Promise(function (resolve, reject) {
                    var SchoolEventTitle = "";
                    var sqlquery21 = "SELECT events_id,venue,title, description, date_format(eventdate, '%M %e, %Y') as b1, date_format(eventtime, '%l:%i %p') as b2, adminID, YEARWEEK(NOW()) as KaronnaWeek,YEARWEEK(eventdate) as DBWeek  FROM events where (YEARWEEK(NOW())=YEARWEEK(eventdate))";

                    connection.query(sqlquery21, function (error21, results21) {
                        if (error21) {
                            SchoolEventTitle = "";
                            console.error(error21);
                            return;
                        } else {
                            let studentRows21;

                            if (results21.length > 0) {
                                studentRows21 = JSON.parse(JSON.stringify(results21));
                                var EventIDx = studentRows21[0].events_id;

                                var xc = 0;

                                var subs = [];
                                //var EventVenue = studentRows[0].venue;
                                // var EventTitle = studentRows[0].title;
                                // var EventDate = studentRows[0].b1;
                                // var EventTime = studentRows[0].b2;

                                while (xc < results21.length) {

                                    var c1 = "WHAT: " + studentRows21[xc].title + "\nWHEN: " + studentRows21[xc].b1 + " @ " + studentRows21[xc].b2 + "\nWHERE: " + studentRows21[xc].venue + "\nWHO: " + studentRows21[xc].description + "\n";
                                    subs.push(c1);
                                    xc++;
                                }
                                let text21 = subs.join("\n\n");

                                var msg2 = text21;
                                // var msg = "Welcome to NMSCST, Your gateway to the World! Choose your query from the options below.";

                                //console.log(msg);
                                console.log(msg2);

                                handleMessage(senderID, msg2);
                                return;
                            } else {


                            }

                        }
                        resolve(SchoolEventTitle);
                    });
                });
                break;

            case 'EVENTWEEK':
                // StudentLogin(senderID);
                console.log("this week event");
                // var eventtitle="Hello World Party";
                var pilajud = 0;


                //-------
                var getNewStudentInfo = new Promise(function (resolve, reject) {
                    var studentCPDB = "";
                    var sqlquery = "SELECT Count(events_id) as ihap FROM events where (YEARWEEK(NOW())=YEARWEEK(eventdate))";

                    connection.query(sqlquery, function (error, results) {
                        if (error) {
                            studentCPDB = "";
                            console.error(error);
                            return;
                        } else {
                            let studentRows;

                            if (results.length > 0) {
                                studentRows = JSON.parse(JSON.stringify(results));

                                console.log(studentRows);

                                pilajud = studentRows[0].ihap;
                                console.log(pilajud);

                                if (pilajud == 1) {

                                    var msg = "We have only " + doConvert(pilajud) + " (" + pilajud + ") activity for this week.\n";

                                } else {
                                    var msg = "We have  " + doConvert(pilajud) + " (" + pilajud + ") activities for this week.\n";

                                }

                                var getEventTitle = new Promise(function (resolve, reject) {
                                    var SchoolEventTitle = "";
                                    var sqlquery21 = "SELECT events_id,venue,title, description, date_format(eventdate, '%M %e, %Y') as b1, date_format(eventtime, '%l:%i %p') as b2, adminID, YEARWEEK(NOW()) as KaronnaWeek,YEARWEEK(eventdate) as DBWeek  FROM events where (YEARWEEK(NOW())=YEARWEEK(eventdate))";

                                    connection.query(sqlquery21, function (error21, results21) {
                                        if (error21) {
                                            SchoolEventTitle = "";
                                            console.error(error21);
                                            return;
                                        } else {
                                            let studentRows21;

                                            if (results21.length > 0) {
                                                studentRows21 = JSON.parse(JSON.stringify(results21));
                                                var EventIDx = studentRows21[0].events_id;

                                                var xc = 0;

                                                var subs = [];


                                                while (xc < results21.length) {

                                                    var c1 = "- " + studentRows21[xc].title;
                                                    subs.push(c1);
                                                    xc++;
                                                }
                                                let text21 = subs.join("\n");

                                                var msg2 = msg + text21;
                                                // var msg = "Welcome to NMSCST, Your gateway to the World! Choose your query from the options below.";

                                                console.log(msg);
                                                console.log(msg2);


                                                EventhandleMessage(senderID, msg2);
                                                return;
                                            } else {


                                            }

                                        }
                                        resolve(SchoolEventTitle);
                                    });
                                });


                                // console.log("Number on DB: " + numdb);
                                // console.log("Number on Sender: " + numero);

                            } else {


                            }
                            if (pilajud != 0) {
                            } else {
                                var msg = "We have no activities for this week.\n";

                                handleMessage(senderID, msg);
                            }


                            return;
                        } //end else
                    });
                });


                // FBMsgWEEKLYStudSchoolEvent(senderID, msg);

                break;
            case 'EVENTMONTH':
                console.log("this month event");

                var pilajud = 0;


                //-------
                var getNewStudentInfo = new Promise(function (resolve, reject) {
                    var studentCPDB = "";
                    var sqlquery = "SELECT Count(events_id) as ihap FROM events where (MONTH(NOW())=MONTH(eventdate))";

                    connection.query(sqlquery, function (error, results) {
                        if (error) {
                            studentCPDB = "";
                            console.error(error);
                            return;
                        } else {
                            let studentRows;

                            if (results.length > 0) {
                                studentRows = JSON.parse(JSON.stringify(results));

                                console.log(studentRows);

                                pilajud = studentRows[0].ihap;
                                console.log(pilajud);

                                if (pilajud == 1) {

                                    var msg = "We have only " + doConvert(pilajud) + " (" + pilajud + ") activity for this month.\n";

                                } else {
                                    var msg = "We have  " + doConvert(pilajud) + " (" + pilajud + ") activities for this month.\n";

                                }


                                var getEventTitle = new Promise(function (resolve, reject) {
                                    var SchoolEventTitle = "";
                                    var sqlquery21 = "SELECT events_id,venue,title, description, date_format(eventdate, '%M %e, %Y') as b1, date_format(eventtime, '%l:%i %p') as b2, adminID, MONTH(eventdate) as DBWeek  FROM events where (MONTH(NOW())=MONTH(eventdate))";

                                    connection.query(sqlquery21, function (error21, results21) {
                                        if (error21) {
                                            SchoolEventTitle = "";
                                            console.error(error21);
                                            return;
                                        } else {
                                            let studentRows21;

                                            if (results21.length > 0) {
                                                studentRows21 = JSON.parse(JSON.stringify(results21));
                                                var EventIDx = studentRows21[0].events_id;

                                                var xc = 0;

                                                var subs = [];


                                                while (xc < results21.length) {

                                                    var c1 = "- " + studentRows21[xc].title;
                                                    subs.push(c1);
                                                    xc++;
                                                }
                                                let text21 = subs.join("\n");

                                                var msg2 = msg + text21;
                                                // var msg = "Welcome to NMSCST, Your gateway to the World! Choose your query from the options below.";

                                                console.log(msg);
                                                console.log(msg2);


                                                EventhandleMessage2(senderID, msg2);
                                                return;
                                            } else {


                                            }

                                        }
                                        resolve(SchoolEventTitle);
                                    });
                                });


                                // console.log("Number on DB: " + numdb);
                                // console.log("Number on Sender: " + numero);

                            } else {


                            }
                            if (pilajud != 0) {
                            } else {
                                var msg = "We have no activities for this month.\n";

                                handleMessage(senderID, msg);
                            }


                            return;
                        } //end else
                    });
                });


                break;
            case 'YesStudent':
                StudentLogin(senderID);


                // console.log("mologinko as astudent");


                break;


            case 'YesViewAgain':
                //var msg = "Select the Year in which you wish to see your grade.";
                // StudentGradeText(senderID,msg);
                console.log("YesViewAgain");

                console.log("var SY: " + gradeSY);


                if (gradeSEM == "Second Semester") {
                    gradeSEM = "First Semester";
                } else if (gradeSEM == "First Semester") {
                    gradeSEM = "Second Semester";
                }

                GetStudGrades(senderID, gradeSY, gradeSEM);

                //console.log("New value gradeSem: " + gradeSEM);


                // console.log("Events");
                break;



            //BACKTOMENU
            case 'BACKTOMENU':
                var msg = "Select the Year in which you wish to see your grade.";
                StudentGradeText(senderID, msg);

                // console.log("Events");
                break;


            case 'EVENTSstud':
                // greetVisitorText(senderID);
                console.log("Events");
                break;

            case 'SGGrade20182019':
                // 20182019
                gradeSY = "2018-2019";
                var msg = "Choose the semester you wish to view your grades.";
                schoolyear = "2018-2019";
                handleMessageCHOOSEmeStudentSem(senderID, msg, schoolyear);

                break;
            case 'SGGrade20192020':
                gradeSY = "2019-2020";
                var msg = "Choose the semester you wish to view your grades.";
                schoolyear = "2019-2020";
                handleMessageCHOOSEmeStudentSem(senderID, msg, schoolyear);
                break;
            case 'SGGrade20202021':
                gradeSY = "2020-2021";
                var msg = "Choose the semester you wish to view your grades.";
                schoolyear = "2020-2021";
                handleMessageCHOOSEmeStudentSem(senderID, msg, schoolyear);

                break;
            case 'SGGrade20212012':
                gradeSY = "2020-2021";
                var msg = "Choose the semester you wish to view your grades.";
                schoolyear = "2020-2021";
                handleMessageCHOOSEmeStudentSem(senderID, msg, schoolyear);

                break;
            case 'SGGrade20222023':
                gradeSY = "2023-2023";
                var msg = "Choose the semester you wish to view your grades.";
                schoolyear = "2022-2023";
                handleMessageCHOOSEmeStudentSem(senderID, msg, schoolyear);
                break;
            case 'SGGrade20232024':
                gradeSY = "2023-2024";
                var msg = "Choose the semester you wish to view your grades.";
                schoolyear = "2023-2024";
                handleMessageCHOOSEmeStudentSem(senderID, msg, schoolyear);

                break;

//-----
            case 'FirstSemester':
                // greetVisitorText(senderID);
                // console.log("var SY" + gradeSY);
                var syX = gradeSY;
                var semX = "First Semester";
                gradeSEM = "First Semester";
                GetStudGrades(senderID, syX, semX);
                break;
            case 'SecondSemester':
                // greetVisitorText(senderID);
                var syX = gradeSY;
                var semX = "Second Semester";
                gradeSEM = "Second Semester";
                GetStudGrades(senderID, syX, semX);
                break;

//------     

            case 'ForgotPasswd':
                // greetVisitorText(senderID);
                SendNewPassword(senderID);
                var msg = "Please check your cellphone number,  your NEW PASSWORD that has been sent to your registered mobile number.";

                handleMessage(senderID, msg);


                break;

            case 'ForgotStudIdNo':

                SendStudentIDNo(senderID);
                var msg = "Please check your registered cellphone number for a message with your Student ID Number";
                handleMessage(senderID, msg);

                break;


            default :
                //var msg = "Incorre";
                //console.log(msg);
                // handleMessage(senderID,msg);
                break;
        }

    }

    function EventhandleMessage2(senderID, msg) {

        var messageData = {
            recipient: {
                id: senderID
            },
            message: {

                //--
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": msg,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "See more",
                                "payload": "SEEMORE2"
                            }
                        ]
                    }
                }
                //-
            }
        };

        callSendAPI(messageData);

        //-------

    }

    function EventhandleMessage(senderID, msg) {

        var messageData = {
            recipient: {
                id: senderID
            },
            message: {

                //--
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": msg,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "See more",
                                "payload": "SEEMORE"
                            }
                        ]
                    }
                }
                //-
            }
        };

        callSendAPI(messageData);

        //-------

    }

    function handleMessage(sender_psid, msg) {

        var messageData = {
            recipient: {
                id: sender_psid
            },
            message: {
                text: msg
            }
        };

        callSendAPI(messageData);

    }

    function SendPdfCopyProspectus(senderID, msg) {

        const myURL = new URL('https://nmscstchatbot.serv00.net:3153/prospectus/sendfb/');


        var getStudentCourse = new Promise(function (resolve, reject) {
            var studentCourse = ""; //prospectus.prospectusID
            var sqlquery = "SELECT prospectus.prospectusID,students.student_PSID,students.student_course,prospectus.course,prospectus.fileupload,prospectus.filename FROM students,prospectus  WHERE students.student_PSID='" + senderID + "' and students.student_course=prospectus.course";
            console.log(sqlquery);
            connection.query(sqlquery, function (error, results) {
                if (error) {
                    studentCourse = "";
                    console.error(error);
                    return;
                } else {
                    let studentRows;

                    if (results.length > 0) {

                        //naay available na pdf
                        studentRows = JSON.parse(JSON.stringify(results));
                        studentCourse = studentRows[0].student_course;
                        var pdfFullPath = studentRows[0].fileupload;
                        var pdfIDno = studentRows[0].prospectusID;


                        console.log(pdfFullPath);
                        //var xnw= "Your New Password is " + newpassword;

                        console.log(myURL.href + pdfIDno);
                        var pdfFullPath = myURL.href + pdfIDno;

                        var messageData = {
                            recipient: {
                                id: senderID
                            },
                            message: {

                                //--
                                "attachment": {
                                    "type": "file",
                                    "payload": {
                                        "url": pdfFullPath,
                                        "is_reusable": true
                                    }
                                }
                                //-
                            }
                        };

                        callSendAPI(messageData);


                    } else {


                        //walay available na pdf


                    }

                    if (results.length == 0) {
                        var msg = "Good Day Blue Generals! \n\n I'm your NMSCST Chatbot. There is no available PDF copy of your Prospectus. Please try again later. Do not reply this message. Reference No. " + Date.now();
                        handleMessage(senderID, msg);
                    }

                }
                resolve(studentCourse)
            });
        });
    }

    function handleMessageUnknownQuery(sender_psid, msg) {

        var messageData = {
            recipient: {
                id: sender_psid
            },
            message: {
                text: msg
            }
        };

        callSendAPI(messageData);

    }

    function SendGradetoStudentFB(senderID, msg) {


        console.log(gradeSY);


        var messageData = {
            recipient: {
                id: senderID
            },
            message: {
                text: msg
            }
        };

        callSendAPI(messageData);

    }


    function StudentGradeText(senderID, msg) {

        var messageData = {
            recipient: {
                id: senderID
            },
            message: {

                //--
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": msg,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "2018-2019",
                                "payload": "SGGrade20182019"
                            },
                            {
                                "type": "postback",
                                "title": "2019-2020",
                                "payload": "SGGrade20192020"
                            },
                            {
                                "type": "postback",
                                "title": "2020-2021",
                                "payload": "SGGrade20202021"
                            }
                        ]
                    }
                }

                //-
            }
        };

        var messageData2 = {
            recipient: {
                id: senderID
            },
            message: {

                //--
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": msg,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "2021-2022",
                                "payload": "SGGrade20212012"
                            },
                            {
                                "type": "postback",
                                "title": "2022-2023",
                                "payload": "SGGrade20222023"
                            },
                            {
                                "type": "postback",
                                "title": "2023-2024",
                                "payload": "SGGrade20232024"
                            }
                        ]
                    }
                }

                //-
            }
        };


        callSendAPI(messageData);
        callSendAPI(messageData2);
    }

    function FBMsgWEEKLYStudSchoolEvent(senderID, msg) {

        var messageData = {
            recipient: {
                id: senderID
            },
            message: {

                //--
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": msg,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "This Week",
                                "payload": "EVENTWEEK"
                            },
                            {
                                "type": "postback",
                                "title": "This Month",
                                "payload": "EVENTMONTH"
                            }
                        ]
                    }
                }
                //-
            }
        };

        callSendAPI(messageData);

    }

    function FBMsgStudSchoolEvent(senderID, msg) {

        var messageData = {
            recipient: {
                id: senderID
            },
            message: {

                //--
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": msg,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "This Week",
                                "payload": "EVENTWEEK"
                            },
                            {
                                "type": "postback",
                                "title": "This Month",
                                "payload": "EVENTMONTH"
                            }
                        ]
                    }
                }
                //-
            }
        };

        callSendAPI(messageData);

    }

    function handleMessageStudent(sender_psid, msg) {

        var messageData = {
            recipient: {
                id: sender_psid
            },
            message: {

                //--
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": msg,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes",
                                "payload": "YesStudent"
                            },
                            {
                                "type": "postback",
                                "title": "No",
                                "payload": "VISITOR"
                            }
                        ]
                    }
                }
                //-
            }
        };

        callSendAPI(messageData);

    }


    function StudentBacktoMenu(senderID, msg2, syX, semX) {
        var SY123 = syX;
        var SEM123 = semX;

        gradeSEM = semX

        var messageData = {
            recipient: {
                id: senderID
            },
            message: {

                //--
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": msg2,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes",
                                "payload": "YesViewAgain"
                            },
                            {
                                "type": "postback",
                                "title": "Back to Menu",
                                "payload": "BACKTOMENU"
                            }
                        ]
                    }
                }
                //-
            }
        };

        callSendAPI(messageData);

    }


    function StudentGradeTextSY(senderID, msg) {

        var messageData = {
            recipient: {
                id: senderID
            },
            message: {

                //--
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": msg,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "2018-2019",
                                "payload": "SGGrade20182019"
                            },
                            {
                                "type": "postback",
                                "title": "2019-2020",
                                "payload": "SGGrade20192020"
                            },
                            {
                                "type": "postback",
                                "title": "2020-2021",
                                "payload": "SGGrade20202021"
                            },
                            {
                                "type": "postback",
                                "title": "2021-2022",
                                "payload": "SGGrade20212022"
                            },
                            {
                                "type": "postback",
                                "title": "2022-2023",
                                "payload": "SGGrade20222023"
                            },
                            {
                                "type": "postback",
                                "title": "2023-2024",
                                "payload": "SGGrade20232024"
                            },
                            {
                                "type": "postback",
                                "title": "2024-2025",
                                "payload": "SGGrade20242025"
                            }
                        ]
                    }
                }
                //-
            }
        };

        callSendAPI(messageData);

    }


    function handleMessage2(sender_psid, msg) {

        var messageData = {
            recipient: {
                id: sender_psid
            },
            message: {

                //--
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": msg,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Student",
                                "payload": "STUDENT"
                            },
                            {
                                "type": "postback",
                                "title": "Visitor",
                                "payload": "VISITOR"
                            }
                        ]
                    }
                }
                //-
            }
        };

        callSendAPI(messageData);

    }


    function handleMessageCHOOSEmeStudent(senderID, msg) {
// var senderID = event.sender.id;
        // Start the request
        // console.log(msg);
        request({
                url: "https://graph.facebook.com/" + senderID + "?access_token=" + FB_ACCESS_TOKEN,
                method: 'GET',
                headers: {'Content-Type': 'application/json'}

            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    // response.send(body);

                    var user = JSON.parse(body);

                    // console.log(user.first_name);

                    var msg2 = user.first_name + " " + msg;

                    handleMessageCHOOSEmeStudentMenu(senderID, msg2);

                } else {
                    // TODO: Handle errors
                    //response.send(body);
                }
            });
    }


    function handleMessageCHOOSEmeStudentMenu(senderID, msg2) {

        var messageData = {
            recipient: {
                id: senderID
            },
            message: {

                //--
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": msg2,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Grades",
                                "payload": "GRADESStud"
                            },
                            {
                                "type": "postback",
                                "title": "Events",
                                "payload": "EVENTSstud"
                            }
                        ]
                    }
                }
                //-
            }
        };

        callSendAPI(messageData);

    }

    function handleMessageCHOOSEmeStudentSem(senderID, msg, schoolyear) {

        var messageData = {
            recipient: {
                id: senderID
            },
            message: {

                //--
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": msg,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "First Semester",
                                "payload": "FirstSemester"
                            },
                            {
                                "type": "postback",
                                "title": "Second Semester",
                                "payload": "SecondSemester"
                            }
                        ]
                    }
                }
                //-
            }
        };

        callSendAPI(messageData);

    }


    function setupGetStartedButton(res) {
        var messageData = {
            get_started: {
                payload: "GET_STARTED"
            }
        };
        // Start the request
        request({
                url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + FB_ACCESS_TOKEN,
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                form: messageData
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    res.send(body);

                } else {
                    // TODO: Handle errors
                    res.send(body);
                }
            });
    }


    function menuButton(res) {
        var messageData = {
            "persistent_menu": [
                {
                    "locale": "default",
                    "composer_input_disabled": false,
                    "call_to_actions": [
                        {
                            "type": "postback",
                            "title": "Forgot Password",
                            "payload": "ForgotPasswd"
                        },
                        {
                            "type": "postback",
                            "title": "Forgot Student ID No",
                            "payload": "ForgotStudIdNo"
                        },
                        {
                            "type": "postback",
                            "title": "Download Prospectus Copy",
                            "payload": "DLProspectus"
                        },
                        {
                            "type": "postback",
                            "title": "Other Inquiry",
                            "payload": "OtherInquiry"
                        }
                    ]
                }
            ]
        };

        // Start the request
        request({
                url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + FB_ACCESS_TOKEN,
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                form: messageData
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    //  response.send(body);
                    res.send(body);
                } else {
                    // TODO: Handle errors
                    // response.send(body);
                    res.send(body);
                }
            });

    }

    function StudentLogin(senderID) {
// var senderID = event.sender.id;
        // Start the request
        // console.log(senderID );
        request({
                url: "https://graph.facebook.com/" + senderID + "?access_token=" + FB_ACCESS_TOKEN,
                method: 'GET',
                headers: {'Content-Type': 'application/json'}

            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    // response.send(body);

                    var user = JSON.parse(body);

                    // console.log(user.first_name);
                    StudentName = user.first_name;
                    var msg = "Please enter your ID number. Kindly follow this format \"ID ####-####/PASSWORD\".";

                    handleMessage(senderID, msg);

                } else {
                    // TODO: Handle errors
                    //response.send(body);
                }
            });
    }

    function GetStudGrades(senderID, syX, semX) {
// var senderID = event.sender.id;
        // Start the request
        // console.log(senderID );


        request({
                url: "https://graph.facebook.com/" + senderID + "?access_token=" + FB_ACCESS_TOKEN,
                method: 'GET',
                headers: {'Content-Type': 'application/json'}

            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    // response.send(body);

                    var user = JSON.parse(body);

                    // console.log(user.first_name);
                    StudentName = user.first_name;
                    // var msg ="Please enter your ID number. Kindly follow this format \"ID ####-####/PASSWORD\"." ;

                    // handleMessage(senderID,msg);


                    var getStudentOTP = new Promise(function (resolve, reject) {
                        var studentCPDB = "";
                        var sql23 = "SELECT grades.subject_code,grades.grade  FROM grades, students where grades.id_studschoolno = students.id_studschoolno and semester='" + semX + "' and schoolyear='" + syX + "' and students.student_PSID=" + senderID;
                        // var sqlquery="SELECT * FROM grades WHERE otp=" + otpcode +" AND student_PSID="+ senderID;

                        connection.query(sql23, function (error, results) {
                            if (error) {
                                studentCPDB = "";
                                console.error(error);
                                return;
                            } else {
                                let studentRows;
                                let xc = 0;
                                if (results.length > 0) {
                                    studentRows = JSON.parse(JSON.stringify(results));
                                    //console.log(studentRows);
                                    console.log("Records: " + results.length);
                                    var subs = [];


                                    while (xc < results.length) {
                                        //console.log(studentRows[xc].subject_code);
                                        var c1 = studentRows[xc].subject_code + " - " + studentRows[xc].grade;
                                        subs.push(c1);
                                        xc++;
                                    }

                                    let text = subs.join("\n");
                                    let text2 = StudentName + "\nYour " + semX + " Grades for the Academic Year " + syX + "\n\n";

                                    //studentCPDB=studentRows[0].otp;

                                    //  var msg ="Welcome to NMSCST, Your gateway to the World! Choose your query from the options below." ;

                                    var msg = text2 + text

                                    console.log(msg);
                                    SendGradetoStudentFB(senderID, msg);

                                    var msg2 = "Do you want to view your grades from other semester or go back to main menu?";

                                    if (semX == "First Semester") {
                                        semX = "First Semester";
                                    } else {
                                        semX = "Second Semester";
                                    }

                                    StudentBacktoMenu(senderID, msg2, syX, semX);


                                    return;
                                } else {
                                    console.log("Sem:" + semX);
                                    console.log("SY:" + syX);
                                    console.log("SenderID:" + senderID);
                                    if ((semX != "") && (syX != "")) {
                                        var msg = "You don't have any grades";
                                        handleMessage(senderID, msg);
                                        return;
                                    } else if ((semX == "")) {
                                        var msg = "Please Select Semester";
                                        handleMessage(senderID, msg);
                                        return;
                                    } else if ((syX == "")) {
                                        var msg = "Please Select School Year";
                                        handleMessage(senderID, msg);
                                        return;
                                    }

                                    syX = "";
                                    semX = "";
                                }

                            }
                            resolve(studentCPDB)
                        });
                    });

                    //-----
                } else {
                    // TODO: Handle errors
                    //response.send(body);
                }
            });


    }

    function greetUserText(senderID) {
// var senderID = event.sender.id;
        // Start the request
        // console.log(senderID );
        request({
                url: "https://graph.facebook.com/" + senderID + "?access_token=" + FB_ACCESS_TOKEN,
                method: 'GET',
                headers: {'Content-Type': 'application/json'}

            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    // response.send(body);

                    var user = JSON.parse(body);
                    StudentName = user.first_name;
                    // console.log(user.first_name);

                    var msg = "Hi " + user.first_name + "! I'm the NMSCST chatbot and I'm here to help you learn more about the Northwestern Mindanao State College of Science and Technology.\n\nYou can also txt us. Just type KEYWORDS and send to 09639231290";

                    handleMessage2(senderID, msg);


                } else {
                    // TODO: Handle errors
                    //response.send(body);
                }
            });
    }

    function greetStudentText(senderID) {
// var senderID = event.sender.id;
        // Start the request
        //console.log(senderID );
        request({
                url: "https://graph.facebook.com/" + senderID + "?access_token=" + FB_ACCESS_TOKEN,
                method: 'GET',
                headers: {'Content-Type': 'application/json'}

            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    // response.send(body);

                    var user = JSON.parse(body);

                    // console.log(user.first_name);

                    var msg = user.first_name + " you've just clicked \"Student\". Do you want to proceed and login?";

                    handleMessageStudent(senderID, msg);

                } else {
                    // TODO: Handle errors
                    //response.send(body);
                }
            });
    }

    function greetVisitorText(senderID) {
// var senderID = event.sender.id;
        // Start the request
        // console.log(senderID );
        request({
                url: "https://graph.facebook.com/" + senderID + "?access_token=" + FB_ACCESS_TOKEN,
                method: 'GET',
                headers: {'Content-Type': 'application/json'}

            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    // response.send(body);

                    var user = JSON.parse(body);

                    // console.log(user.first_name);

                    var msg = user.first_name + ", Thank you for visiting NMSCST Blue Generals! Have a good day...";

                    handleMessage(senderID, msg);

                } else {
                    // TODO: Handle errors
                    //response.send(body);
                }
            });
    }


    function callSendAPI(messageData) {
        // Construct the message body
        // console.log(messageData);

        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: FB_ACCESS_TOKEN},
            method: 'POST',
            json: messageData

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;
                //successfull

            } else {
                console.error("Unable to send message.");
                console.error(response);
                console.error(error);
            }
        });

    }


    app.get('/register', function (req, res) {
        if (req.user) {
            res.redirect('Dashboard/index');
        } else {
            res.render('Auth/auth-register', {'message': req.flash('message'), 'error': req.flash('error')});
        }
    });

    app.post('/post-register', urlencodeParser, function (req, res) {
        let tempUser = {username: req.body.username, email: req.body.email, password: req.body.password};
        users.push(tempUser);

        // Assign value in session
        sess = req.session;
        sess.user = tempUser;

        res.redirect('/');
    });


    app.get('/login', function (req, res) {
        res.render('Auth/auth-login', {'message': req.flash('message'), 'error': req.flash('error')});
    });

    app.post('/post-login', urlencodeParser, function (req, res) {

        var username = req.body.email;
        var password = req.body.password;

        // console.log(username && password);
        console.log(username);
        console.log(password);
        if (username && password) {
            connection.query('SELECT * FROM admin WHERE email = ? AND password = ?', [username, password], function (error, results, fields) {
                if (results.length > 0) {

                    sess = req.session;
                    sess.user = username;
                    res.redirect('/');

                } else {
                    req.flash('error', 'Invalid Email / Wrong Password');
                    res.redirect('/login');
                }
                res.end();
            });
        } else {
            req.flash('error', 'Please enter Username and Password!');
          res.redirect('/login');
            //res.end();
        }

        //const validUser = users.filter(usr => usr.email === req.body.email && usr.password === req.body.password);

        //if (validUser['length'] === 1) {

        // Assign value in session
        //  sess = req.session;
        //  sess.user = validUser;

        //  res.redirect('/');

        //} else {
        //  req.flash('error', 'Incorrect email or password!');
        //  res.redirect('/login');
        //}
    });

    async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM }) {


        const transporter = nodemailer.createTransport({
            host: 'mail0.serv00.com',
            port: 587,
            auth: {
                user: 'nmscstchatbot@nmscstchatbot.serv00.net', // generated ethereal user
                pass: 'Procedure101$' // generated ethereal password
            }
        })


        await transporter.sendMail({ from, to, subject, html });

        console.log("email sent sucessfully");

    };

    app.get('/forgot-password', async(req, res, next)=>{

        res.render('Auth/auth-forgot-password', {'message': req.flash('message'), 'error': req.flash('error')});


    });

    function sendPasswordResetEmail(email, resetToken, origin) {
        let message;

        if (origin) {
            const resetUrl = APP_URL + '/resetPassword?token='+resetToken+'&email='+email;
            message = '<p>Please click the below link to reset your password, the link will be valid for 1 hour:</p><p><a href="'+resetUrl+'">'+resetUrl+'</a></p>';
        } else {
          //  message = '<p>Please use the below token to reset your password with the <code>/apiRouter/reset-password</code> api route:</p><p><code>${resetToken}</code></p>';
        }

         sendEmail({
            from: 'nmscstchatbot@nmscstchatbot.serv00.net',
            to: email,
            subject: ' Reset your Password',
            html: `<h4>Reset Password </h4>
                   ${message}`
        });
    }

    function sendNewPasswordEmail(email, newPassword) {
        let message;
let x231 =newPassword;
   //     if (origin) {
            //const resetUrl = APP_URL + '/resetPassword?token='+resetToken+'&email='+email;
            //message = '<p>Please click the below link to reset your password, the link will be valid for 1 hour:</p><p><a href="'+resetUrl+'">'+resetUrl+'</a></p>';
       // } else {
              message = "<p>Here is your New Admin password : <code> "+ x231 +"</code> </p>";
      //  }

        sendEmail({
            from: 'nmscstchatbot@nmscstchatbot.serv00.net',
            to: email,
            subject: ' New Admin Password',
            html: `<h4>New Admin Password </h4>
                   ${message}`
        });
    }

    app.post('/post-forgot-password', urlencodeParser, function (req, res) {

       var emailadmin=req.body.email;

        var getNewPass = new Promise(function (resolve, reject) {
            var studentCPDB = "";
            var sqlquery = "SELECT count(*) as ihapdaw FROM admin WHERE email='" + emailadmin +"'";

            connection.query(sqlquery, function (error, results) {
                if (error) {
                    studentCPDB = "";
                    console.error(error);
                    return;
                } else {
                    let studentRows;

                    if (results.length > 0) {
                        studentRows = JSON.parse(JSON.stringify(results));
                        studentCPDB = studentRows[0].ihapdaw;

//console.log(studentCPDB);


                        if (studentCPDB === 1) {
                            const origin = req.header('Origin'); // we are  getting the request origin from  the HOST header

                            //const user = await db.getUserByEmail(email);

                           // await db.expireOldTokens(email, 1);



                            // create reset token that expires after 1 hours
                            const resetToken = crypto.randomBytes(40).toString('hex');

                            const currentDate = new Date();
                            const resetTokenExpires = new Date(Date.now() + 60*60*1000);
                            const createdAt =new Date(Date.now());
                            const timestamp1 = createdAt.getTime();
                            const timestamp2 = resetTokenExpires.getTime();

                            const timestamp3 = currentDate.getTime();

                            const expiredAt = resetTokenExpires;



                            console.log(timestamp1);
                            console.log(timestamp2);

                            const used = 0;
                            console.log(resetToken);

                            var SaveNewTokenoDB = new Promise(function (resolve, reject) {


                                var sqlw2 = "INSERT INTO ResetPasswordToken values('','" + emailadmin + "','" + resetToken + "', '" + timestamp1 + "','" + timestamp2 + "', 0)";
                                console.log(sqlw2);

                                connection.query(sqlw2, function (error1,results1) {
                                    if (error1) {
                                        console.error(error1);
                                        return;
                                    } else {
                                        return;
                                    }
                                    resolve(SaveNewTokenoDB)
                                });

                            });


                            // send email
                            sendPasswordResetEmail(emailadmin,resetToken, origin);


                            req.flash('message', 'We have e-mailed your password reset link!');



                            res.redirect('/forgot-password');
                        } else {

                            req.flash('error', 'Email Not Found !!');

                          //  res.redirect('/forgot-password');
                        }


                        return;
                    } else {
                        return;


                    }

                }
                resolve(studentCPDB)
            });
        });


    });


   // bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
        // result == false
 //   });

    app.get('/logout', function (req, res) {

        // Assign  null value in session
        sess = req.session;
        sess.user = null;

        res.redirect('/login');
    });


    app.get('/resetPassword', function (req, res) {
        //res.locals = { title: 'Reset Password'};
        //  res.render('Form/sms');

        const link1 = url.parse(req.url, true).query;

        const email = link1.email;
        const resetToken = link1.token;

        console.log(email);
        console.log(resetToken);


        if (!resetToken || !email) {
            return res.sendStatus(400);
        }

        // then we need to verify if the token exist in the resetPasswordToken and not expired.
        const currentTime = new Date(Date.now());


        // const token = await db.findValidToken(resetToken, email, currentTime);


        var sql = "SELECT * FROM ResetPasswordToken WHERE (email = '" + email + "' AND Token_value = '" + resetToken + "')";
        connection.query(sql, function (err, data, fields) {
            if (err) throw err;
            // res.render('Tables/prospectus', { title: 'Prospectus', userData: data});




            studentRows = JSON.parse(JSON.stringify(data));

            const datecurrentTS = new Date(currentTime);
            const date2expiryTS = studentRows[0].expired_at;
            const TSExpirySecs = Math.floor(date2expiryTS / 1000);
            const TSCurrentSecs = Math.floor(datecurrentTS.getTime() / 1000);


            console.log("expired_at: " + TSExpirySecs);
            console.log("currenttime: " + TSCurrentSecs);


            //const str = currentTime;

            var totalTokenElapsedTimeinSecs = (TSCurrentSecs - TSExpirySecs);


            //    const timestamp = date.getTime();
            // console.log(timestamp); // 👉️ 1650931200000

            if (totalTokenElapsedTimeinSecs <= 3600) {
                //token is still good

                var newPassword = generateP();

                const salt = genSaltSync(10);
                const  password = hashSync(newPassword, salt);


                var getNewPass = new Promise(function (resolve, reject) {
                    var studentCPDB = "";
                    var sqlquery = "SELECT * FROM admin WHERE email='" + email+"'";

                    connection.query(sqlquery, function (error1, results1) {
                        if (error1) {
                            studentCPDB = "";
                            console.error(error1);
                            return;
                        } else {
                            let studentRows;

                            if (results1.length > 0) {
                                studentRows = JSON.parse(JSON.stringify(results1));
                                studentCPDB = studentRows[0].admin_id;
                                console.log(studentCPDB);

                                //var xnw= "Your New Password is " + newpassword;
                                console.log(password);



                                var UpdatePasswd = new Promise(function (resolve, reject) {
                                   // var studentNewPassword = newPassword;

                                    var sql12 = "UPDATE admin  SET password='" + newPassword + "' WHERE admin_id= " + studentCPDB;
                                    console.log(sql12);
                                    connection.query(sql12, function (error2, results2) {
                                        if (error2) {
                                            console.error(error2);
                                            return;
                                        } else {

                                             studentNewPassword=password ;

                                            //console.log(results.affectedRows + " record(s) updated");
                                            console.log("New Pass is: " + newPassword);

                                            sendNewPasswordEmail(email, newPassword);

                                            req.flash('message', 'We have e-mailed your new ADMIN password!');
                                            res.redirect('/login');
                                            return;
                                        }

                                        resolve(studentNewPassword);
                                    });

                                });

                               // if (bcryptX1.compareSync(newPassword, password)) {
                             //       console.log("naol compatible");
                             //   }else{
                             //       console.log(" dli compatible");
                             //   }

                                return;
                            } else {
                                return;


                            }

                        }
                        resolve(studentCPDB)
                    });
                });


            } else {
                //token has expirec


                req.flash('error', 'Token has been expired.');
                res.redirect('/login');

            }


            // res.render('Tables/prospectus');

            // res.download(filepath)

            // res.render('Tables/prospectus');


            // res.render('Auth/auth-login', {'message': req.flash('message'), 'error': req.flash('error')});

        });



        //       res.json({ message: 'Password reset successful, you can now login with the new password' });


    });


};