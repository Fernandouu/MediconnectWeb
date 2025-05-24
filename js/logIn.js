const LOGIN = document.getElementById("loginForm");

async function logInUsuarios() {
    try {
        const formData = new FormData(LOGIN); 

        const payload = Object.fromEntries(formData.entries()); // convierte FormData a objeto JSON

        const response = await fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Error: " + (errorData.error || "Error al iniciar sesión"));
            return;
        }

        const data = await response.json();

        // Guardar token y usuario
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        // Redirigir según tipo de usuario
        switch (data.user.type) {
            case 'admin':
                window.location.href = "dashDoctor.html";
                break;
            case 'doctor':
                window.location.href = "dashAdminPaciente.html";
                break;
            case 'patient':
                window.location.href = "dashUser.html";
                break;
            default:
                alert("Tipo de usuario desconocido");
                break;
        }

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Hubo un problema al iniciar sesión. Intenta de nuevo.");
    }
}
