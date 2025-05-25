// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api'; // Cambia por la URL de tu API Laravel

// Función para obtener doctores desde Laravel API
async function fetchDoctors() {
    try {
        const response = await fetch(`${API_BASE_URL}/doctores`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Agrega token de autenticación si es necesario
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
    }
}

// Función para obtener pacientes (para llenar select en el modal)
async function fetchPatients() {
    try {
        const response = await fetch(`${API_BASE_URL}/paciente`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        return [];
    }
}

// Función para cargar y mostrar doctores
async function loadDoctors() {
    try {
        const doctors = await fetchDoctors();
        const tableBody = document.getElementById('doctorsTableBody');
        
        tableBody.innerHTML = doctors.map(doctor => `
            <tr class="info-holder">
                <td>${doctor.apellidos}</td>
                <td>${doctor.nombres}</td>
                <td>${doctor.area}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="openExamModal(${doctor.id})">
                        Agregar Examen
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar doctores:', error);
        document.getElementById('doctorsTableBody').innerHTML = 
            '<tr><td colspan="4" class="text-center text-danger">Error al cargar datos</td></tr>';
    }
}

// Función para cargar pacientes en el select
async function loadPatientsInSelect() {
    try {
        const patients = await fetchPatients();
        const select = document.getElementById('patientId');
        
        // Limpiar opciones existentes (excepto la primera)
        select.innerHTML = '<option value="">Seleccione un paciente...</option>';
        
        // Agregar pacientes al select
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.nombres} ${patient.apellidos}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

// Variable para almacenar el ID del doctor seleccionado
let selectedDoctorId = null;

// Función para abrir el modal de examen
async function openExamModal(doctorId) {
    selectedDoctorId = doctorId;
    
    // Cargar pacientes en el select
    await loadPatientsInSelect();
    
    const modal = new bootstrap.Modal(document.getElementById('examModal'));
    modal.show();
}

// Función para guardar el examen en Laravel API
async function saveExam() {
    const title = document.getElementById('examTitle').value;
    const patientId = document.getElementById('patientId').value;
    const description = document.getElementById('examDescription').value;
    
    if (!title || !patientId || !description) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    // Crear objeto de examen para enviar a Laravel
    const examData = {
        doctor_id: selectedDoctorId,
        titulo: title,
        paciente_id: patientId,
        descripcion: description
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/examenes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Agrega token de autenticación si es necesario
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(examData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Examen guardado:', result);
        
        // Mostrar mensaje de éxito
        alert('Examen agregado exitosamente');
        
        // Limpiar formulario
        document.getElementById('examForm').reset();
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('examModal'));
        modal.hide();
        
    } catch (error) {
        console.error('Error al guardar examen:', error);
        alert('Error al guardar el examen. Por favor intente nuevamente.');
    }
}

// Cargar doctores al iniciar la página
document.addEventListener('DOMContentLoaded', loadDoctors);