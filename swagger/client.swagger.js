/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         clientName:
 *           type: string
 *           description: The name of the client.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the client.
 *         phoneNumber:
 *           type: number
 *           pattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}$'             
 *           description: The phone number of the client in the format xxx-xxx-xxxx.
 *         address:
 *           type: string
 *           description: The address of the client.
 *       required:
 *         - clientName
 *         - phoneNumber
 *         - address
 */

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       '201':
 *         description: Successful response
 *       '400':
 *         description: Bad Request
 *
 *   get:
 *     summary: Search clients by name or phone number
 *     tags: [Clients]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query by name or phone number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort clients by name (asc or desc)
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Bad Request
 *
 * /clients/{id}:
 *   put:
 *     summary: Update an existing client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Error
 *
 *   delete:
 *     summary: Delete an existing client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Error
 */

/**
 * @swagger
 * /client/{id}:
 *   get:
 *     summary: Get a single client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the client to retrieve
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '404':
 *         description: Client not found
 *       '500':
 *         description: Internal Server Error
 */