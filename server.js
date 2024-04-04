//import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const { verifyToken } = require("./validation");

//swagger dependencies
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

//setup swagger 
const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

//import routes
const wineRoutes = require("./routes/wine");
const authRoutes = require("./routes/auth");

require('dotenv-flow').config(); //environment variables from .env file 

//parse request of content-type JSON
app.use(bodyParser.json());

//connect to MongoDB
mongoose.set('strictQuery',false);
mongoose.connect( 
    process.env.DBHOST, //the connection string
    {
        useUnifiedTopology:true,
        useNewUrlParser: true
    }
);//.catch(error => console.log("Error connecting to MongoDB:" + error));

//event listener
mongoose.connection.once('open', () => console.log('Connected successfully to MongoDB'));

//routes
app.get("/api/welcome", (req, res) => {
    res.status(200).send({ message: "Welcome to the REST API" }); //200 means OK
})
//post, put, delete, get -> CRUD
app.use("/api/wine", verifyToken ,wineRoutes);
app.use("/api/user", authRoutes);

// /api/wine/login
const PORT = process.env.PORT || 5501; //environment variable PORT or 5501

//starts the server
app.listen(PORT, function() {
    console.log("Server is running on Port:" + PORT);
})
//npm start i terminalen for at starte serveren
module.exports = app;