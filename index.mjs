import express from "express";
import hbs from "hbs";
import bodyParser from "body-parser";

const app = express();

import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "hbs");
app.use(express.static("public"));
hbs.registerPartials(__dirname + "/views/partials");

let roommates = [];
let gastos = [];
let roomerModel = {
    id: null,
    name: null,
    debe: null,
    recibe: null,
}


app.get("/", (req, res) => {
    console.log("hola")
  res.send("hola");
});

app.listen(3000, () => {
    console.log("Server on port 3000");
});
