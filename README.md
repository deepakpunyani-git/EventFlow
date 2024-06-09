# EventFlow

## Overview

EventFlow is a Node.js-based backend service designed to manage various aspects of event planning and booking. It leverages Express.js for the server framework, MongoDB for the database, and integrates various utilities for authentication, scheduling the events, and more.

## Features

- User Authentication
- Venue Management
- User Management
- Event Type Management
- Booking Management
- Client Management
- Catering Plan Management
- Decor Management
- Dashboard
- Logging

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Dependencies](#dependencies)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/deepakpunyani-git/EventFlow.git
    cd EventFlow
    ```

2. **Install the dependencies:**

    ```bash
    npm install
    ```

## Configuration

1. **Create a `.env` file in the root directory and add the following configurations:**

    ```env
    PORT=
    MONGODB_URI=
    saltRounds=
    SecretKey=
    email=
    EMAIL_HOST=
    EMAIL_PORT=
    EMAIL_USER=
    EMAIL_PASSWORD=
    ```

## Usage

1. **Start the server:**

    For development with automatic restart on file changes:

    ```bash
    npm run dev
    ```

    For production:

    ```bash
    npm start
    ```

2. **Access the API documentation:**

    Open your browser and go to [http://eventflow-mkh8.onrender.com/api-docs](http://eventflow-mkh8.onrender.com/api-docs)

## API Documentation

API documentation is available at [http://eventflow-mkh8.onrender.com/api-docs](http://eventflow-mkh8.onrender.com/api-docs). It provides detailed information about the available endpoints, request/response formats, and more.

## Dependencies

- `bcrypt`: ^5.1.1
- `dotenv`: ^16.4.1
- `express`: ^4.18.2
- `express-validator`: ^7.0.1
- `jsonwebtoken`: ^9.0.2
- `moment`: ^2.30.1
- `mongoose`: ^8.1.1
- `nodemailer`: ^6.9.13
- `pdfkit`: ^0.15.0
- `swagger-jsdoc`: ^6.2.8
- `swagger-ui-express`: ^5.0.0

License
This project is licensed under the ISC License.

Author
Deepak Punyani

Bugs and Issues
For any bugs or issues, please open an issue on the GitHub repository.

Contributions
Contributions are welcome. Please fork the repository and submit a pull request for review.
