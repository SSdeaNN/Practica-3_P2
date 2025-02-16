document.addEventListener("DOMContentLoaded", () => {
    const userForm = document.getElementById("userForm");
    const userList = document.getElementById("userList");
    const localidadSelect = document.getElementById("localidad");
    const municipioSelect = document.getElementById("municipio");

    const API_URL = "http://localhost:3000"; 

  
    async function loadLocalidades() {
        try {
            const response = await fetch(`${API_URL}/localidades`);
            if (!response.ok) throw new Error("Error al obtener localidades");
            
            const localidades = await response.json();
            localidades.forEach(localidad => {
                let option = document.createElement("option");
                option.value = localidad.nombre;
                option.textContent = localidad.nombre;
                localidadSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando localidades:", error);
        }
    }

 
    localidadSelect.addEventListener("change", async () => {
        municipioSelect.innerHTML = '<option value="">Selecciona un municipio</option>';
        let selectedLocalidad = localidadSelect.value;
        if (!selectedLocalidad) return;

        try {
            const response = await fetch(`${API_URL}/municipios/${selectedLocalidad}`);
            if (!response.ok) throw new Error("Error al obtener municipios");

            const municipios = await response.json();
            municipios.forEach(municipio => {
                let option = document.createElement("option");
                option.value = municipio.nombre;
                option.textContent = municipio.nombre;
                municipioSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando municipios:", error);
        }
    });

   
    userForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            nombre: document.getElementById("nombre").value,
            apellidos: document.getElementById("apellidos").value,
            direccion: document.getElementById("direccion").value,
            localidad: localidadSelect.value,
            municipio: municipioSelect.value
        };

        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Error al enviar datos");

            const newUser = await response.json();
            addUserToList(newUser);
            userForm.reset();
        } catch (error) {
            console.error("Error:", error);
        }
    });

 
   function addUserToList(user) {
    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${user.nombre} ${user.apellidos}</strong>
        <p>${user.direccion}</p>
        <small>${user.localidad}, ${user.municipio}</small>
    `;
    userList.appendChild(li);
}

   
    async function loadUsers() {
        try {
            const response = await fetch(`${API_URL}/usuarios`);
            if (!response.ok) throw new Error("Error al cargar usuarios");

            const users = await response.json();
            users.forEach(user => addUserToList(user));
        } catch (error) {
            console.error("Error:", error);
        }
    }

    loadLocalidades();
    loadUsers();
});
