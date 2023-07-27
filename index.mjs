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
app.use(bodyParser.urlencoded({ extended: false }));
let idGastos = 1;
let roommates = [];
let gastos = [];



app.get("/", (req, res) => {
  console.log("hola");
  res.render("index", { roommates, gastos });
});

app.post("/agregar-gasto", (req, res) => {
  console.log(req.body);
  let roomer;
  for (let i = 0; i < roommates.length; i++) {
    if (roommates[i].id == req.body.room) {
      roomer = roommates[i].nombre;
    }
  
  }
let gastoModel = {
  id: idGastos,
  idroomer: req.body.room,
  roomer: roomer,
  descripcion: req.body.descripcion,
  monto: req.body.monto,
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
  console.log(roommates)
  res.status(200).send("gerenado")
});

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
    user.recibe = totalRecibePorUsuario[user.id] || 0;
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

  // Ajustar los saldos de "recibe" y "debe" para cada usuario según las reglas
  roommates.forEach((user) => {
    if (user.recibe >= user.debe) {
      user.recibe -= user.debe;
      user.debe = 0;
    } else {
      user.debe -= user.recibe;
      user.recibe = 0;
    }
  });
}







