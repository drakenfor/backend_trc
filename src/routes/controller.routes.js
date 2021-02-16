/*
    Path: comprobante

*/

const { request, response } = require('express');
const pool = require('../database/database.conection');

const { Router } = require('express');
const router = Router();

router.post('/', async(req = require, res = response) => {

    const body = req.body;

    const numser      = body['numser'];
    const numcar      = body['numcar'];
    const numman      = body['numman'];
    const despatchId  = body['despatchId'];
    const orden       = body['orden'];
    const conductorId = body['conductorId'];
    const numcor      = body['numcor'];
    const veihicleId  = body['veihicleId'];
    const ticketId    = body['ticketId'];
    const userId      = body['userId'];

    pool.query(`
        SELECT * 
        FROM sh_empresa_20132062448.fn_fd_select_comprobante_controlador(
            ` + numcar + `,`+ numman + `,` + despatchId + `,` + orden + `, 1, 0)`
    , (error, responseController) => {
        if(error){
            return res.status.json({
                ok: false,
                message: "Error en db controller",
                error
            });
        }

        controller =  responseController.rows[0];

        const opeman        = controller['tb_manguera_ope']
        const condition     = 'E'
        const cantidad      = controller['can']
        const controllerId  = controller['idcontrolador']
        const interfaceDate = new Date(controller['fechahoracontrolador'])
        const computerDate  = new Date(controller['fechahorapc'])
        const combustibleId = controller['tb_combustible_id']
        const hoseId        = controller['tb_manguera_id']
    
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
                return res.status(400).json({
                    ok: false,
                    message: "El ticket ya a sido registrado",
                });
            }

            return res.json({
                ok: true,
                message: 'Despacho finalizada con exíto',
            })

        });
    
        
    

    });



});

router.post('/cotroller', async(req = request, res = response) => {
    const body = req.body;

    const numser        = body['numser'];
    const numcor        = body['numcor'];
    const opeman        = body['opeman'];
    const condition     = 'E'
    const cantidad      = body['cantidad'];
    const controllerId  = body['controllerId'];
    const interfaceDate = body['interfaceDate'];
    const computerDate  = body['computerDate']
    const despatchId    = body['despatchId'];
    const conductorId   = body['conductorId'];
    const veihicleId     = body['veihicleId'];
    const combustibleId = body['combustibleId'];
    const hoseId        = body['hoseId'];
    const ticketId      = body['ticketId'];
    const userId        = body['userId'];

    

    const response = await pool.query(`
        SELECT *
        FROM sh_empresa_20132062448.fn_fd_json_iud_row_comprobante(
        	NULL,
        	NULL,
        	'` + numser        +`',
            '` + numcor        +`',
            NULL,
            NULL,
            '` + opeman        +`',
            '` + condition     +`',
            ` + cantidad      +`,
            ` + controllerId  +`,
            '` + interfaceDate +`',
            '` + computerDate  +`',
            ` + despatchId    +`,
            ` + conductorId   +`,
            ` + veihicleId     +`,
            ` + combustibleId +`,
            ` + hoseId        +`,
            ` + ticketId      +`,
            ` + userId        +`,
            NULL
        )
    `);
   res.json({
       resp: response
   });

});

module.exports = router;