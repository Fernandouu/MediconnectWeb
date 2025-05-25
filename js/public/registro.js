const REGISTRO = document.getElementById("paciente-login");

(async () => {
    if(localStorage.getItem('authToken')){
        window.location.href = "dashboard.html";
    }
})();

REGISTRO.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(REGISTRO);

    try {
        const response = await fetchData('signup/patient', 'POST', formData);

        if (!response.ok) {
            const errorData = await response.json();
            let errorMessage = 'Error en el registro';

            if (response.status === 422 && errorData.errors) {
                errorMessage = Object.values(errorData.errors).flat().join('\n');
            } else if (errorData.message) {
                errorMessage = errorData.message;
            }

            throw new Error(errorMessage);
        }
        const successData = await response.json();
        alert('Registro exitoso: ' + successData.message);


    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});
