/**
 * @swagger
 * components:
 *   schemas:
 *     EventType:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *       required:
 *         - name
 *         - status
 * 
 */

/**
 * @swagger
 * /event-types:
 *   get:
 *     summary: List all event types
 *     tags: [Event Types]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter event types by status (admin only)
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Error
 * 
 */
/**
 * @swagger
 * /event-type:
 *   post:
 *     summary: Create a new event type
 *     tags: [Event Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventType'
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Error
 */

/**
 * @swagger
 * /event-type/{id}:
 *   put:
 *     summary: Update an existing event type by _id
 *     tags: [Event Types]
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
 *             $ref: '#/components/schemas/EventType'
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Error
 */

/**
 * @swagger
 * /event-type/{id}:
 *   delete:
 *     summary: Delete an existing event type by _id
 *     tags: [Event Types]
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
