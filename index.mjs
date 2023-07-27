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

function calcularGastos(){
 let cantidadAdividir= roommates.length;
  roommates.forEach((user)=>{
    console.log("jklhaskdjhaskdjhaskjdhkjashdkjashdkajhsdkjas")
   let userRecibe = 0
   gastos.forEach((gasto) =>{
  if (user.id === gasto.idroomer) {
    let recibe = parseInt(gasto.monto);
    console.log(recibe);
    userRecibe += recibe / cantidadAdividir;
    user.recibe = userRecibe;
    roommates.forEach((u)=>{
      if(u.id!=user.id){
        if (parseInt(u.recibe) > 0) {
          u.recibe = parseInt(u.recibe) - userRecibe;
        }else{
        u.debe = userRecibe;
        }
        
      }
    })
  }
  })
  
  })

 

 
  console.log(roommates)
}
