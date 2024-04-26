/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 * 
 * components:
 *   schemas:
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       required:
 *         - message
 *
 *     NewPassword:
 *       type: object
 *       properties:
 *         newPassword:
 *           type: string
 *       required:
 *         - newPassword
 *
 *     Staff:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         username:
 *           type: string
 *         jobRole:
 *           type: string
 *         password:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         jobRole:
 *           type: string
 *         password:
 *           type: string
 *
 *     UserProfile:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         jobRole:
 *           type: string
 *
 *     UpdatePassword:
 *        type: object
 *        properties:
 *          currentPassword:
 *            type: string
 *          newPassword:
 *            type: string
 *        required:
 *           - currentPassword
 *           - newPassword
 * 
 * paths:
 *   /users/add-admin:
 *     post:
 *       summary: Create a new admin
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               firstname: John
 *               lastname: Doe
 *               username: admin123
 *               email: admin@example.com
 *               jobRole: admin
 *               password: Admin@123
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       responses:
 *          '200':
 *              description: Successful response
 *          '404':
 *              description: Error
 *
 *   /users/add-staff:
 *     post:
 *       summary: Create a new staff member
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               firstname: Jane
 *               lastname: Doe
 *               username: staff456
 *               jobRole: staff
 *               password: Staff@123
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       responses:
 *          '200':
 *              description: Successful response
 *          '404':
 *              description: Error
 *
 *   /users/staff-password-change/{id}:
 *     put:
 *       summary: Change user password
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               newPassword: NewPass@123
 *             schema:
 *               $ref: '#/components/schemas/NewPassword'
 *       responses:
 *          '200':
 *              description: Successful response
 *          '404':
 *              description: Error
 *
 *   /users/staff/{id}:
 *     put:
 *       summary: Update a staff member by ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               firstname: UpdatedFirstName
 *               lastname: UpdatedLastName
 *               jobRole: UpdatedStaff
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       responses:
 *          '200':
 *              description: Successful response
 *          '404':
 *              description: Error
 *
 *   /users/update-profile/:
 *     put:
 *       summary: Update the user profile
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               firstname: UpdatedFirstName
 *               lastname: UpdatedLastName
 *               jobRole: UpdatedProfile
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       responses:
 *          '200':
 *              description: Successful response
 *          '404':
 *              description: Error
 *
 *   /users/update-password:
 *     put:
 *       summary: Update logged-in user password
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               currentPassword: CurrentPass@123
 *               newPassword: NewPass@123
 *             schema:
 *               $ref: '#/components/schemas/UpdatePassword'
 *       responses:
 *          '200':
 *              description: Successful response
 *          '404':
 *              description: Error
 *
 *   /users:
 *     get:
 *       summary: List users based on filters
 *       tags: [Users]
 *       parameters:
 *         - in: query
 *           name: name
 *           schema:
 *             type: string
 *           description: Filter users by name (case-insensitive)
 *         - in: query
 *           name: usertype
 *           schema:
 *             type: string
 *           description: Filter users by usertype
 *         - in: query
 *           name: status
 *           schema:
 *             type: string
 *             enum: [active, inactive]
 *           description: Filter users by status
 *         - in: query
 *           name: sortby
 *           schema:
 *             type: string
 *             enum: [firstname, lastname, jobRole, usertype, status]
 *           description: Field to sort by
 *         - in: query
 *           name: sort
 *           schema:
 *             type: string
 *             enum: [asc, desc]
 *           description: Sort order (ascending or descending)
 *       responses:
 *          '200':
 *              description: Successful response
 *          '404':
 *              description: Error
 *
 *   /users/{id}:
 *     get:
 *       summary: Get details of a single user by ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID
 *       responses:
 *          '200':
 *              description: Successful response
 *          '404':
 *              description: Error
 */
