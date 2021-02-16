/*
    Path: /Auth
*/
const {request, response} = require('express');
const pool = require('../database/database.conection');

const { Router } = require('express');
const router = Router();

router.post('/auth', async(req = request, res = response) => {
    let body = req.body;
    const response = await pool.query(`
        SELECT 
            tb_usuario_id,
            tb_usuario_apepat,
            tb_usuario_apemat,
            tb_usuario_nom,
            tb_usuario_corele,
            tb_usuario_nic,
            tb_usuario_est,
            tb_usuario_tip,
            tb_perfil_id
        FROM sh_empresa_20132062448.tb_usuario
        where tb_usuario_con = '` + body.password + 
        `' and tb_usuario_corele = '`+ body.email + `'
    `,(error, response)=>{
        
        if(error){
            return res.status(500).json({
                "ok": false,
                "messaje": "error en db",
                "error": error
            });
        }

        if (response.rowCount > 0 ){
            return res.json({
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
        }

        return res.status(400).json({
            "ok": false,
            "message": "datos incorrectos"
        });

    });

});

router.post('/ip', async(req = request, res = response) => {

    console.log(req.body);

    let body = req.body;
    const response = await pool.query(`
        SELECT *
        FROM sh_empresa_20132062448.tb_fd_puntodespacho 
        where tb_puntodespacho_anf::text = '{"hostname":"` + body.hostname+ `"}'
    `, (error, response) => {
        if (error){
            return res.status(500).json({
                ok: false,
                message: "error en db",
                error
            });
        }

        if(response.rowCount > 0 ){
            return res.json({
                "ok": true,
                "despacth": {
                    "id": response.rows[0]["tb_puntodespacho_id"],
                    "cod": response.rows[0]["tb_puntodespacho_cod"] ,
                    "name": response.rows[0]["tb_puntodespacho_nom"],
                    "hostname": response.rows[0]["tb_puntodespacho_anf"]["hostname"]
                }
            });
        }

        return res.status(400).json({
            "ok": true,
            "message": "Dispositivo no admitido"
        });
    });
});

module.exports = router;