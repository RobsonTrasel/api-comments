import express from 'express'
import commentsController from '../controllers/comments/comments.controller'
import emailController from '../controllers/emails/email.controller'

const router = express.Router()

router.get('/comments', commentsController.getComments)
router.post('/comments', commentsController.createComments)
router.put('/comments/approve/:id', commentsController.setApproved)
router.put('/comments/reject/:id', commentsController.setRejected)
router.post('/send-mail', emailController.enviarEmails)


export default router