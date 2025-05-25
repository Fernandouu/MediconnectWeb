// Configuración de la API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Variables globales
let selectedDoctorId = null;
const user = JSON.parse(sessionStorage.getItem("user"));

// Función para obtener doctores desde Laravel API
async function fetchDoctors() {
    try {
        const response = await fetch(`${API_BASE_URL}/doctores`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': user?.token ? `Bearer ${user.token}` : ''
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error al obtener los doctores: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para obtener pacientes
async function fetchPatients() {
    try {
        const response = await fetch(`${API_BASE_URL}/paciente`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': user?.token ? `Bearer ${user.token}` : ''
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error al obtener los pacientes: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Función para cargar y mostrar doctores
async function loadDoctors() {
    try {
        const doctors = await fetchDoctors();
        const tableBody = document.getElementById('doctorsTableBody');
        
        if (!tableBody) {
            console.error('Elemento doctorsTableBody no encontrado');
            return;
        }
        
        tableBody.innerHTML = '';
        
        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.classList.add('info-holder');
            row.innerHTML = `
                <td>${doctor.apellidos || 'Sin apellidos'}</td>
                <td>${doctor.nombres || 'Sin nombres'}</td>
                <td>${doctor.area || 'Sin área especificada'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="openExamModal(${doctor.id})">
                        Agregar Examen
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar doctores:', error);
        const tableBody = document.getElementById('doctorsTableBody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar datos</td></tr>';
        }
    }
}

// Función para cargar pacientes en el select
async function loadPatientsInSelect() {
    try {
        const patients = await fetchPatients();
        const select = document.getElementById('patientId');
        
        if (!select) {
            console.error('Elemento patientId select no encontrado');
            return;
        }
        
        // Limpiar opciones existentes
        select.innerHTML = '<option value="">Seleccione un paciente...</option>';
        
        // Agregar pacientes al select
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.nombres || ''} ${patient.apellidos || ''}`.trim();
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

// Función para abrir el modal de examen
async function openExamModal(doctorId) {
    selectedDoctorId = doctorId;
    
    // Cargar pacientes en el select
    await loadPatientsInSelect();
    
    const modalElement = document.getElementById('examModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } else {
        console.error('Modal examModal no encontrado');
    }
}

// Función para guardar el examen en Laravel API
async function saveExam() {
    const titleElement = document.getElementById('examTitle');
    const patientElement = document.getElementById('patientId');
    const descriptionElement = document.getElementById('examDescription');
    
    if (!titleElement || !patientElement || !descriptionElement) {
        console.error('Elementos del formulario no encontrados');
        return;
    }
    
    const title = titleElement.value.trim();
    const patientId = patientElement.value;
    const description = descriptionElement.value.trim();
    
    if (!title || !patientId || !description) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    // Crear objeto de examen para enviar a Laravel
    const examData = {
        doctor_id: selectedDoctorId,
        titulo: title,
        paciente_id: parseInt(patientId),
        descripcion: description
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/examenes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': user?.token ? `Bearer ${user.token}` : ''
            },
            body: JSON.stringify(examData)
        });
        
        if (!response.ok) {
            throw new Error(`Error al guardar el examen: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Examen guardado:', result);
        
        // Mostrar mensaje de éxito
        alert('Examen agregado exitosamente');
        
        // Limpiar formulario
        const form = document.getElementById('examForm');
        if (form) {
            form.reset();
        }
        
        // Cerrar modal
        const modalElement = document.getElementById('examModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar el examen. Por favor intente nuevamente.');
    }
}

// Utilidad para formatear fecha (si la necesitas)
function formatearFecha(fecha) {
    if (!fecha) return 'Sin fecha';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y.slice(2)}`;
}

// Inicialización cuando el DOM esté listo
window.addEventListener("DOMContentLoaded", () => {
    // Cargar doctores
    loadDoctors();
    
    // Actualizar nombre de usuario si existe
    if (user && user.nombre) {
        const userNameElement = document.getElementById("UserName");
        if (userNameElement) {
            userNameElement.textContent = user.nombre;
        }
    }
});