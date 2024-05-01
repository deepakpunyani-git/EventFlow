/**
 * @swagger
 * tags:
 *   name: Dasboard
 *   description: API for managing Dasboard
 * paths:
 *   /dashboard:
 *     get:
 *       summary: List all Dasboard apis
 *       tags: [Dasboard]
 *       responses:
 *         '200':
 *           description: Successful response
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *         '500':
 *           description: Internal server error
 */