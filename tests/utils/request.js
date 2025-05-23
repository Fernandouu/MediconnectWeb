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

        if (!RESPONSE.ok) {
            console.error(`Error HTTP: ${RESPONSE.status} ${RESPONSE.statusText}`);
            return null;
        }

        const contentType = RESPONSE.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await RESPONSE.json();
        } else {
            console.warn('Respuesta no JSON:', await RESPONSE.text());
            return null;
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        return null;
    }
};

