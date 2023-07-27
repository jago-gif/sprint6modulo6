const btnAgregar = document.getElementById("agregarRoomates");
const agregarGasto = document.getElementById("agregarGasto");
const enviarPost = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}), 
};

btnAgregar.addEventListener("click", () => {
  fetch("/agregarroomates", enviarPost).then((response) => {
    if (response.status === 200) {
      console.log("entro");
      location.reload();
    }
  });
});

agregarGasto.addEventListener("click", () => {
  const room = document.getElementById("room").value;
  const descripcion = document.getElementById("descripcion").value;
  const monto = document.getElementById("monto").value;

  const data = { room, descripcion, monto }; // datos para enviar

 const enviarPostGasto = {
   method: "POST",
   headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // si uno pone esto deja enviar un objeto
   },
   body: JSON.stringify(data), //se le carga el objeto al cuerpo del metodo post
 };

fetch("/agregar-gasto", enviarPostGasto)
  .then((response) => {
    if (response.status === 200) {
      location.reload();
    }
  })
  .catch((error) => {
    console.error("Error en la solicitud fetch:", error);
  });
});

