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
    let quantity      = body['quantity'];

    //Comprobar si ya se registro el ticket
    let response = await pool.query(`
        SELECT count(*)
        FROM sh_empresa_20132062448.tb_fd_comprobante
        WHERE tb_valedespacho_id=` + ticketId
    );

    if (response.rows[0]['count'] > 0){
        return res.status(400).json({
            ok: false,
            message: "El Ticket ya está registrado"
        });
    }

    response = await pool.query(`
        SELECT * 
        FROM sh_empresa_20132062448.tb_fd_valedespacho
        WHERE tb_valedespacho_con = 'B' 
        AND tb_valedespacho_id = `+ ticketId
    );

    console.log(response);

    if(response.rowCount > 0 ){
        return res.status(400).json({
            ok: false,
            message: "El Titcket está dado de baja"
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
            const controllerId  = controller['idcontrolador']
            const interfaceDate = new Date(controller['fechahoracontrolador'])
            const computerDate  = new Date(controller['fechahorapc'])
            const combustibleId = controller['tb_combustible_id']
            const hoseId        = controller['tb_manguera_id']
            const cantidad      = quantity? quantity : controller['can'];

            console.log('La cantidad es: '+cantidad);
    
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
                            message: "Ticket no encontrado",
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

router.get('/:id/:rows', (req = request, res = response) => {

    const id = req.params['id'];
    const rows = req.params['rows']

    pool.query(`
        SELECT *
        FROM sh_empresa_20132062448.fn_fd_select_comprobante(
            null,
            null,
            null,
            null,
            null,
            null,
            `+ id +`,
            null,
            null,
            `+ rows +`,
            0
        )
    `, (error, vouchersDB) => {

        if (error)
            return res.status(500).json({
                ok: false,
                message: "Error al obtener la lista de vauchers",
                error
            });

        vouchers = [];

        vouchersDB.rows.forEach(voucher => {
            vouchers.push({
                hose: voucher['tb_manguera_eti'],
                ticketId: voucher['tb_valedespacho_id'],
                serie: voucher['tb_valedespacho_numser'],
                correlative: voucher['tb_valedespacho_numcor'],
                type: voucher['tb_vehiculo_tip'],
                mark: voucher['tb_vehiculo_mar'],
                placa: voucher['tb_vehiculo_numpla'],
                driver: voucher['tb_conductor_apenom'],
                quantity: voucher['tb_comprobante_can'],
                fuel: voucher['tb_combustible_nom'],
                unity: voucher['tb_combustible_unimed'],
            });
        });

        if (vouchers.length === 0){
            return res.json(
                {
                    ok: false,
                    message: 'Aun no hay vouchers registrados :c'
                }
            )
        }

        return res.json({
            ok: true,
            vouchers
        })

        }
    );
});

module.exports = router;