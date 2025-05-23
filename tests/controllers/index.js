const FIRST = document.getElementById("first");
const LOGIN = document.getElementById("login");

(async () => {
    if(!localStorage.getItem('authToken')){
        const response = await fetchData('count/users', 'GET');
        if (response && response.count === 0) {
            FIRST.removeAttribute('hidden');
        } else {
            LOGIN.removeAttribute('hidden');
        } 
    } else{
        window.location.href = "dashboard.html";
    }
})();

FIRST.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(FIRST);

    try {
        const response = await fetchData('signup/admin', 'POST', formData);
        if (!response || response.error) {
            throw new Error(response?.message || 'Error en el registro');
        }

        alert('Registro exitoso!');
        // Aquí puedes redirigir o hacer otra acción
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }

    location.reload();
});

LOGIN.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(LOGIN);

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

});

