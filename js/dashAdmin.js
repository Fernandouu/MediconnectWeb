window.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    sessionStorage.getItem('token')


    if (user && user.nombre) {
        document.getElementById("UserName").textContent = user.nombre;
    } else {
        window.location.href = "logInAdmin.html";
    }

    fetch('http://127.0.0.1:8000/api/doctores')
        .then(response => response.json())
        .then(data => {
            const tabla = document.getElementById('tabla-doctores');


            if (Array.isArray(data.doctores)) {

                // Limpiar la tabla antes de agregar nuevos datos
                tabla.innerHTML = '';
                data.doctores.forEach(doctor => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
        <td>${doctor.apellido}</td>
        <td>${doctor.nombre}</td>
        <td>${doctor.area_doctor || ''}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="abrirModal(${doctor.id})">
                Editar Doctor
            </button>
             <button class="btn btn-primary btn-sm" onclick="deleteDoctor(${doctor.id})">
                Eliminar Doctor
            </button>
        </td>
    `;
                    tabla.appendChild(fila);
                });

            } else {
                tabla.innerHTML = `<tr><td colspan="4">No hay doctores agregados .</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error al cargar doctores:', error);
        });
});

function deleteDoctor(doctorId) {
    document.getElementById('doctorId').value = doctorId;

    if (!confirm("¿Estás seguro de que deseas eliminar este perfil de doctor?")) {
        return;
    }

    fetch(`http://127.0.0.1:8000/api/doctores/${doctorId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Error al eliminar el doctor');
                });
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Doctor eliminado correctamente');
            location.reload(); 
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
}


function abrirModal(doctorId) {
    document.getElementById('doctorId').value = doctorId;
    const modal = new bootstrap.Modal(document.getElementById('doctorModal'));
    modal.show();
}



// Función para editar el doctor
function editDoctor() {
    const token = sessionStorage.getItem("token");
    const doctorId = document.getElementById('doctorId').value;

    const formData = new FormData();
    formData.append('nombre', document.getElementById('nombreDoc').value);
    formData.append('apellido', document.getElementById('apellidoDoc').value);
    formData.append('email', document.getElementById('emailDoc').value);
    formData.append('password', document.getElementById('passDoc').value);
    formData.append('imagen', document.getElementById('imagenDoc').files[0]);
    formData.append('area_doctor', document.getElementById('areaDoc').value);
    formData.append('fecha', new Date().toISOString().split('T')[0]);

    for (let [key, value] of formData.entries()) {
        if (!value) {
            alert(`El campo ${key} es obligatorio`);
            return;
        }
    }

    fetch(`http://127.0.0.1:8000/api/doctores/update/${doctorId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
        .then(response => response.text())
        .then(text => {
            // JSON.parse(text) si quieres convertir manualmente
        })
        .then(data => {
            alert('Doctor actualizado correctamente');
            bootstrap.Modal.getInstance(document.getElementById('doctorModal')).hide();
            document.getElementById('doctorActForm').reset();
        })
}



const DOCTORFORM = document.getElementById("formAddDoctor");


// Agregar un doctor
DOCTORFORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(DOCTORFORM);

    try {
        const response = await fetchData('signup/doctor', 'POST', formData);

        if (!response.ok) {
            const errorData = await response.json();
            let errorMessage = 'Error al crear el doctor';

            if (response.status === 422 && errorData.errors) {
                errorMessage = Object.values(errorData.errors).flat().join('\n');
            } else if (errorData.message) {
                errorMessage = errorData.message;
            }

            throw new Error(errorMessage);
        }

        const successData = await response.json();
        alert(successData.message);
        DOCTORFORM.reset();


    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});
