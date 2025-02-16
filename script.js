document.addEventListener("DOMContentLoaded", () => {
    const userForm = document.getElementById("userForm");
    const userList = document.getElementById("userList");
    const localidadSelect = document.getElementById("localidad");
    const municipioSelect = document.getElementById("municipio");

    // Lista de localidades y municipios de Yucatán (Ejemplo)
    const localidades = {
        "Mérida": ["Mérida"],
        "Valladolid": ["Valladolid"],
        "Tizimín": ["Tizimín"],
        "Umán": ["Umán"],
        "Progreso": ["Progreso"]
    };

    // Llenar el select de localidades
    for (let localidad in localidades) {
        let option = document.createElement("option");
        option.value = localidad;
        option.textContent = localidad;
        localidadSelect.appendChild(option);
    }

    // Cambiar municipios según la localidad seleccionada
    localidadSelect.addEventListener("change", () => {
        municipioSelect.innerHTML = '<option value="">Selecciona un municipio</option>';
        let selectedLocalidad = localidadSelect.value;
        if (localidades[selectedLocalidad]) {
            localidades[selectedLocalidad].forEach(municipio => {
                let option = document.createElement("option");
                option.value = municipio;
                option.textContent = municipio;
                municipioSelect.appendChild(option);
            });
        }
    });

    // Manejar envío del formulario
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
            const response = await fetch("https://reqres.in/api/users", { // API de prueba
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
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

    // Función para agregar usuario a la lista
    function addUserToList(user) {
        const li = document.createElement("li");
        li.textContent = `${user.nombre} ${user.apellidos} - ${user.localidad}, ${user.municipio}`;
        userList.appendChild(li);
    }

    // Cargar lista de usuarios al iniciar (datos de prueba)
    async function loadUsers() {
        try {
            const response = await fetch("https://reqres.in/api/users?page=1"); // API de prueba
            if (!response.ok) throw new Error("Error al cargar usuarios");

            const data = await response.json();
            data.data.forEach(user => {
                const fakeUser = {
                    nombre: user.first_name,
                    apellidos: user.last_name,
                    localidad: "Mérida", // Datos ficticios
                    municipio: "Mérida"
                };
                addUserToList(fakeUser);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    loadUsers();
});
