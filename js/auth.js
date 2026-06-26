function login() {

const user =
document
.getElementById("user")
.value

const pass =
document
.getElementById("pass")
.value

if (
user === "admin"
&&
pass === "123"
){

localStorage.setItem(
"logado",
"true"
)

window.location.href =
"./dashboard.html"

}else{

alert(
"Usuário ou senha inválidos"
)

}

}