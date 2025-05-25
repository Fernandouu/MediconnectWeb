document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:8000/api/paciente')  // Asegúrate que esta ruta esté correcta en tus rutas Laravel
        .then(response => response.json())
        .then(data => {
            const tabla = document.getElementById('tabla-pacientes');

            if (Array.isArray(data)) {
                tabla.innerHTML = '';
                data.forEach(paciente => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                <td>${paciente.apellido}</td>
                <td>${paciente.nombre}</td>
                <td>
                  <button class="btn btn-primary btn-sm" onclick="abrirModal(${paciente.id})">
                    Agregar Examen
                  </button>
                </td>
              `;
                    tabla.appendChild(fila);
                });
            } else {
                tabla.innerHTML = `<tr><td colspan="4">No hay pacientes disponibles.</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error al cargar pacientes:', error);
        });
});

// Función para abrir el modal
function abrirModal(pacienteId) {
    document.getElementById('patientId').value = pacienteId;
    const modal = new bootstrap.Modal(document.getElementById('examModal'));
    modal.show();
}

// Función para guardar el examen (modificada)
function saveExam() {
    const formData = {
        titulo: document.getElementById('examTitle').value,
        descripcion: document.getElementById('examDescription').value,
        paciente_id: document.getElementById('patientId').value,
        fecha: new Date().toISOString().split('T')[0]
    };

    if (!Object.values(formData).every(Boolean)) {
        alert('Todos los campos son obligatorios');
        return;
    }

    fetch('http://127.0.0.1:8000/api/examenes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Error del servidor');
        return response.json();
    })
    .then(data => {
        alert('Examen guardado!');
        bootstrap.Modal.getInstance(document.getElementById('examModal')).hide();
        document.getElementById('examForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message || 'Error al guardar');
    });
}