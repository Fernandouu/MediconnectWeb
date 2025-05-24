window.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log(user);
    console.log(user.nombre);

    if (user && user.nombre) {
        document.getElementById("UserName").textContent = user.nombre;
    } else {
        window.location.href = "index.html";
    }
});
