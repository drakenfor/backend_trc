/*
    Path: ticket
*/
const {request, response, query} = require('express');
const { Router } = require('express');
const pool = require('../database/database.conection');
const router = Router();


//obtener ticket
router.get('/:id', (req = request, res = response) => {

    params = req.params

    pool.query(`
        SELECT * 
        FROM sh_empresa_20132062448.tb_fd_valedespacho
        NATURAL JOIN sh_empresa_20132062448.tb_fd_vehiculo 
        NATURAL JOIN sh_empresa_20132062448.tb_fd_conductor
        NATURAL JOIN sh_empresa_20132062448.tb_fd_combustible
        WHERE tb_valedespacho_id = ` + params['id']
    , (error, response)=>{
        if(error){
            return res.status(500).json({
                ok: false,
                message: "Error en db",
                error
            });
        }

        if (response.rowCount > 0){

            let ticket = response.rows[0];
            return res.status(200).json({
                ok: true,
                ticket: {
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
        }

        return res.status(400).json({
            ok: false,
            message: "Vale de despacho no encontrado"
        });

    });
});

module.exports = router;