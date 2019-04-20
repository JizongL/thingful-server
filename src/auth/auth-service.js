'use strict';
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
  getUserWithUserName(db, user_name) {
    return db('thingful_users')
      .where({ user_name })
      .first();
  }, 
  parseBasicToken(token) {
    return Buffer
      .from(token, 'base64')
      .toString()
      .split(':');
  },
  getUserWithUserName(db, user_name) {
    return db('thingful_users')
      .where({ user_name })
      .first()
  },
  createJwt(subject,payload){
    return jwt.sign(payload,config.JWT_SECRET,{
      subject,
      algorithm:'HS256',
    })
  },
  verifyJwt(payload){
    return jwt.verify(payload,config.JWT_SECRET,{      
      algorithms:['HS256'],
    })
  },
  comparePasswords(password,hash){
    return bcrypt.compare(password,hash)
  }
};

module.exports = AuthService;

