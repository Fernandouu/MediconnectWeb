window.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user && user.nombre) {
        document.getElementById("UserName").textContent = user.nombre;
    } else {
        window.location.href = "logInAdmin.html";
    }
});

const DOCTORFORM = document.getElementById("formAddDoctor");


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


    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});
