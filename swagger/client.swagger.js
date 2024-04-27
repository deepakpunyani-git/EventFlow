/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     description: Creates a new client with the provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *                 required: true
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *                 required: true
 *               address:
 *                 type: string
 *                 required: true
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 clientName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 address:
 *                   type: string
 *       '400':
 *         description: Bad Request
 *   put:
 *     summary: Update an existing client
 *     description: Updates an existing client with the provided details
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the client to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '404':
 *         description: Not Found
 *   delete:
 *     summary: Delete a client
 *     description: Deletes a client by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the client to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *       '404':
 *         description: Not Found
 */

