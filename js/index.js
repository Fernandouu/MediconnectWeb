async function signUpAdmin() {
    try {
        // Obtener los valores de los campos del formulario
        const nombreAdmin = document.getElementById("nombreAdmin").value;
        const apellidoAdmin = document.getElementById("apellidoAdmin").value;
        const emailAdmin = document.getElementById("emailAdmin").value;
        const passwordAdmin = document.getElementById("passwordAdmin").value;
        const passwordAdmin2 = document.getElementById("passwordAdmin2").value;

        // constante fullname para guardar el nombre completo juntando nombre y apellido
        const fullName = `${nombreAdmin} ${apellidoAdmin}`; 

        // URL de la ruta de la API para el registro de administradores
        const response = await fetch("http://127.0.0.1:8000/api/signup/admin", {
            // metodo de la peticion segun la API
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // cuerpo de la peticion (envio de datos )
            body: JSON.stringify({
                name: fullName, 
                email: emailAdmin,
                password: passwordAdmin,
                password_confirmation: passwordAdmin2 
            })
        });
        // Verificar si la respuesta es exitosa
        // Si la respuesta no es exitosa, se lanza un error

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Respuesta del servidor:", errorText);
            throw new Error("Respuesta no válida del servidor");
        }
        // Si la respuesta es exitosa, se procesa la respuesta
        const data = await response.json();
        console.log("Usuario creado correctamente:");
        window.location.href = "../html/logInAdmin.html"; // Redirigir a la página de inicio después de crear el usuario

    } catch (error) {
        console.error("Error al crear usuario", error);
    }
}
