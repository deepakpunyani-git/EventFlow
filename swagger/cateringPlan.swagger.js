/**
 * @swagger
 * /cateringPlan:
 *   post:
 *     summary: Create a new catering plan
 *     tags: [Catering Plans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CateringPlan'
 *     responses:
 *       '201':
 *         description: Successful response
 *       '400':
 *         description: Bad Request
 *
 *   get:
 *     summary: Get all catering plans
 *     tags: [Catering Plans]
 *     responses:
 *       '200':
 *         description: Successful response
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CateringPlan'
 *       '400':
 *         description: Bad Request
 *
 * /cateringPlan/{id}:
 *   put:
 *     summary: Update an existing catering plan by ID
 *     tags: [Catering Plans]
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
 *
 *   delete:
 *     summary: Delete an existing catering plan by ID
 *     tags: [Catering Plans]
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
