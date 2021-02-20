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

        // --- Comprobar si ya se registro el ticket
    
    let response = await pool.query(`
        SELECT count(*)
        FROM sh_empresa_20132062448.tb_fd_comprobante
        WHERE tb_valedespacho_id=` + params['id']
    );
    
    if (response.rows[0]['count'] > 0){
        return res.status(400).json({
            ok: false,
            message: "El vale de despacho ya fue antendido."
        });
    }


    // --- Ver si el vale de despacho esta dado de baja
    
    response = await pool.query(`
        SELECT * 
        FROM sh_empresa_20132062448.tb_fd_valedespacho
        WHERE tb_valedespacho_con = 'B' 
        AND tb_valedespacho_id = `+ params['id']
    );
    
    if(response.rowCount > 0 ){
        return res.status(400).json({
            ok: false,
            message: "Vale de despacho está dado de baja."
        });
    }

    pool.query(`
    select * from sh_empresa_20132062448.fn_fd_select_valedespacho(
        `+ params['id'] +`,
        null,
        null,
        null,
        null,
        null,
        null,
        1,
        0
    )`
    , (error, response)=>{
        if(error){
            return res.status(500).json({
                ok: false,
                message: "Error en db",
                error
            });
        }
        
        if (response.rowCount > 0){

            const date = new Date(response.rows[0]['tb_valedespacho_fechoremi']);
            const local =date.toLocaleDateString() + ' ' +date.toLocaleTimeString();

            let ticket = response.rows[0];
            return res.status(200).json({
                ok: true,
                ticket: {
                    "id": params['id'],
                    "serie": ticket['tb_valedespacho_numser']+ '-' + ticket['tb_valedespacho_numcor'],
                    "emitionDate": local,
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
                    "combustibleId": ticket['tb_combustible_id'],
                }
            })
        }

        return res.status(400).json({
            ok: false,
            message: "Vale de despacho no encontrado."
        });

    });
});

module.exports = router;