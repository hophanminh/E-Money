const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'minhlaccloud',
  api_key: '239485199764345',
  api_secret: 'nl0LvugzHn9L20T3j4vz55ZIClw'
});

// export.uploads = (file) => {
//   return new Promise(resolve => {
//     cloudinary.uploader.upload(file, (result) => {
//       resolve({ url: result.url, id: result.public_id })
//     }, { resource_type: "auto" })
//   })
// }