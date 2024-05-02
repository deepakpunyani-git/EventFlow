/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: API for managing logs
 * 
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [booking, payment]
 *         createdBy:
 *           type: string
 *           format: uuid
 *         dateCreated:
 *           type: string
 *           format: date-time
 *       required:
 *         - description
 *         - status
 *         - createdBy
 *         - dateCreated
 *
 */

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: List all logs
 *     description: Retrieve a list of all logs with optional pagination, search, and sorting.
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: dateCreated
 *         schema:
 *           type: string
 *         description: Search by date created (regex supported)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: bookingId
 *         schema:
 *           type: string
 *         description: Filter by booking ID
 *       - in: query
 *         name: paymentId
 *         schema:
 *           type: string
 *         description: Filter by payment ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (dateCreated, status)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction (ascending or descending)
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 *       '500':
 *         description: Internal server error
 */