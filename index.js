const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const connectDB = require('./db');
const PORT = process.env.PORT || 3000;
const app = express();
const routes = require('./routes/index');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.get("/", (req, res) => {
  res.send('Demo APIs - EventFlow. <a href="/api-docs/">Test APIs here</a>.');
})

// Swagger setup
const options = {
  definition: {
    "openapi": "3.0.3",
    "info": {
        "description": "NodeJS API documentation of SSV",
        "version": "1.0.0",
        "title": "SSV APIs"
    },
    "security": [
        {
            "BearerAuth": []
        }
    ],
    "components": {
        "securitySchemes": {
            "BearerAuth": {
                "name": "Authorization",
                "in": "header",
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT",
                "description": "Enter your bearer token in the format Bearer <token>"
            }
        }
    }
}
,
apis: ["./swagger/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Start the server
connectDB()
  .then(() => {


    app.all("/*", (req, res) => {
      res.send('Page Not Found')
    })

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}/`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to DB:', err);
  });

