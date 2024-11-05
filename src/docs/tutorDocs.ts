/**
 * @swagger
 * /api/register/tutor:
 *   post:
 *     summary: Creation of a new tutor
 *     tags: [tutor]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the tutor
 *                 example: "Nome Tutor"
 *               username:
 *                 type: string
 *                 description: Username of the tutor
 *                 example: "nometutor"
 *               birthDate:
 *                 type: string
 *                 description: Birth date in the format YYYY-MM-DD
 *                 example: "1990-01-01"
 *               email:
 *                 type: string
 *                 description: Email address of the tutor
 *                 example: "nometutor@exemplo.com"
 *               cpf:
 *                 type: string
 *                 description: CPF of the tutor
 *                 example: "123.456.789-10"
 *               educationLevelIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of education level IDs
 *                 example: [1, 2]
 *               password:
 *                 type: string
 *                 description: Password of the tutor
 *                 example: "P@ssword123"
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation password of the tutor
 *                 example: "P@ssword123"
 *     responses:
 *       '201':
 *         description: Tutor successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                 username:
 *                   type: string
 *                 birthDate:
 *                   type: string
 *                 email:
 *                   type: string
 *                 cpf:
 *                   type: string
 *                 educationLevel:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 tutorId:
 *                   type: integer
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "field"
 *                       value:
 *                         type: string
 *                         example: "117.629.360-54"
 *                       msg:
 *                         type: string
 *                         example: "CPF já cadastrado."
 *                       path:
 *                         type: string
 *                         example: "cpf"
 *                       location:
 *                         type: string
 *                         example: "body"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
