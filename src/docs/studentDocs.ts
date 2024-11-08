/**
 * @swagger
 * /api/register/student:
 *   post:
 *     summary: Creation of a new student
 *     tags: [student]
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
 *                 description: Full name of the student
 *                 example: "Nome do Estudante"
 *               username:
 *                 type: string
 *                 description: Username of the student
 *                 example: "nomeestudante"
 *               birthDate:
 *                 type: string
 *                 description: Birth date
 *                 example: "01/03/2001"
 *               email:
 *                 type: string
 *                 description: Email address of the student
 *                 example: "nomeestudante@exemplo.com"
 *               educationLevelId:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of education level ID
 *                 example: [1]
 *               password:
 *                 type: string
 *                 description: Password of the student
 *                 example: "P@ssword123"
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation password of the student
 *                 example: "P@ssword123"
 *     responses:
 *       '201':
 *         description: Student successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                   example: "Nome do Estudante"
 *                 username:
 *                   type: string
 *                   example: "nomeestudante"
 *                 birthDate:
 *                   type: string
 *                   example: "2000-01-01"
 *                 email:
 *                   type: string
 *                   example: "nomeestudante@exemplo.com"
 *                 educationLevel:
 *                   type: object
 *                   properties:
 *                     educationId:
 *                       type: integer
 *                       example: 1
 *                 studentId:
 *                   type: integer
 *                   example: 123
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
 *                         example: ""
 *                       msg:
 *                         type: string
 *                         example: "Nome completo é obrigatório."
 *                       path:
 *                         type: string
 *                         example: "fullName"
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
