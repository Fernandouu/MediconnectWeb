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

        const successData = await response.json();

        if (successData.user?.type !== 'patient') {
            localStorage.removeItem('authToken');
            throw new Error('Login solo para pacientes');
        }

        localStorage.setItem('authToken', successData.token);
        localStorage.setItem('pacienteId', successData.user.paciente_id);

        alert(successData.message);
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});