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
connection.connect();
// app 서버 셋팅, 게시글 전체조회
app.get('/customers', async(req, res) => {
    connection.query(
        "SELECT * FROM customers",
        (err, rows, fields) => {
            res.send(rows);
        }
    )
})

// 해당 c_no 게시글 조회
app.get('/customer/:id', async(req, res) => {
    const param = req.params;
    connection.query(
        `SELECT * FROM customers WHERE c_no = ${param.id}`,
        (err, rows, fields) => {
            res.send(rows);
        }
    )
})

// post전송 테이블에 항목을 insert
// app.porst(경로, 함수 )
// insert into 테이블명(컬럼명1, 컬럼명2, 컬럼명3...) values (값1, 값2, 값3...)
// 
app.post('/addCustomer', async(req, res) => {
    const { c_name, c_phone, c_birthday, c_gender, c_addr } = req.body;
    // console.log(req.body);
    connection.query('insert into customers(c_name, c_phone, c_birthday, c_gender, c_addr) values (?, ?, ?, ?, ?);',
    [c_name, c_phone, c_birthday, c_gender, c_addr],
    function (err, result, fields){
        console.log(result);
    })
    res.send('그린컴퓨터');
})

// 삭제
// delete from 테이블명 where 컬럼명 = 값
app.delete('/customer/:id', async(req, res) => {
    const param = req.params;
    connection.query(`DELETE FROM customers WHERE c_no = ${param.id}`,(err, rows, fields) => {
        res.send(rows);
    })
})

// 수정
// update 테이블명 set 필드이름 = 값 where 필드명 = 값
app.post('/editCustomer/:id', async(req, res) => {
    const param = req.params;
    const { c_name, c_phone, c_birthday, c_gender, c_addr } = req.body;
    console.log(req.body);
    connection.query(`update customers set c_name='${c_name}', c_phone='${c_phone}', c_birthday='${c_birthday}', c_gender='${c_gender}', c_addr='${c_addr}' where c_no = ${param.id}`,
    function (err, result, fields) {
        console.log(result,err);
    }) 
    
}) 


// app.post('/createcustomer', async(req, res) => {
//     res.send('등록되었습니다.')
// })

// 셋팅한 app을 실행
app.listen(port, () => {
    console.log('고객서버가 돌아가고 있습니다.');
})