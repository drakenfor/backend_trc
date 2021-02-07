/*
    Path: /users
*/
const {request, response} = require('express');
const pool = require('../database/database.conection');

const { Router } = require('express');
const router = Router();

router.get ('/', async(req = request, res = response) => {
    const response = await pool.query(`
        SELECT tb_usuario_corele, tb_usuario_nic 
        FROM tb_usuario 
        WHERE tb_usuario_est = 'A' 
        AND tb_usuario_tip = 'O'
    `);

    let users = []

    response.rows.forEach(element => {
        users.push({
            "email": element["tb_usuario_corele"],
            "username": element["tb_usuario_nic"]
        })
    });

    res.status(200).json({
        "ok": true,
        users
    });
});

module.exports = router;