const express = require("express");
const next = require("next");
const bodyParser = require('body-parser')
var cors = require('cors');

//const PORT = process.env.PORT || 3000;
const PORT =3000;
//const dev = process.env.NODE_ENV !== "production";
const dev=false;
const app = next({ dev });
const handle = app.getRequestHandler();

app
    .prepare()
    .then(() => {
        const server = express();
        server.use(cors());
        //Here we are configuring express to use body-parser as middle-ware.
        server.use(bodyParser.json())
        server.use(bodyParser.urlencoded({ extended: true }))

        //var app = express();

        // ADD THIS
        //var cors = require('cors');
    

        const showRoutes = require("./routes/index.js");

        server.use("/api", showRoutes(server));
        /*  server.get("/api/shows", (req, res) => {
              return res.send("we");
          });*/

        server.get("*", (req, res) => {
            return handle(req, res);
        });

        server.listen(PORT, err => {
            if (err) throw err;
            console.log(`> Ready on ${PORT}`);
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });