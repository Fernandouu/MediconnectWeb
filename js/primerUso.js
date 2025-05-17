const verificar = async () => {
    try {
        const response = await postData('http://127.0.0.1:8000/api/paciente', {});

        const { success, data } = response;

        if (success) {
            const { existe } = data;
            console.log("El paciente existe:", existe);
            return existe;

        } else {
            console.log("Error al traer los datos");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
};
