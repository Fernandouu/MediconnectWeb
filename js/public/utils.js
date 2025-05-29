const SERVER_URL = 'http://localhost:8000/api/';

const fetchData = async (filename, method = 'GET', body = null) => {
    const token = localStorage.getItem('authToken');

    const OPTIONS = {
        method: method.toUpperCase(),
        headers: {}
    };

    if (token) {
        OPTIONS.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body instanceof FormData) {
        OPTIONS.body = body;
    } else if (body) {
        OPTIONS.body = JSON.stringify(body);
        OPTIONS.headers['Content-Type'] = 'application/json';
    }

    try {
        const PATH = new URL(SERVER_URL + filename);
        const RESPONSE = await fetch(PATH.href, OPTIONS);

        return RESPONSE;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
};

function logout() {
    // Eliminar todos los items del localStorage
    localStorage.clear();
    
    // Redirigir a la página de inicio
    window.location.href = "index.html";
    
    // Opcional: Prevenir cualquier acción adicional
    return false;

    
}

function logoutAdminDoctor() {
    // Eliminar todos los items del localStorage
    localStorage.clear();
    
    // Redirigir a la página de inicio
    window.location.href = "logInAdmin.html";
    
    // Opcional: Prevenir cualquier acción adicional
    return false;
}


