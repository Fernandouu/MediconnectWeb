async function signUpUsuario() {
    try {
        const nombreUsuario = document.getElementById("nombreUsuario").value;
        const apellidoUsuario = document.getElementById("apellidoUsuario").value;
        const emailUsuario = document.getElementById("correoUsuario").value;
        const passUsuario = document.getElementById("contrasenaUsuario").value;
        const passUsuario2 = document.getElementById("confirmarContrasenaUsuario").value;

        const response = await fetch("http://127.0.0.1:8000/api/signup/patient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombreUsuario,
                apellido: apellidoUsuario,
                email: emailUsuario,
                password: passUsuario,
                password_confirmation: passUsuario2
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Errores de validación:", data.errors || data.message);
            alert("Error: " + (data.message || "No se pudo registrar"));
            return;
        }

        console.log("Usuario creado correctamente:", data);
        window.location.href = "../html/logInUsuario.html";
    } catch (error) {
        console.error("Error al crear usuario:", error);
        alert("Error inesperado. Consulta la consola.");
    }
}
