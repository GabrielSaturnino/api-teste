var axiosConfig = {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
    }
}

function login() {
    var loginEmail = document.getElementById("loginEmail");
    var loginPassword = document.getElementById("loginPassword");

    var email = loginEmail.value;
    var password = loginPassword.value;

    axios.post("http://localhost:3000/auth", {
        email,
        password
    }).then(response => {
        var token = response.data.token;
        localStorage.setItem("token", token);
        axiosConfig.headers.Authorization = "Bearer" + localStorage.getItem("token");
    }).catch(err => {
        alert("Login inválido!");
    });
}

function creatGame() {
    var titleInput = document.getElementById("title");
    var yearInput = document.getElementById("year");
    var priceInput = document.getElementById("price");

    var game = {
        title: titleInput.value,
        year: yearInput.value,
        price: priceInput.value
    }

    axios.post("http://localhost:3000/game", game, axiosConfig).then(response => {
        if (response.status == 200) alert("Jogo Salvo!");
    }).catch(err => {
        console.log(err);
    });
}

function loadForm(listItem) {
    var id = listItem.getAttribute("data-id");
    var title = listItem.getAttribute("data-title");
    var year = listItem.getAttribute("data-year");
    var price = listItem.getAttribute("data-price");

    document.getElementById("idEdit").value = id;
    document.getElementById("titleEdit").value = title;
    document.getElementById("yearEdit").value = year;
    document.getElementById("priceEdit").value = price;
}

function updateGame(game) {
    var idInput = document.getElementById("idEdit");
    var titleInput = document.getElementById("titleEdit");
    var yearInput = document.getElementById("yearEdit");
    var priceInput = document.getElementById("priceEdit");

    var game = {
        title: titleInput.value,
        year: yearInput.value,
        price: priceInput.value
    }

    var id = idInput.value;

    axios.put("http://localhost:3000/game/" + id, game,axiosConfig).then(response => {
        if (response.status == 200) alert("Jogo Atualizado!");
    }).catch(err => {
        console.log(err)
    });
}

function deleteGame(game) {
    var id = game.getAttribute('data-id');
    axios.delete("http://localhost:3000/game/" + id, axiosConfig).then(response => {
        alert("Jogo deletado!");
    }).catch(err => {
        console.log(err);
    })

}

axios.get("http://localhost:3000/games", axiosConfig).then(response => {
    var games = response.data;
    var list = document.getElementById("games");

    games.games.forEach(game => {
            
        var item = document.createElement("li");

        item.setAttribute("data-id", game.id);
        item.setAttribute("data-title", game.title);
        item.setAttribute("data-year", game.year);
        item.setAttribute("data-price", game.price);

        var btnUpdate = document.createElement("button");
        btnUpdate.innerHTML = "Atualizar";
        btnUpdate.addEventListener("click", () => {
            loadForm(item);
        });

        var btnDelete = document.createElement("button");
        btnDelete.innerHTML = "Deletar";
        btnDelete.addEventListener("click", () => {
            deleteGame(item);
        })

        item.innerHTML = `

        ID produto: ${game.id} ||
        Nome do Jogo: ${game.title}||
        Preço do jogo: ${game.price}`;

        list.appendChild(item);
        list.appendChild(btnUpdate);
        list.appendChild(btnDelete);
    });

}).catch(err => {
    console.log(err)
});
