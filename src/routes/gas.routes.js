/*
    Path: gas
*/

const {request, response, query} = require('express');
const { Router } = require('express');
const pool = require('../database/database.conection');
const router = Router();

//Mangueras por islas
router.get('/:id', async(req = request, res = response) => {
    let id = req.params['id'];

    const response = await pool.query(`
        SELECT * 
        FROM sh_empresa_20132062448.tb_fd_manguera
        NATURAL JOIN sh_empresa_20132062448.tb_fd_isla
        WHERE tb_fd_isla.tb_puntodespacho_id = ` + id + 
        `ORDER BY tb_isla_id`, 
        (error, response) => {
            if(error){
                return res.status(500).json({
                    ok: false,
                    message: "Error en db",
                    error
                });
            }

            let hoses = response.rows;

            if(hoses.length > 0 ){
        
                let islas = [];
        
                let length = hoses[hoses.length - 1]['tb_isla_id'];
        
                for (let index = 1; index <= length; index++) {
                    let isla = {
                        "id": index,
                        "hoses": []
                    }
                    hoses.forEach((element) => {
                        if (element['tb_isla_id'] === index ){
                            isla['hoses'].push({
                                "etiqueta": element['tb_manguera_eti'],
                                "operation": element['tb_manguera_ope'],
                                "face": element['tb_manguera_numcar'],
                                "number": element['tb_manguera_num'],
                            });
                        }
                    });
                    islas.push(isla);
                }
        
                return res.json({
                    ok: true,
                    islas,
                    retsults: islas.length
                });
            }
            

            return res.status(400).json({
                "ok": false,
                "message": "sin mangeras disponibles"
            });

        });

});

module.exports = router;