import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3-transform'
import sharp from 'sharp'

const upload = (setMetadata, setKey) => {
  const BUCKET = process.env.AWS_BUCKET

  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  })

  const multerMetadata = {
    metadata: (_req, file, cb) => {
      cb(null, setMetadata(file))
    },
    key: (_req, file, cb) => {
      cb(null, setKey(file))
    },
    transform: (_req, _file, cb) => cb(null, sharp())
  }

  return multer({
    storage: multerS3({
      s3,
      bucket: BUCKET,
      acl: 'public-read',
      shouldTransform: (_req, file, cb) => {
        cb(null, /^image/i.test(file.mimetype))
      },
      transforms: [
        {
          id: 'original',
          ...multerMetadata
        }
      ]
    })
  })
}

const uploadFromClient = (setMetadata, setKey) => (req, res, next) =>
  upload(setMetadata, setKey).single('filepond')(req, res, next)

export { uploadFromClient }
