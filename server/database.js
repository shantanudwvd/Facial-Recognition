import { model, Schema, connect } from 'mongoose'
import { addImageToCollection } from './faceRecognition'

const connectToDatabase = async () =>
  await connect(
    process.env.DB_CONNECTION_STRING || '',
    {
      useFindAndModify: false,
      autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      useNewUrlParser: true
    }
  )

const PictureSchema = new Schema({
  filename: String,
  mimeType: String,
  bucket: String,
  contentType: String,
  location: String,
  etag: String
})

const PictureModel = model('Picture', PictureSchema)

const savePicture = async (req, res) => {
  try {
    const originalFile = req.file.transforms.find(t => t.id === 'original')

    if (!originalFile) {
      throw new Error('Unable to find original file!')
    }

    const { originalname, mimetype } = req.file

    const picture = {
      filename: originalname,
      mimeType: mimetype,
      bucket: originalFile.bucket,
      contentType: originalFile.contentType,
      location: originalFile.location,
      etag: originalFile.etag
    }

    const result = await new PictureModel(picture).save()

    await addImageToCollection(
      originalFile.bucket,
      result._id.toString(),
      originalFile.key
    )

    return res.status(200).json({ success: true, data: 'Upload complete' })
  } catch (e) {
    return res.status(500).json({
      success: false,
      data: e
    })
  }
}

const getPictures = async ids => {
  return await PictureModel.find({
    _id: {
      $in: ids
    }
  }).exec()
}

export { connectToDatabase, getPictures, savePicture, PictureModel }
