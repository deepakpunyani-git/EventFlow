/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *        '200':
 *            description: Successful response
 *        '404':
 *            description: Error
 */

/**
 * @swagger
 * /admin-forgot-password:
 *   post:
 *     summary: Send a reset email for admin password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *        '200':
 *            description: Successful response
 *        '404':
 *            description: Error
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     PasswordReset:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         otp:
 *           type: string
 *         newPassword:
 *           type: string
 *       required:
 *         - email
 *         - otp
 *         - newPassword
 */

/**
 * @swagger
 * /admin-reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordReset'
 *     responses:
 *        '200':
 *            description: Successful response
 *        '404':
 *            description: Error
 */
