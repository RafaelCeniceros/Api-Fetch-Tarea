console.log("Estoy conectado al html");


const urlAPI = "https://reqres.in/api/users?delay=3";

const getProducts = (url) => {
    document.getElementById("preloader").style.display = "flex";
    // Realizando solicitud Get
    fetch(url)
        .then((response) => {
            if (response.status == 200) {
                console.log("status of request: OK"); // Confirmar estado solicitud 
                return response.json();
            }
        })
        .then(users => {
            // Ocultar el preloader después de recibir la respuesta
            document.getElementById("preloader").style.display = "none"
            console.log(users.data); //array con 6 usuarios
            printOnDOM(users.data);

        })
        .catch((error) => {
            console.log("Error en la solicitud:");
            console.warn(error);
            console.warn("Estado de la respuesta:", error.status);
            console.warn("Texto de estado:", error.statusText);
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

function printOnDOM(users) {
    const usersContainer = document.getElementById("users-container");

    if (!usersContainer) {
        console.error("Contenedor de usuarios no encontrado");
        return;
    }

    const userHTML = users.map(generateUserCard);
    usersContainer.innerHTML = userHTML.join("");
}


const btnGetUsers = document.getElementById("btnObtenerUsuarios");

// Agrega un evento de clic al botón
btnObtenerUsuarios.addEventListener("click", function () {
    // Llama a la función getProducts al hacer clic en el botón
    getProducts(urlAPI);
});


