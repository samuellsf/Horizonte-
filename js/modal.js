function abrirModal(id){

const v=

frota.find(

x=>

x.id===id

)

modal.style.display=
"flex"

titulo.innerHTML=
v.id

status.innerHTML=
v.status

}

function fecharModal(){

modal.style.display=
"none"

}