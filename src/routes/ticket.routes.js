/*
    Path: ticket
*/
const {request, response, query} = require('express');
const { Router } = require('express');
const pool = require('../database/database.conection');
const router = Router();


//obtener ticket
router.get('/:id', async(req = request, res = response) => {

    params = req.params

    const response  = await pool.query(`
        SELECT * 
        FROM sh_empresa_20132062448.tb_fd_valedespacho
        NATURAL JOIN sh_empresa_20132062448.tb_fd_vehiculo 
        NATURAL JOIN sh_empresa_20132062448.tb_fd_conductor
        NATURAL JOIN sh_empresa_20132062448.tb_fd_combustible
        WHERE tb_valedespacho_id = ` + params['id']
    );

    if (response.rowCount > 0){

        let ticket = response.rows[0];
        res.status(200).json({
            "ok": true,
            "tik": ticket,

            "ticket": {
                "id": params['id'],
                "serie": ticket['tb_valedespacho_numser']+ '-' + ticket['tb_valedespacho_numcor'],
                "emitionDate": ticket['tb_valedespacho_fechoremi'],
                "reference": ticket['tb_valedespacho_ref'],
                "conductor": ticket['tb_conductor_apenom'],
                "combusiteble": ticket['tb_combustible_nom'],
                "unity" : ticket['tb_combustible_unimed'],
                "placa": ticket['tb_vehiculo_numpla'],
                "model": ticket['tb_vehiculo_mar'],
                "carga": ticket['tb_vehiculo_car'],
                "type": ticket['tb_vehiculo_tip'],
                "quantity": ticket['tb_valedespacho_can'],
                "conductorId": ticket['tb_conductor_id'],
                "vehicleId": ticket['tb_vehiculo_id'],
            }
        })
    } else {
        res.status(400).json({
            "ok": false,
            "message": "Ticket no encontrado"
        });
    }
});

module.exports = router;