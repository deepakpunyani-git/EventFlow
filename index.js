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
const nodemailer = require("nodemailer");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.get("/", async (req, res) => {

  // Create a transporter with AOL SMTP settings
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, 
    secure: process.env.EMAIL_secure,
    debug: true, 
    auth: {
        user: process.env.EMAIL_USER, // Remove any invisible characters
        pass: process.env.EMAIL_PASSWORD // Provide your AOL Mail app password
    }
  });

// Define email message
const mailOptions = {
  from: 'Deepak dpunyani@​aol.com',
  to: 'aadi.punyani@gmail.com',
  subject: 'Test Email',
  text: 'This is a test email from Node.js using AOL Mail.'
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      console.error('Error sending email:', error);
  } else {
      console.log('Email sent:', info.response);
  }
});
res.send('Demo APIs - EventFlow. <a href="/api-docs/">Test APIs here</a>.');

});

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

