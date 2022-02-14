const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);
const {uploadFile} = require('../helpers');
const {User, Product} = require('../models');

const saveFile = async(req, res) => {

  try {
    const fileName = await uploadFile(req.files, ['jpg', 'png', 'jpeg', 'gif'], 'images');
  
    res.json({
      fileName
    })

  } catch (err) {
    res.json({
      err
    })
  }
}

// Método sin guardado en la nube
const modifyAvatar = async(req, res) => {
  
  const {collection, id} = req.params;

  let entity;

  switch (collection) {
    case 'users':
      entity = await User.findById(id);

      if ( ! entity) {
        return res.status(500).json({
          msg: 'No existe ese usuario'
        })
      }
    break;
    case 'products':
      entity = await Product.findById(id);
      
      if ( ! entity) {
        return res.status(500).json({
          msg: 'No existe ese producto'
        })
      }
    break;
    default:
      return res.status(500).json({msg: 'No existe la colección'})
  }

  deletePreviousAvatar(entity, collection);

  const name = await uploadFile(req.files, ['jpg', 'png', 'jpeg', 'gif'], collection);
  entity.avatar = name;

  await entity.save();

  res.json(entity);
}

// Método con guardado con la nube
const modifyAvatarCloudinary = async(req, res) => {
  
  const {collection, id} = req.params;

  let entity;

  switch (collection) {
    case 'users':
      entity = await User.findById(id);

      if ( ! entity) {
        return res.status(500).json({
          msg: 'No existe ese usuario'
        })
      }
    break;
    case 'products':
      entity = await Product.findById(id);
      
      if ( ! entity) {
        return res.status(500).json({
          msg: 'No existe ese producto'
        })
      }
    break;
    default:
      return res.status(500).json({msg: 'No existe la colección'})
  }

  deletePreviousAvatarCloudinary(entity);

  const {tempFilePath} = req.files.firstFile;
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
  entity.avatar = secure_url;
  await entity.save();

  res.json(entity);

}

const deletePreviousAvatarCloudinary = (entity) => {
  if (entity.avatar) {
    const avatarName = entity.avatar.split('/');
    const name = avatarName[avatarName.length - 1];
    const [public_id] = name.split('.');
    cloudinary.uploader.destroy(public_id);
  }
}

const deletePreviousAvatar = (entity, collection) => {
  if (entity.avatar) {
    const pathImg = path.join(__dirname, '../uploads', collection, entity.avatar);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }
}

const getAvatar = async(req, res) => {
  const {collection, id} = req.params;

  let entity;

  switch (collection) {
    case 'users':
      entity = await User.findById(id);

      if ( ! entity) {
        return res.status(500).json({
          msg: 'No existe ese usuario'
        })
      }
    break;
    case 'products':
      entity = await Product.findById(id);
      
      if ( ! entity) {
        return res.status(500).json({
          msg: 'No existe ese producto'
        })
      }
    break;
    default:
      return res.status(500).json({msg: 'No existe la colección'})
  }

  if (entity.avatar) {
    let pathImg = path.join(__dirname, '../uploads', collection, entity.avatar);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }

  pathImg = path.join(__dirname, '../assets/no-image.jpg');
  return res.sendFile(pathImg);
}

module.exports = {
  saveFile,
  modifyAvatar,
  getAvatar,
  modifyAvatarCloudinary
}