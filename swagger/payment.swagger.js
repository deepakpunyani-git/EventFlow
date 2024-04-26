/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - amount
 *         - details
 *         - bookingId
 *         - paymentMode
 *       properties:
 *         amount:
 *           type: number
 *           description: The amount of the payment
 *         details:
 *           type: string
 *           description: Details of the payment
 *         bookingId:
 *           type: string
 *           description: ID of the booking associated with the payment
 *         paymentMode:
 *           type: string
 *           enum: ['cash', 'online','cc','check']
 *           description: Payment mode (cash, online, cc, check)
 *           default: cash
 */

/**
 * @swagger
 * /payments/add:
 *   post:
 *     summary: Add payment
 *     description: Add a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized - Token not provided
 */

/**
 * @swagger
 * /payments/deduct:
 *   post:
 *     summary: Deduct payment
 *     description: Deduct an amount from a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized - Token not provided
 */

/**
 * @swagger
 * /payments/{paymentId}:
 *   delete:
 *     summary: Delete payment
 *     description: Delete a payment record
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the payment to delete
 *     responses:
 *       '204':
 *         description: No Content
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Payment record not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the payment
 *         details:
 *           type: string
 *           description: Details of the payment
 *         paymentMode:
 *           type: string
 *           enum: ['cash', 'online','cc','check']
 *           description: Payment mode (cash, online, cc, check)
 *         bookingId:
 *           type: string
 *           description: ID of the booking associated with the payment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the payment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the payment was last updated
 *       required:
 *         - details
 *         - paymentMode
 *         - bookingId
 */

/**
 * @swagger
 * /payments/{paymentId}:
 *   put:
 *     summary: Update a payment record
 *     description: Update an existing payment record by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the payment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               details:
 *                 type: string
 *                 description: Details of the payment
 *               paymentMode:
 *                 type: string
 *                 enum: ['cash', 'online','cc','check']
 *                 description: Payment mode (cash, online, cc, check)
 *               amount:
 *                 type: number
 *                 description: The amount of the payment
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Payment record not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: List all payments
 *     description: Retrieve a list of all payments
 *     tags: [Payments]
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/{paymentId}:
 *   get:
 *     summary: View a single payment by ID
 *     description: Retrieve details of a single payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the payment to view
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       '404':
 *         description: Payment not found
 *       '500':
 *         description: Internal server error
 */