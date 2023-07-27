const btnAgregar = document.getElementById("agregarRoomates");

const enviarPost = {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify("")
}
btnAgregar.addEventListener("click", () => {
    //console.log("entramos");
    fetch("/agregarroomates", enviarPost)
    .then(response =>{
        if(response.status===200){
            console.log("entro");
            location.reload();
        }
    })
});