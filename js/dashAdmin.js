window.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user && user.nombre) {
        document.getElementById("UserName").textContent = user.nombre;
    } else {
        window.location.href = "logInAdmin.html";
    }
});


