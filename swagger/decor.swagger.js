/**
 * @swagger
 * components:
 *   schemas:
 *     Decor:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the decor.
 *         description:
 *           type: string
 *           description: A brief description of the decor.
 *         price:
 *           type: number
 *           description: The price of the decor.
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           default: 'active'
 *           description: The status of the decor.
 *       required:
 *         - name
 *         - price
 *         - status
 */

/**
 * @swagger
 * /decors:
 *   get:
 *     summary: List all decors
 *     tags: [Decor]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter decors by status (admin only)
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Error
 */

/**
 * @swagger
 * /decor:
 *   post:
 *     summary: Create a new decor
 *     tags: [Decor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Decor'
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Error
 */

/**
 * @swagger
 * /decor/{id}:
 *   put:
 *     summary: Update an existing decor by ID
 *     tags: [Decor]
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
 *             $ref: '#/components/schemas/Decor'
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Error
 */

/**
 * @swagger
 * /decor/{id}:
 *   delete:
 *     summary: Delete an existing decor by ID
 *     tags: [Decor]
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
