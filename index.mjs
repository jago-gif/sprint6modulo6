import express from "express";
import hbs from "hbs";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import https from "https";


//recuperar ruta raiz
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//fin recuperación ruta raiz



const app = express();
app.set("view engine", "hbs");
app.use(express.static("public"));
hbs.registerPartials(__dirname + "/views/partials");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
let idGastos = 1;
let roommates = [];
let gastos = [];

roommates = leerRommate();
gastos = leerGastos();

app.get("/", (req, res) => {
 
  res.render("index", { roommates, gastos });
});

app.post("/agregar-gasto", (req, res) => {
  const data = JSON.parse(Object.keys(req.body)[0]);

  let roomer;
  for (let i = 0; i < roommates.length; i++) {
    if (roommates[i].id == data.room) {
      roomer = roommates[i].nombre;
    }
  
  }
let gastoModel = {
  id: uuidv4(),
  idroomer: data.room,
  roomer: roomer,
  descripcion: data.descripcion,
  monto: data.monto,
};
  gastos.push(gastoModel);
  idGastos++;
  calcularGastos()

 res.render("index", {roommates ,gastos});
});

app.post("/agregarroomates", async (req, res) => {
  const usuario = await generarUser()
  let roomModel = {
    id: uuidv4(),
    nombre: usuario,
    debe: 0,
    recibe: 0
  };
  roommates.push(roomModel);
  calcularGastos();
  res.status(200).send("gerenado")
});

app.post("/get-gasto",  (req, res) => {
  console.log(req.body);
  const id = req.body.gastoId;
  console.log(id)
  encontrarGasto(res, id);
});

app.delete("/borrar-gasto", (req, res) => {
  const id = req.body.gastoId;
  gastos = gastos.filter((gasto) => {
    return gasto.id != id;
  })
  calcularGastos()
  res.status(200).send("borrado");
})


app.put("/editar-gasto", (req, res) => {
  const data = JSON.parse(Object.keys(req.body)[0]);
  console.log(data);
  gastos.forEach((gasto) => {
    if (gasto.id == parseInt(data.idGasto)) {
      console.log(gasto);
      gasto.descripcion = data.descripcion;
      gasto.monto = data.monto;
    }
  });
  calcularGastos();
  res.status(200).send("editado");
})

app.listen(3000, () => {
  console.log("Server on port 3000");
});

function generarUser(){
    return new Promise((resolve, reject) => {
      const url = 'https://randomuser.me/api/';
      https.get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try{
            const usuario =
              JSON.parse(body).results[0].name.first + " "+
              JSON.parse(body).results[0].name.last;
            resolve(usuario);
          }catch{
            reject(error)
          }
        
        });
      })
})
}
function encontrarGasto(res,id){
gastos.forEach((gasto) => {
  if (gasto.id == parseInt(id)) {
    res.status(200).send(gasto);
  } 
});
    res.status(404).send("no encontrado");
}


function calcularGastos() {

  let cantidadUsuarios = roommates.length;

  // Inicializar un objeto para almacenar el total a recibir por cada usuario
  let totalRecibePorUsuario = {};

  // Calcular el total a recibir por cada usuario dividido entre la cantidad de usuarios
  gastos.forEach((gasto) => {
    let montoPorUsuario = gasto.monto / cantidadUsuarios;
    if (!totalRecibePorUsuario[gasto.idroomer]) {
      totalRecibePorUsuario[gasto.idroomer] = montoPorUsuario;
    } else {
      totalRecibePorUsuario[gasto.idroomer] += montoPorUsuario;
    }
  });

  // Reiniciar los saldos de "recibe" y "debe" para todos los usuarios
  roommates.forEach((user) => {
    user.recibe = (totalRecibePorUsuario[user.id] * (cantidadUsuarios-1) )|| 0;
    user.debe = 0;
  });

  // Calcular los saldos de "debe" para cada usuario
  roommates.forEach((user) => {
    roommates.forEach((otherUser) => {
      if (user.id !== otherUser.id) {
        user.debe += totalRecibePorUsuario[otherUser.id] || 0;
      }
    });
  });

  roommates.forEach((user) => {
    if (user.recibe >= user.debe) {
      user.recibe -= user.debe;
      user.debe = 0;
    } else {
      user.debe -= user.recibe;
      user.recibe = 0;
    }
  });
  crearArchivos();
}

function leerGastos() {
  

   fs.readFile("./data/gastos.json", "utf8", (err, data) => {
    if (err) {
      console.log("Error al leer el archivo gastos.json:", err);
    } else {
      gastos = JSON.parse(data);
      console.log("Archivo gastos.json cargado exitosamente.");
    }
  });

  return gastos
}
function leerRommate(){
  fs.readFile("./data/roommates.json", "utf8", (err, data) => {
    if (err) {
      console.log("Error al leer el archivo roommates.json:", err);
    } else {
      roommates = JSON.parse(data);
      console.log(data);
      console.log(roommates);
      console.log("Archivo roommates.json cargado exitosamente.");
    }
  });
  return roommates
}


function crearArchivos(){
  fs.writeFile("./data/roommates.json", JSON.stringify(roommates), (err) => {
    if (err) {
      console.log("Error al escribir el archivo roommates.json:", err);
    } else {
      console.log("Archivo roommates.json guardado exitosamente.");
    }
  })

  fs.writeFile("./data/gastos.json", JSON.stringify(gastos), (err) => {
    if (err) {
      console.log("Error al escribir el archivo gastos.json:", err);
    } else {
      console.log("Archivo gastos.json guardado exitosamente.");
    }
  })

}












