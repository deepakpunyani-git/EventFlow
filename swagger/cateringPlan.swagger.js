/**
 * @swagger
 * components:
 *   schemas:
 *     Catering Plan:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:  # Fixed indentation here
 *           type: number
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
 * /cateringPlans:
 *   get:
 *     summary: List all Catering Plans
 *     tags: [cateringPlan]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter Catering Plans by status (admin only)
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Error
 */

/**
 * @swagger
 * /cateringPlan:
 *   post:
 *     summary: Create a new catering plans
 *     tags: [cateringPlan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CateringPlan'
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Error
 */

/**
 * @swagger
 * /cateringPlan/{id}:
 *   put:
 *     summary: Update an existing Catering Plan by _id
 *     tags: [cateringPlan]
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
 *             $ref: '#/components/schemas/CateringPlan'
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Error
 */

/**
 * @swagger
 * /cateringPlan/{id}:
 *   delete:
 *     summary: Delete an existing Catering Plan by _id
 *     tags: [cateringPlan]
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
