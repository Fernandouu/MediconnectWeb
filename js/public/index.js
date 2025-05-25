const LOGIN = document.getElementById("paciente-login");

(async () => {
    if(localStorage.getItem('authToken')){
        window.location.href = "dashboard.html";
    }
})();

LOGIN.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(LOGIN);

    try {
        const response = await fetchData('login', 'POST', formData);

        if (!response.ok) {
            const errorData = await response.json();
            let errorMessage = 'Error en el inicio de sesión';

            if (response.status === 422 && errorData.errors) {
                errorMessage = Object.values(errorData.errors).flat().join('\n');
            } else if (errorData.message) {
                errorMessage = errorData.message;
            }

            throw new Error(errorMessage);
        }

        // Procesar respuesta exitosa
        const successData = await response.json();

        // Verificar que el tipo de usuario sea "patient"
        if (successData.user?.type !== 'patient') {
            localStorage.removeItem('authToken');
            throw new Error('Login solo para pacientes');
        }

        // Guardar datos en localStorage (CORRECCIÓN AQUÍ)
        localStorage.setItem('authToken', successData.token);
        localStorage.setItem('user', JSON.stringify(successData.user)); // Usar successData en lugar de loginData
        localStorage.setItem('userEmail', formData.get('email'));

        alert(successData.message);
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});