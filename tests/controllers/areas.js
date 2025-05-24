(async () => {
    if(!localStorage.getItem('authToken')){
        window.location.href = "index.html";
    }


    const fetchData = async (endpoint, method) => {
        // Tu implementación de fetchData
    };
    
    (async () => {
        try {
        const response = await fetchData('areas', 'GET');
        if (!response || response.error) {
            throw new Error(response?.message || 'Error de Conexión');
        }
    
        const tableBody = document.getElementById('areas-table-body');
        
        // Limpiar tabla si ya tenía datos
        tableBody.innerHTML = '';
        
        // Añadir cada área como una fila en la tabla
        response.areas.forEach(area => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = area.nombre;
            row.appendChild(cell);
            tableBody.appendChild(row);
        });
        
        } catch (error) {
        console.error('Error al cargar las áreas:', error);
          // Puedes mostrar el error en la interfaz si lo deseas
        }
    })();


    
})();

const ADDAREA = document.getElementById("AddArea")

ADDAREA.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(ADDAREA);

    try {
        const response = await fetchData('areas', 'POST', formData);
        if (!response || response.error) {
            throw new Error(response?.message || 'Discrepancia de credenciales, cierre sesión y vuelva a intentarlo');
        }

        alert('Inserción exitosa!');
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }

    location.reload();
});