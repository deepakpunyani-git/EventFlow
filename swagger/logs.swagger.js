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
 * paths:
 *   /logs:
 *     get:
 *       summary: List all logs
 *       tags: [Logs]
 *       responses:
 *         '200':
 *           description: Successful response
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Log'
 *         '500':
 *           description: Internal server error
 */