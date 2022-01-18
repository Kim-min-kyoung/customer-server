// import 구문 --> require
const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const fs = require('fs');
const dataj = fs.readFileSync("./database.json");
const parseData = JSON.parse(dataj);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: parseData.host,
    user: parseData.user,
    password: parseData.password,
    port: parseData.port,
    database: parseData.database
})

app.use(express.json()) // json형식의 데이터를 처리할 수 있도록 설정
app.use(cors()) // 브라우저의 다양한 사용을 위해 설정

// app 서버 셋팅
app.get('/customers', async(req, res) => {
    connection.query(
        "SELECT * FROM customers",
        (err, rows, fields) => {
            res.send(rows);
        }
    )
})

app.post('/createcustomer', async(req, res) => {
    res.send('등록되었습니다.')
})

// 셋팅한 app을 실행
app.listen(port, () => {
    console.log('고객서버가 돌아가고 있습니다.');
})