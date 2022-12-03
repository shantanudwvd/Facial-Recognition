const serverUrl = 'http://localhost:3000/api'

const uploadPhotoAsync = async (apiUrl, filename, blob) => {
  const formData = new FormData()
  formData.append('photo', blob, filename)

  const options = {
    method: 'POST',
    body: formData
  }

  const response = await fetch(`${serverUrl}${apiUrl}`, {
    credentials: 'same-origin',
    ...options
  })

  if (response.status !== 200) {
    return {
      success: false,
      data: `Request failed with status code ${
        response.status
      }.  ${await response.text()}`
    }
  }

  return await response.json()
}

export { uploadPhotoAsync }
