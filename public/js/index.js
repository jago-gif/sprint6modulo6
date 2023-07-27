const btnAgregar = document.getElementById("agregarRoomates");
const agregarGasto = document.getElementById("agregarGasto");
const enviarPost = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}), // Empty object for now, will be updated for each request
};

btnAgregar.addEventListener("click", () => {
  // ... other code ...
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

  const data = { room, descripcion, monto }; // Data to be sent in the request

 const enviarPostGasto = {
   method: "POST",
   headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
   },
   body: JSON.stringify(data),
 };

fetch("/agregar-gasto", enviarPostGasto)
  .then((response) => {
    if (response.status === 200) {
      console.log("entro");
      location.reload();
    }
  })
  .catch((error) => {
    console.error("Error en la solicitud fetch:", error);
  });

  console.log(document.getElementById("formGastos"));
});
