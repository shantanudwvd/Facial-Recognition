import React from 'react'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import dynamic from 'next/dynamic'

import { uploadPhotoAsync } from './utils'
import { FileUpload } from '../components/FileUpload'

const Webcam = dynamic(import('../components/Webcam').then(instance => instance.Webcam), {
  ssr: false
})

const useStyles = makeStyles(theme => ({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  paper: {
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(8),
      padding: `${theme.spacing(6)}px ${theme.spacing(4)}px`
    }
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    paddingTop: '56.25%'
  },
  container: {
    marginBottom: theme.spacing(10)
  }
}))

const SelectYourPictures = () => {
  const classes = useStyles({})

  const [pictures, setPictures] = React.useState([])
  const [hasSearched, setHasSearched] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)

  const processImage = async blob => {
    setUploading(true)
    const { success, data } = await uploadPhotoAsync('/face', 'A Face', blob)
    if (success) {
      setPictures(data)
    }
    setHasSearched(true)
    setUploading(false)
  }

  const renderNoPicturesFound = () => (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        mb={3}
        mt={3}
      >
        <Typography component="h1" variant="h4" align="center">
          Nothing to show
        </Typography>
        <Typography component="p" gutterBottom>
          Sorry, we were not able to find any pictures of you, please try again.
        </Typography>
      </Box>
    </>
  )

  const renderPictures = () => {
    return (
      <>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          mb={3}
        >
          <Typography component="h1" variant="h4" align="center">
            We found you!
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {pictures.map(picture => (
            <Grid item key={picture.location} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={picture.location}
                  title={picture.filename}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    )
  }

  return (
    <Container className={classes.container} maxWidth="md">
      <main className={classes.layout}>
        <Paper className={classes.paper} elevation={2}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Find your face using AWS Rekognition
          </Typography>
          <Typography component="h5" variant="h5" gutterBottom>
            Start by uploading images to your face recognition collection
          </Typography>
          <FileUpload />
          <Typography component="h5" variant="h5" gutterBottom>
            Next, upload a picture of yourself
          </Typography>
          <Webcam onCapture={processImage} isUploading={uploading} />
          {hasSearched &&
            (pictures.length > 0 ? renderPictures() : renderNoPicturesFound())}
        </Paper>
      </main>
    </Container>
  )
}

export default SelectYourPictures
