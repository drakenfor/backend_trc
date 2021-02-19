/*
Path: comprobante

*/

const { request, response, json } = require('express');
const pool = require('../database/database.conection');

const { Router } = require('express');
const router = Router();

router.post('/', async (req = require, res = response) => {
    
    const body = req.body;
    
    const numcar        = body['numcar'];
    const numman        = body['numman'];
    const despatchId    = body['despatchId'];
    const orden         = body['orden'];
    const conductorId   = body['conductorId'];
    const veihicleId    = body['veihicleId'];
    const ticketId      = body['ticketId'];
    const userId        = body['userId'];
    const quantity      = body['quantity'];

    const opeman        = body['opeman']
    const combustibleId = body['combustibleId']
    const hoseId        = body['hoseId']
    
    const condition     = 'E'

    let controllerId = null;
    let cantidad = quantity;
    let fDate = null;
    let cDate = null; 
    
    if(!quantity){
        if(quantity === 0){
            return res.status(400).json({
                ok: false,
                message: "La cantidad debe ser mayor que 0 ."
            });
        }
    }
            
    //Comprobar si ya se registro el ticket
    let response = await pool.query(`
        SELECT count(*)
        FROM sh_empresa_20132062448.tb_fd_comprobante
        WHERE tb_valedespacho_id=` + ticketId
    );
    
    if (response.rows[0]['count'] > 0){
        return res.status(400).json({
            ok: false,
            message: "El vale de despacho ya fue antendido."
        });
    }
    
    response = await pool.query(`
        SELECT * 
        FROM sh_empresa_20132062448.tb_fd_valedespacho
        WHERE tb_valedespacho_con = 'B' 
        AND tb_valedespacho_id = `+ ticketId
    );
    
    if(response.rowCount > 0 ){
        return res.status(400).json({
            ok: false,
            message: "Valde de despacho está dado de baja."
        });
    }
    
    let responseController;

    if(opeman === 'C'){
        try {
            responseController = await pool.query(`
            SELECT * 
            FROM sh_empresa_20132062448.fn_fd_select_comprobante_controlador(
                ` + numcar + `,`+ numman + `,` + despatchId + `,` + orden + `, 1, 0
                )`
                ,);
            
            if (responseController.rowCount > 0 ){
                const controller =  responseController.rows[0];
                
                controllerId  = controller['idcontrolador']
                cantidad      = controller['can'];
                const interfaceDate = new Date(controller['fechahoracontrolador'])
                const computerDate  = new Date(controller['fechahorapc'])

                fDate = "'"+interfaceDate.toLocaleDateString() + " " + interfaceDate.toLocaleTimeString() + "'";
                cDate  = "'"+computerDate.toLocaleDateString() + " " + computerDate.toLocaleTimeString() + "'";
                
                console.log(fDate);
                console.log(cDate);
            
            } else{ //TODO: ver por que dá error
        
                return res.status(400).json({
                    ok: false,
                    message: "No hay datos en el controlador."
                });
            }
                        
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: "Error en db controller.",
                error
            });
        }
    }
    
    
    


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
                message: "Error db al obtener correlativo.",
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
            ` +  cantidad      +`,
            ` +  controllerId  +`,
            ` +  fDate  +`,
            ` +  cDate + `,
            ` +  despatchId    +`,
            ` +  conductorId   +`,
            ` +  veihicleId     +`,
            ` +  combustibleId +`,
            ` +  hoseId        +`,
            ` +  ticketId      +`,
            ` +  userId        +`,
            NULL
            )
            `, (error, responseComp) => {
                if(error){
                    return res.status(500).json({
                        ok: false,
                        message: "Vale de despacho no encontrado.",
                        error
                    });
                }
        
            return res.json({
                ok: true,
                message: 'Despacho finalizada con exíto.',
            })
        
        });


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
                message: "Error al obtener la lista de comprobantes.",
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
                condition: voucher['tb_comprobante_con'],
            });
        });

        if (vouchers.length === 0){
            return res.json(
                {
                    ok: false,
                    message: 'Aun no hay vales de despacho antendidos.'
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