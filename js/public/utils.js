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

        // Devuelve la respuesta completa, incluso si hay errores HTTP (4xx, 5xx)
        return RESPONSE;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error; // Propaga el error para que el código del formulario lo maneje
    }
};

