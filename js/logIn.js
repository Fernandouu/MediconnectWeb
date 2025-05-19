//Funcion para iniciar sesión
async function logIn(){
    try {
        // Obtener los valores de los campos del formulario
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // URL de la ruta de la API para el inicio de sesión
        const response = await fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // cuerpo de la peticion (envio de datos)
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error("Respuesta no válida del servidor");
        }
        // Si la respuesta es exitosa, se procesa la respuesta
        const data = await response.json();
        console.log("Inicio de sesión exitoso:", data); 
        sessionStorage.setItem("token", data.token); //Guardar el token para usarlo en otras peticiones y etc.

    } catch (error) {
        console.error("Error al iniciar sesión", error);
    }
}