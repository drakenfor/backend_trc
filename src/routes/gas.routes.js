/*
    Path: gas
*/

const {request, response, query} = require('express');
const { Router } = require('express');
const pool = require('../database/database.conection');
const router = Router();

router.get('/:id', async(req = request, res = response) => {
    let id = req.params['id'];

    const response = await pool.query(`
        SELECT * 
        FROM tb_fd_manguera
        NATURAL JOIN tb_fd_isla
        WHERE tb_fd_isla.tb_puntodespacho_id = ` + id + 
        `ORDER BY tb_isla_id`
        );

    let mangueras = response.rows;

    if(mangueras.length > 0 ){

        let islas = [];

        let length = mangueras[mangueras.length - 1]['tb_isla_id'];

        for (let index = 1; index <= length; index++) {
            let isla = {
                "id": index,
                "mangueras": []
            }
            mangueras.forEach((element) => {
                if (element['tb_isla_id'] === index ){
                    isla['mangueras'].push({
                        "etiqueta": element['tb_manguera_eti'],
                        "operation": element['tb_manguera_ope']
                    });
                }
            });
            islas.push(isla);
        }

        res.status(200).json({
            "ok": true,
            islas
        });
    } else {
        res.status(400).json({
            "ok": false,
            "message": "sin mangeras disponibles"
        });
    }

});

module.exports = router;