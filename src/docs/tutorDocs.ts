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
 *                 description: Birth date in the format DD/MM/YYYY
 *                 example: "01/01/1990"
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
 *                   example: "Erro interno do servidor."
 *                 error:
 *                   type: string
 */
/**
 * @swagger
 * /api/get/tutor:
 *   get:
 *     summary: Retrieve a list of all tutors
 *     tags: [tutor]
 *     responses:
 *       '200':
 *         description: Successfully retrieved the list of tutors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: "usuario_tutor01"
 *                   email:
 *                     type: string
 *                     example: "usuario_tutor01@exemplo.com"
 *                   fullName:
 *                     type: string
 *                     example: "nome_tutor01"
 *                   cpf:
 *                     type: string
 *                     example: "63806240078"
 *                   educationLevels:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         educationId:
 *                           type: integer
 *                           example: 1
 *                         levelType:
 *                           type: string
 *                           example: "Fundamental"
 *                   lessonRequests:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         ClassId:
 *                           type: integer
 *                           example: 14
 *                         reason:
 *                           type: array
 *                           items:
 *                             type: string
 *                             example: "reforço"
 *                         preferredDates:
 *                           type: array
 *                           items:
 *                             type: string
 *                             example: "29/12/2025 às 23:45"
 *                         status:
 *                           type: string
 *                           example: "pendente"
 *                         additionalInfo:
 *                           type: string
 *                           example: "Looking for a tutor with experience in calculus."
 *                   subjects:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         subjectId:
 *                           type: integer
 *                           example: 1
 *                         subjectName:
 *                           type: string
 *                           example: "Biologia"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */
/**
 * @swagger
 * /api/get/tutor/{id}:
 *   get:
 *     summary: Retrieve a tutor by ID
 *     tags: [tutor]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the tutor to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Successfully retrieved the tutor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: "usuario_tutor01"
 *                 email:
 *                   type: string
 *                   example: "usuario_tutor01@exemplo.com"
 *                 fullName:
 *                   type: string
 *                   example: "nome_tutor01"
 *                 cpf:
 *                   type: string
 *                   example: "63806240078"
 *                 educationLevels:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       educationId:
 *                         type: integer
 *                         example: 1
 *                       levelType:
 *                         type: string
 *                         example: "Fundamental"
 *                 lessonRequests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ClassId:
 *                         type: integer
 *                         example: 14
 *                       reason:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "reforço"
 *                       preferredDates:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "29/12/2025 às 23:45"
 *                       status:
 *                         type: string
 *                         example: "pendente"
 *                       additionalInfo:
 *                         type: string
 *                         example: "Looking for a tutor with experience in calculus."
 *                 subjects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subjectId:
 *                         type: integer
 *                         example: 1
 *                       subjectName:
 *                         type: string
 *                         example: "Mathematics"
 *       '404':
 *         description: Tutor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tutor não encontrado."
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */
