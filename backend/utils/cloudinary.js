const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'minhlaccloud',
  api_key: '239485199764345',
  api_secret: 'nl0LvugzHn9L20T3j4vz55ZIClw'
});
// const uploadToCloudinary = async (cloudinary, files) => {
//   const urls = [];
//   try {
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const filePath = file.path;
//       const uniqueFilename = Date.now();
//       const publicID = `transactionImages/${uniqueFilename}`;
//       const image = await cloudinary.uploader.upload(filePath, {
//         quality: 80,
//         timeout: 60000,
//         public_id: publicID,
//         tags: 'transactionImages',
//       });

//       const newImage = {
//         ID: uuidv1(),
//         URL: image.secure_url,
//         TransactionID: transactionID,
//         DateAdded: convertToRegularDateTime(uniqueFilename),
//         PublicID: image.public_id
//       }
//       fs.unlink(filePath, err => { if (err) console.log(err) });// run this cmd asynchronously
//       urls.push(newImage);
//     }

//     return urls;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// }

// export.uploads = (file) => {
//   return new Promise(resolve => {
//     cloudinary.uploader.upload(file, (result) => {
//       resolve({ url: result.url, id: result.public_id })
//     }, { resource_type: "auto" })
//   })
// }