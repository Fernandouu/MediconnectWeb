const REGISTRO = document.getElementById("paciente-reg");

(async () => {
    if(localStorage.getItem('authToken')){
        window.location.href = "dashboard.html";
    }
})();

REGISTRO.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(REGISTRO);

    try {
        // 1. Registrar al paciente
        const registerResponse = await fetchData('signup/patient', 'POST', formData);
        
        if (!registerResponse.ok) {
            const errorData = await registerResponse.json();
            let errorMessage = 'Error en el registro';
            
            if (registerResponse.status === 422 && errorData.errors) {
                errorMessage = Object.values(errorData.errors).flat().join('\n');
            } else if (errorData.message) {
                errorMessage = errorData.message;
            }
            
            throw new Error(errorMessage);
        }

        // 2. Obtener credenciales del formulario
        const email = formData.get('email');
        const password = formData.get('password');
        
        // 3. Hacer login automático
        const loginResponse = await fetchData('login', 'POST', new FormData(REGISTRO));
        
        if (!loginResponse.ok) {
            throw new Error('Registro exitoso, pero falló el auto-login');
        }

        // 4. Procesar respuesta del login
        const loginData = await loginResponse.json();
        
        // Verificar que sea paciente (opcional)
        if (loginData.user?.type !== 'patient') {
            localStorage.removeItem('authToken');
            throw new Error('Solo pacientes pueden iniciar sesión aquí');
        }

        // 5. Guardar token y datos
        localStorage.setItem('authToken', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        localStorage.setItem('userEmail', loginData.get('email'));
        
        alert('¡Registro y sesión iniciada con éxito!');
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});