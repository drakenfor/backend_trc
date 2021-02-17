/*
    Path: comprobante

*/

const { request, response } = require('express');
const pool = require('../database/database.conection');

const { Router } = require('express');
const router = Router();

router.post('/', async (req = require, res = response) => {

    const body = req.body;

    const numcar      = body['numcar'];
    const numman      = body['numman'];
    const despatchId  = body['despatchId'];
    const orden       = body['orden'];
    const conductorId = body['conductorId'];
    const veihicleId  = body['veihicleId'];
    const ticketId    = body['ticketId'];
    const userId      = body['userId'];

    //Comprobar si ya se registro el ticket
    const response = await pool.query(`
        SELECT count(*)
        FROM sh_empresa_20132062448.tb_fd_comprobante
        WHERE tb_valedespacho_id=` + ticketId
    );

    if (response.rows[0]['count'] > 0){
        return res.status(400).json({
            ok: false,
            message: "Ticket ya está registrado"
        });
    }

    pool.query(`
        SELECT * 
        FROM sh_empresa_20132062448.fn_fd_select_comprobante_controlador(
            ` + numcar + `,`+ numman + `,` + despatchId + `,` + orden + `, 1, 0
            )`
    , (error, responseController) => {

        if(error){
            return res.status(500).json({
                ok: false,
                message: "Error en db controller",
                error
            });
        }

        if (responseController.rowCount > 0 ){
            controller =  responseController.rows[0];

            const opeman        = controller['tb_manguera_ope']
            const condition     = 'E'
            const cantidad      = controller['can']
            const controllerId  = controller['idcontrolador']
            const interfaceDate = new Date(controller['fechahoracontrolador'])
            const computerDate  = new Date(controller['fechahorapc'])
            const combustibleId = controller['tb_combustible_id']
            const hoseId        = controller['tb_manguera_id']
    
            let numcor;
            let numser;
    
            pool.query(`
                SELECT * 
                FROM sh_empresa_20132062448.fn_fd_select_numeracion2(
                    null,
                    null,
                    null,
                    null,
                    `+ despatchId +`,
                    null,
                    null,
                    null
                )
            `, (error, response)=>{
    
                if (error){
                    return res.status(400).json({
                        ok: false,
                        message: "Error db al obtener correlativo",
                    });
                }
                
                numser = response.rows[0]["tb_numeracion_numser"]
                numcor = response.rows[0]["tb_numeracion_numcoract"]


                numcor = Number(numcor);
                numcor += 1;
                numcor = String(numcor);
    
                while (numcor.length < 8) {
                    numcor = '0' + numcor;
                }

                pool.query(`
                SELECT *
                FROM sh_empresa_20132062448.fn_fd_json_iud_row_comprobante(
                    'I',
                    NULL,
                    '` + numser        +`',
                    '` + numcor        +`',
                    NULL,
                    NULL,
                    '` + opeman        +`',
                    '` + condition     +`',
                     ` + cantidad      +`,
                     ` + controllerId  +`,
                    '` + interfaceDate.toLocaleDateString() + ' ' + interfaceDate.toLocaleTimeString() +`',
                    '` + computerDate.toLocaleDateString() + ' ' + computerDate.toLocaleTimeString() + `',
                     ` + despatchId    +`,
                     ` + conductorId   +`,
                     ` + veihicleId     +`,
                     ` + combustibleId +`,
                     ` + hoseId        +`,
                     ` + ticketId      +`,
                     ` + userId        +`,
                    NULL
                )
                `, (error, responseComp) => {
                
                    if(error){
                        return res.status(500).json({
                            ok: false,
                            message: "Error al registrar en db",
                            error
                        });
                    }
                
                    return res.json({
                        ok: true,
                        message: 'Despacho finalizada con exíto',
                    })
                
                });


            });

        } else{ //TODO: ver por que dá error

            return res.status(400).json({
                ok: false,
                message: "No hay datos en el controlador"
            });
        }


    });

});

module.exports = router;