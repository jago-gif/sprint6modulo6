const btnAgregar = document.getElementById("agregarRoomates");
const agregarGasto = document.getElementById("agregarGasto");
const btnEditar = document.getElementById("editar");


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




document.addEventListener("DOMContentLoaded", function () {
  const editarBotones = document.querySelectorAll(".editarGasto");
  editarBotones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const gastoId = boton.dataset.id;
      let envia = { gastoId };
      let getGasto = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(envia),
      };
      console.log(gastoId);
      console.log(getGasto)
      fetch("/get-gasto", getGasto)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        }).then((data) => {
          console.log(data);
          document.getElementById("roomModal").value = data.roomer;
          document.getElementById("descripcionModal").value = data.descripcion;
          document.getElementById("montoModal").value = data.monto;
          document.getElementById("idGasto").value = data.id;
        })
        .catch((error) => {
          console.error("Error en la solicitud fetch:", error);
        });
    });
  });

  //aquí mandamos el metodo para borrar
const botonesBorrar = document.querySelectorAll(".borrarGasto");
  botonesBorrar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const gastoId = boton.dataset.id;
      let envia = { gastoId };
      let getBorrar = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(envia),
      };
      fetch("/borrar-gasto", getBorrar)
        .then((response) => {
          if (response.status === 200) {
            location.reload();
          }
    });
  });

  })
});

btnEditar.addEventListener("click", () => {
  const room = document.getElementById("roomModal").value;
  const descripcion = document.getElementById("descripcionModal").value;
  const monto = document.getElementById("montoModal").value;
  const idGasto = document.getElementById("idGasto").value;

  const data = { room, descripcion, monto, idGasto }; // datos para enviar

 const enviarPostGasto = {
   method: "PUT",
   headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // si uno pone esto deja enviar un objeto
   },
   body: JSON.stringify(data), //se le carga el objeto al cuerpo del metodo post
 };

fetch("/editar-gasto", enviarPostGasto)
  .then((response) => {
    if (response.status === 200) {
      location.reload();
    }
  })
  .catch((error) => {
    console.error("Error en la solicitud fetch:", error);
  })
  })