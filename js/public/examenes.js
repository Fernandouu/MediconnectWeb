const contenedorExamenes = document.getElementById("container-cards");;
// const user = JSON.parse(sessionStorage.getItem("user"));


async function fetchExamenes() {
    try {
        
        const idPaciente = localStorage.getItem('pacienteId');
        const response = await fetch(`http://127.0.0.1:8000/api/pacientes/"${idPaciente}"/examenes`);
        if (!response.ok) {
            throw new Error('Error al obtener los exámenes');
        }

        const data = await response.json();
        const examenes = data.examenes; 

        const contenedor = document.getElementById("container-cards");
        contenedor.innerHTML = ''; 

        examenes.forEach(examen => {
            const card = document.createElement('div');
            card.classList.add('main-container-cards');
            card.innerHTML = `
                <h3>${formatearFecha(examen.fecha)}</h3>
                <br>
                <p>${examen.titulo || 'Sin titulo disponible.'}</p>
                <p>${examen.descripcion || 'Sin descripción disponible.'}</p>
            `;
            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

// Utilidad para convertir fecha YYYY-MM-DD → DD/MM/YY
function formatearFecha(fecha) {
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y.slice(2)}`;
}



window.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    fetchExamenes();


    if (user && user.nombre) {
        document.getElementById("userName").textContent = user.nombre;
    }
});

