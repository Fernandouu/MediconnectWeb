(async () => {

    if(!localStorage.getItem('authToken')){
        window.location.href = "index.html";
    }

    const response = await fetchData('user', 'GET');
    document.getElementById("name").innerHTML = `Bienvenido ${response.nombre} ${response.apellido}`;
    document.getElementById("info").innerHTML = `Se encuentra en modo ${response.type}`;
})();

document.getElementById("logout").addEventListener("click", async function (e) {
    e.preventDefault();

    localStorage.clear();
    alert("Sesión Cerrada");
    location.reload();
});