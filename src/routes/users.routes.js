/*
    Path: /users
*/
const {request, response} = require('express');
const pool = require('../database/database.conection');

const { Router } = require('express');
const router = Router();

router.get ('/', (req = request, res = response) => {
    pool.query(`
        SELECT tb_usuario_corele, tb_usuario_nic 
        FROM sh_empresa_20132062448.tb_usuario 
        WHERE tb_usuario_est = 'A' 
        AND tb_usuario_tip = 'O'
    `, (error, response)=>{
        if(error){
            return res.status(500).json({
                ok: false,
                message: "Error en db",
                error
            });
        }

        let users = []

        response.rows.forEach(element => {
            users.push({
                "email": element["tb_usuario_corele"],
                "username": element["tb_usuario_nic"]
            })
        });

        return res.json({
            "ok": true,
            users,
            resluts: users.length
        });

    });
});

module.exports = router;