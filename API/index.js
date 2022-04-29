const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');


const JWTSecret = "iufbbdfkjbvsfbvkjsberjvbnerljsvbia";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function auth(req, res, next) {

    const authToken = req.headers['authorization'];

    if (authToken != undefined) {
        const bearer = authToken.split(' ');
        const token = bearer[1];

        jwt.verify(token, JWTSecret, (err, data) => {
            if (err) {
                res.status(401);
                res.json({ err: "Token invalido" })
            } else {
                req.token = token;
                req.loggedUser = { id: data.id, email: data.email };
                next();
            }
        });

    } else {
        res.status(401);
        res.json({ err: "Token inválido!" });
    }
}

var DB = {
    games: [
        {
            id: 23,
            title: 'Call of duty MW',
            year: 2019,
            price: 60
        },
        {
            id: 65,
            title: 'Sea of Thieves',
            year: 2018,
            price: 40
        },
        {
            id: 2,
            title: 'Ghost of Tsushima',
            year: 2020,
            price: 170
        }
    ],
    users: [
        {
            id: 1,
            name: "GabrielS",
            email: "gabrielsaturnino4@gmail.com",
            password: "kjzbfjvsbva"
        },
        {
            id: 2,
            name: "Saturno",
            email: "saturnino@gmail.com",
            password: "saturno69"
        }
    ]
}

app.get('/games', auth, (req, res) => {

    var HATEOAS = [
        {
            href: "http://localhost:3000/game/0",
            method: "DELETE",
            rel: "delete_game"
        },
        {
            href: "http://localhost:3000/game/0",
            method: "GET",
            rel: "get_game"
        },
        {
            href: "http://localhost:3000/auth",
            method: "POST",
            rel: "login"
        }
    ];

    res.json({ user: req.loggedUser, games: DB.games, _links: HATEOAS });
});

app.get('/game/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        var game = DB.games.find(g => g.id == id);

        var HATEOAS = [
            {
                href: "http://localhost:3000/game/" + id,
                method: "DELETE",
                rel: "delete_game"
            },
            {
                href: "http://localhost:3000/game/" + id,
                method: "PUT",
                rel: "edit_game"
            },
            {
                href: "http://localhost:3000/game/" + id,
                method: "GET",
                rel: "get_game"
            },
            {
                href: "http://localhost:3000/games",
                method: "GET",
                rel: "get_all_games"
            }
        ];

        if (game != undefined) {
            res.json({game: game, _link: HATEOAS});
            res.sendStatus(200)
        } else {
            res.sendStatus(404);
        }
    }
});

app.post('/game', auth, (req, res) => {
    var { title, year, price } = req.body;

    if (title != undefined) {
        if (!isNaN(year)) {
            if (!isNaN(price)) {
                DB.games.push({
                    id: 77,
                    title,
                    year,
                    price
                });
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
});

app.delete('/game/:id', auth, (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        var index = DB.games.findIndex(g => g.id == id);

        if (index == -1) {
            res.sendStatus(404);
        } else {
            DB.games.splice(index, 1);
            res.sendStatus(200);
        }
    }
});

app.put('/game/:id', auth, (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        var game = DB.games.find(g => g.id == id);

        if (game != undefined) {
            var { title, year, price } = req.body;

            if (title != undefined) game.title = title;
            if (year != undefined) game.year = year;
            if (price != undefined) game.price = price;
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    }

});

app.post("/auth", (req, res) => {
    var { email, password } = req.body;

    if (email != undefined) {
        if (password != undefined) {

            var user = DB.users.find(u => u.email == email);
            if (user != undefined) {
                if (user.password == password) {

                    jwt.sign({ id: user.id, email: user.email },
                        JWTSecret,
                        { expiresIn: "48h" },
                        (err, token) => {

                            if (err) {
                                res.status(400);
                                res.json({ err: "Falha interna!" });
                            } else {
                                res.status(200);
                                res.json({ token: token });
                            }
                        });

                } else {
                    res.status(401);
                    res.json({ err: "Senha invalida!" });
                }
            } else {
                res.status(404);
                res.json({ err: "Email não encontrado!" });
            }
        } else {
            res.status(400);
            res.json({ err: "Senha inválida!" });
        }
    } else {
        res.status(400);
        res.json({ err: "Email inválido!" });
    }
});

app.listen(3000, () => {
    console.log("API está rodando na porta 3000!");
});


// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnYWJyaWVsc2F0dXJuaW5vNEBnbWFpbC5jb20iLCJpYXQiOjE2NTEwMDA4NzEsImV4cCI6MTY1MTE3MzY3MX0.4FjXWWl5nqEJ3tNEdy92LHww_WSr5qMsn37xzgH0TvU"
