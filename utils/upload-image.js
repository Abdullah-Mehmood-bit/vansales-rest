const file_type_regex = /(?:\.([^.]+))?$/
const httpErrors = require('../http/error')
const Jimp = require('jimp')

exports._getFileName = function(file){
  return Date.now() + "_" + Math.floor(10000 + Math.random() * 90000) + "." + file_type_regex.exec(file.name)[1];
}

// const _resizeImage = async (image, filename, quality, width, height = Jimp.AUTO ) => {
//     Jimp.read(image.data)
//     .then(img => {
//         return img
//           .resize(width, height) 
//           .quality(quality)
//           .write(filename)
//     })
//     .catch(err => {
//         throw err
//     })
    
// }

// exports._uploadImage = function(image, filename) {
//   return new Promise( async (resolve, reject) => {
//     const path_with_image_name = 'public/assets/images/' + filename

//     try{
//         await _resizeImage(image, path_with_image_name, 90, 480, 600)
//         return resolve('success')
//     }
//     catch(err){
//         console.log(err)
//         return reject(httpErrors.unableToHandle('Image not moved to the target directory'))
//     }
//   })
// }

exports._uploadImage = function(image, filename) {
    return new Promise( (resolve, reject) => {
      const path_with_image_name = 'public/assets/images/' + filename
  
      console.log("file ==============>", path_with_image_name )
  
      image.mv(path_with_image_name, function(err) {
        if (err) return reject(httpErrors.unableToHandle('Image not moved to the target directory'))
        return resolve('success')
      })
    })
  }