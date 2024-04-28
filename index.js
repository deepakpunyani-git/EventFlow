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
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.EMAIL_PORT, // Should be process.env.EMAIL_PORT
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
    const  to = 'deepakpunyani@ymail.com';
    const subject = "test";
    const content = "asdasdadadasdsadsad";
    const info = await transporter.sendMail({
      to: to,
      subject: subject,
      text: content,
      html: content,
    });

    console.log(info.envelope);
    console.log("Message sent: %s", info.messageId);

    res.send('Demo APIs - EventFlow. <a href="/api-docs/">Test APIs here</a>.');
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Internal Server Error");
  }
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

