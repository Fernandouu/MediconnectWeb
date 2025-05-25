const EDIT_PROFILE = document.getElementById("editProfileForm");

(async () => {
    if(!localStorage.getItem('authToken')){
        window.location.href = "index.html";
        return;
    }

    try {
        const pacienteId = localStorage.getItem('pacienteId');
        if (!pacienteId) {
            throw new Error('No se encontró el ID del paciente');
        }

        const response = await fetchData(`paciente/${pacienteId}`, 'GET');

        if (!response.ok) {
            const errorData = await response.json();
            let errorMessage = 'Error al obtener datos del paciente';

            if (response.status === 422 && errorData.errors) {
                errorMessage = Object.values(errorData.errors).flat().join('\n');
            } else if (errorData.message) {
                errorMessage = errorData.message;
            }

            throw new Error(errorMessage);
        }

        const pacienteData = await response.json();

        if (pacienteData.paciente?.user?.type !== 'patient') {
            throw new Error('Datos no corresponden a un paciente');
        }

        document.getElementById('nombre-data').textContent = pacienteData.paciente.nombre;
        document.getElementById('apellido-data').textContent = pacienteData.paciente.apellido;
        document.getElementById('correo-data').textContent = pacienteData.paciente.user.email;

        localStorage.setItem('userData', JSON.stringify({
            nombre: pacienteData.paciente.nombre,
            apellido: pacienteData.paciente.apellido,
            email: pacienteData.paciente.user.email
        }));

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
        if (error.message.includes('autenticación') || error.message.includes('token')) {
            localStorage.removeItem('authToken');
            window.location.href = "index.html";
        }
    }
})();

EDIT_PROFILE.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(EDIT_PROFILE);

    try {
        const reponse = await fetchData('paciente/update/'+localStorage.getItem('pacienteId'), 'POST', formData);
        
        if (!reponse.ok) {
            const errorData = await reponse.json();
            let errorMessage = 'Error en la actualizacion';
            
            if (reponse.status === 422 && errorData.errors) {
                errorMessage = Object.values(errorData.errors).flat().join('\n');
            } else if (errorData.message) {
                errorMessage = errorData.message;
            }
            
            throw new Error(errorMessage);
        }
        
        alert('¡Actualización correcta!');
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});