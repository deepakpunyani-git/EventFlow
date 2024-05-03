/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         clientId:
 *           type: string
 *         venue:
 *           type: string
 *         venueAmount:
 *           type: number
 *         dacor:
 *           type: string
 *         dacorAmount:
 *           type: number
 *         cateringPlan:
 *           type: string
 *         cateringPlanAmount:
 *           type: number
 *         details:
 *           type: string
 *         eventType:
 *           type: string
 *         bookingDate:
 *           type: string
 *           default: dd-mm-yyyy
 *         bookingType:
 *           type: string
 *           enum: [morning, evening, full day]
 
 *       required:
 *         - clientId
 *         - eventType
 *         - bookingDate
 *         - bookingType
 *         - venue
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking_update:
 *       type: object
 *       properties:
 *         clientId:
 *           type: string
 *         venueAmount:
 *           type: number
 *         dacor:
 *           type: string
 *         dacorAmount:
 *           type: number
 *         cateringPlan:
 *           type: string
 *         cateringPlanAmount:
 *           type: number
 *         details:
 *           type: string
 *         eventType:
 *           type: string
 *       required:
 *         - clientId
 *         - eventType
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: List all bookings with filtering, sorting, and pagination
 *     tags: [Booking]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: string
 *         description: Filter by clientId
 *       - in: query
 *         name: bookingType
 *         schema:
 *           type: string
 *         description: Filter by booking type
 *       - in: query
 *         name: venue
 *         schema:
 *           type: string
 *         description: Filter by venue
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter bookings from this date (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter bookings until this date (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [bookingDate, venue, bookingType, status, clientName]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sorting order (asc or desc)
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       '201':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       '400':
 *         description: Error
 */

/**
 * @swagger
 * /booking/{id}:
 *   put:
 *     summary: Update an existing booking by ID
 *     tags: [Booking]
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
 *             $ref: '#/components/schemas/Booking_update'
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking_update'
 *       '404':
 *         description: Error
 *       '400':
 *         description: Error
 * 
 *   delete:
 *     summary: Delete an existing booking by ID
 *     tags: [Booking]
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
 *       '400':
 *         description: Error
 */

/**
 * @swagger
 * /booking/{id}:
 *   patch:
 *     summary: Change booking status by ID
 *     tags: [Booking]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               status_details:
 *                 type: string
 *             required:
 *               - status
 *               - status_details
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Error
 *       '400':
 *         description: Error
 */

/**
 * @swagger
 * /booking/{id}:
 *   get:
 *     summary: get single booking by ID
 *     tags: [Booking]
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
 *       '400':
 *         description: Error
 */

/**
 * @openapi
 * /booking/pdf/{id}:
 *   get:
 *     summary: Generate PDF for booking details
 *     tags: [PDF]
 *     description: Generate a PDF document containing the details of a single booking identified by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the booking
 *     responses:
 *       '200':
 *         description: PDF document generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       '404':
 *         description: Booking not found
 *       '500':
 *         description: Internal server error
 */