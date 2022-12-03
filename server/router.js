import express from 'express'
import multer from 'multer'
import uuid from 'uuid/v4'

import { savePicture } from './database'
import { uploadFromClient } from './s3-upload'
import { recogniseFromBuffer } from './faceRecognition'

const router = express.Router()
const upload = multer()

router.post(
  '/upload',
  uploadFromClient(
    file => ({ filename: file.originalname }),
    file => `${uuid()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`
  ),
  savePicture
)

router.post('/face', upload.single('photo'), async (req, res) => {
  try {
    const result = await recogniseFromBuffer(req.file.buffer)

    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: 'No faces were recognised'
    })
  }
})

function Router(app) {
  app.use(`/api`, router)
}

export default Router
