console.log("Estoy conectado al HTML");

const urlAPI = "https://reqres.in/api/users?delay=3";
const localStorageKey = "userData";
const btnGetUsers = document.getElementById("btnObtenerUsuarios");
const localStorageTimeLimit_s = 60; //tiempo de vida limite del localStorage en segundos
const sourceHTML = document.getElementById("source");

// Agrega un evento de clic al botón
btnGetUsers.addEventListener("click", function () {
    // Llama a la función getProducts al hacer clic en el botón
    getUsers(urlAPI);
});

const getUsers = (url) => {
    document.getElementById("preloader").style.display = "flex";
    sourceHTML.innerHTML = "";
    // Limpiar el contenido del DOM
    clearDOMContent();
    // Verificar si hay datos en el Local Storage y si han pasado más de 10 segundos
    const storedData = JSON.parse(localStorage.getItem(localStorageKey));
    //tiempo que ha transcurrido desde que se presionó el botón
    const timeSinceBtn_s = Math.round((Date.now() - storedData.timestamp) / 1000);
    //si hay informacion en el localStorage y el tiempo que ha transcurrido desde que se presionó el botón es menor tiempo de vida limite del localStorage en segundos 
    if (storedData && (timeSinceBtn_s < localStorageTimeLimit_s)) {
        // Leer desde el Local Storage si está dentro del límite de tiempo
        console.log("Recuperando datos desde el Local Storage");
        sourceHTML.innerHTML = "Datos recuperados desde el Local Storage. Se obtendrá del API en: " + (localStorageTimeLimit_s - timeSinceBtn_s) + " segundos";
        console.log("Tiempo transcurrido: " + timeSinceBtn_s + " segundos");
        printOnDOM(storedData.data);
        /// Mantener el preloader oculto.
        document.getElementById("preloader").style.display = "none";
        return;
    }
    // Realizando solicitud GET
    fetch(url)
        .then((response) => {
            if (response.status === 200) {
                console.log("Estado de la solicitud: OK");
                return response.json();
            }
        })
        .then((users) => {
            // Guardar en el Local Storage con la marca de tiempo
            const timestamp = Date.now();
            const dataToStore = { data: users.data, timestamp: timestamp };
            localStorage.setItem(localStorageKey, JSON.stringify(dataToStore));
            // Ocultar el preloader después de recibir la respuesta
            document.getElementById("preloader").style.display = "none";
            sourceHTML.innerHTML = "Datos obtenidos del API";
            console.table(dataToStore); // array con 6 usuarios
            printOnDOM(users.data);
        })
        .catch((error) => {
            console.log("Error en la solicitud:", error);
            console.warn("Estado de la respuesta:", error.status);
            // Ocultar el preloader en caso de error
            document.getElementById("preloader").style.display = "none";
        });
};

function generateUserCard({ avatar, first_name, last_name, email }) {
    return `
    <div class="col-sm-12 col-md-6 col-lg-4 mb-3">
    <div class="card swiper-slide ">
        <div class="image-content">
            <span class="overlay"></span>

            <div class="card-image">
                <img src="${avatar}" alt="" class="card-img" />
            </div>
        </div>

        <div class="card-content">
            <h2 class="name">${first_name} ${last_name}</h2>
            <p class="description">${email}</p>
        </div>
    </div>
</div>
    `;
}
function clearDOMContent() {
    // Obtener el contenedor de usuarios y establecer su contenido en blanco
    const usersContainer = document.getElementById("users-container");
    if (usersContainer) {
        usersContainer.innerHTML = "";
    }
}

function printOnDOM(users) {
    const usersContainer = document.getElementById("users-container");

    if (!usersContainer) {
        console.error("Contenedor de usuarios no encontrado");
        return;
    }

    const userHTML = users.map(generateUserCard);
    usersContainer.innerHTML = userHTML.join("");
}


