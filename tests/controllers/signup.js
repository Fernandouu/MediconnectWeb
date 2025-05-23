const SIGNUP = document.getElementById("signup");

(async () => {
    if(localStorage.getItem('authToken')){
        window.location.href = "dashboard.html";
    }
})();

SIGNUP.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(SIGNUP);

    try {
        const response = await fetchData('signup/patient', 'POST', formData);
        if (!response || response.error) {
            throw new Error(response?.message || 'Error en el registro');
        }

        alert('Registro exitoso!');

        try {
            const response = await fetchData('login', 'POST', formData);
            if (!response || response.error) {
                throw new Error(response?.message || 'Error en el ingreso');
            }
    
            localStorage.setItem('authToken', response.token);
            alert('Ingreso exitoso!');
            
            location.reload();
    
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
            
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }

    location.reload();
});