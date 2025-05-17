
//Funciones para tener dos pasos en el registro

let currentStep = 1;

function showStep(step) {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((stepDiv, index) => {
        stepDiv.classList.remove('active');
        if (index === step - 1) {
            stepDiv.classList.add('active');
        }
    });
}

// Función para dar al paso 2
function nextStep() {
    currentStep++;
    showStep(currentStep);
    let textoLogin = document.getElementById("parrafoForm");
    textoLogin.innerHTML = "Ultimos datos para el registro";
}

// Función para dar al paso 1
function prevStep() {
    currentStep--;
    showStep(currentStep);
}

async function signUpDoc(event) {
    event.preventDefault();
    try {
        // Obtener los valores de los campos del formulario
        const nombreDoc = document.getElementById("nombreDoc").value;
        const apellidoDoc = document.getElementById("apellidoDoc").value;
        const emailDoc = document.getElementById("emailDoc").value;
        const passwordDoc = document.getElementById("passwordDoc").value;
        const passwordDoc2 = document.getElementById("passwordDoc2").value;
        const clinicaDoc = document.getElementById("clinicaDoc").value;
        const imagenDoc = document.getElementById("imagenDoc").files[0];


        const formData = new FormData();
        formData.append("nombre", nombreDoc);
        formData.append("apellido", apellidoDoc);
        formData.append("email", emailDoc);
        formData.append("password", passwordDoc);
        formData.append("password_confirmation", passwordDoc2);
        formData.append("clinica_diaria", clinicaDoc);
        formData.append("imagen", imagenDoc);



        const response = await fetch("http://127.0.0.1:8000/api/signup/doctor", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Respuesta del servidor:", errorText);
            throw new Error("Respuesta no válida del servidor");
        }

        const data = await response.json();
        console.log("Usuario creado correctamente:", data);
        window.location.href = "../html/logInAdmin.html";

    } catch (error) {
        console.error("Error al crear usuario", error);
    }
}