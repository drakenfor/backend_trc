# Backend TRCScanner
El backend del escanner siempre debe estar activo para que funcione la aplicación
Movil, ya qu es necesario para que pueda realizar las peticiones

## 1. Reconstrucción de paquetes
Para ejecutar estos comandos, asi como del paso 4 debe tener una consola o terminal
abierta en el directorio raíz del proyecto.  

Para reconstruir paquetes ejecute

```
npm install
```

## 2. Configurar HOST y PORT

en la lista de archivos vaya al archio ``` .env ``` y encontrará lo siguiente

* ```PORT``` puerto del servidor
* ```HOST``` host o ip del servidor

Para configurar solo cambie lo que está despues del igual, caso contrario no funcionará
por ejemlo: 
```PORT=3000```
para cambiar de puerto si gusta a 4200 solo hace falta cambiar el número de la siguente manera
```PORT=4200```

recomendable dejarlo por defecto

## 3. Configurar la conexion a la base de datos
en el mismo archivo ```.env``` se encuentra lo siguiente

* ```HOST_DB``` Host de la base de datos
* ```PORT_DB``` Puerto de la base de datos
* ```USER_DB``` Nombre de usuario de la base de datos
* ```PASSWORD_DB``` Contraseña de la base de datos
* ```NAME_DB``` nombre de la base de datos de la base de datob

la configuración es igual que en la parte anterior.

## 4. Iniciar el servidor
Ejecute el siguiente comando en la terminal
```
npm start
```
le debe aparecer un mensaje como este: 

```Servidor corriendo en :  0.0.0.0 : 3000```

## 2. Enjoy! 