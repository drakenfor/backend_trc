TRC Scanner
## I. Backend TRCScanner
El backend del Scanner siempre debe estar activo para que funcione la aplicación
Mobil, ya que es necesario para que pueda realizar las peticiones

### 1. Reconstrucción de paquetes
Para ejecutar estos comandos, asi como del paso 4 debe tener una consola o terminal
abierta en el directorio raíz del proyecto.  

Para reconstruir paquetes ejecute

```
npm install
```

### 2. Configurar HOST y PORT

en la lista de archivos vaya al archio ``` .env ``` y encontrará lo siguiente

* ```PORT``` puerto del servidor
* ```HOST``` host o ip del servidor

Para configurar solo cambie lo que está despues del igual, caso contrario no funcionará
por ejemlo:   
```PORT=3000```
para cambiar de puerto si gusta a 4200 solo hace falta cambiar el número de la siguente manera    
```PORT=4200```

recomendable dejarlo por defecto

### 3. Configurar la conexión a la base de datos
en el mismo archivo ```.env``` se encuentra lo siguiente

* ```HOST_DB``` Host de la base de datos
* ```PORT_DB``` Puerto de la base de datos
* ```USER_DB``` Nombre de usuario de la base de datos
* ```PASSWORD_DB``` Contraseña de la base de datos
* ```NAME_DB``` nombre de la base de datos de la base de datob

la configuración es igual que en la parte anterior.

#### 4. Iniciar el servidor
Ejecute el siguiente comando en la terminal
```
npm start
```
le debe aparecer un mensaje como este: 

```Servidor online en: 0.0.0.0:3000```

## II. APP Movil
### 1. Instale la aplicación, dando los permisos necesarios.
### 2. Haga click en el engranage y configure el host del servidor, El Adroid id: es el identificador unico del teléfono el cual deberá ponerlo en su base de datos, en el punto de despacho en ```hostname```
### 3. Si hace click en iniciar le aparecera en el backend un mensaje similar a este    
```
{ hostname: '74f76c7066cb881c' }
```
usted puede coger ```74f76c7066cb881c``` y poner en su base de datos, luego iniciar

### 4. Haga click en su nombre de usuario y esto lo llevará a una página donde pondra su contraseña
### 5. Una vez iniciado cesión le aparecerá los Comprantes de pago ya hehco previamente o vacío si es que no hay ninguno, para iniciar uno nuevo precione el boton ```+```

# III. Enjoy!
