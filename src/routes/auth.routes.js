/*
    Path: /Auth
*/
const {request, response} = require('express');
const pool = require('../database/database.conection');

const { Router } = require('express');
const router = Router();

//TODO: Eliminar contraseña de los resultados desde la base de datos
router.post('/auth', async(req = request, res = response) => {
    let body = req.body;
    const response = await pool.query(`
        SELECT * From tb_usuario 
        where tb_usuario_con = '` + body.password + 
        `' and tb_usuario_corele = '`+ body.email + `'
    `);
    
    if (response.rowCount > 0 ){
        res.status(200).json({
            "ok": true,
            "user": {
                "id": response.rows[0]["tb_usuario_id"],
                "apatern": response.rows[0]["tb_usuario_apepat"],
                "amatern": response.rows[0]["tb_usuario_apemat"],
                "name": response.rows[0]['tb_usuario_nom'],
                "email": response.rows[0]["tb_usuario_corele"],
                "username": response.rows[0]["tb_usuario_nic"],
                "estate": response.rows[0]["tb_usuario_est"],
                "type": response.rows[0]["tb_usuario_tip"],
                "perfilId": response.rows[0]["tb_perfil_id"]
            }
        })
    } else {
        return res.status(400).json({
            "ok": false,
            "messaje": "datos incorrectos"
        })
    }

});

router.post('/ip', async(req = request, res = response) => {

    let body = req.body;
    const response = await pool.query(`
        SELECT * From tb_fd_puntodespacho 
        where tb_puntodespacho_anf::text = '{"hostname":"` + body.hostname+ `"}'
    `);

    if(response.rowCount > 0 ){
        res.status(200).json({
            "ok": true,
            "result": {
                "id": response.rows[0]["tb_puntodespacho_id"],
                "cod": response.rows[0]["tb_puntodespacho_cod"] ,
                "name": response.rows[0]["tb_puntodespacho_nom"],
                "hostname": response.rows[0]["tb_puntodespacho_anf"]["hostname"]
            }
        });
    } else {
        return res.status(400).json({
            "ok": false,
            "messaje": "Usuario no disponible"
        })
    }

});

module.exports = router;