(async () => {
    const response = await fetchData('user', 'GET');
    document.getElementById("name").innerHTML = `Bienvenido ${response.nombre} ${response.apellido}`;
    document.getElementById("info").innerHTML = `Se encuentra en modo ${response.type}`;
    
    if(response.type=="patient"){
        
    }
})();