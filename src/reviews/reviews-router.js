const express = require('express')
const path = require('path')
const ReviewsService = require('./reviews-service')
const reviewsRouter = express.Router()
const jsonBodyParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

reviewsRouter
  .route('/')
  .post(requireAuth,jsonBodyParser, (req, res, next) => {
    const { thing_id, rating, text} = req.body
    
    const newReview = { thing_id, rating, text}
    // remember this part, the user id is not supplied by the client. 
    // it's from the req.
    newReview.user_id = req.user.id
    for (const [key, value] of Object.entries(newReview))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    ReviewsService.insertReview(
      req.app.get('db'),
      newReview
    )
      .then(review => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${review.id}`))
          .json(ReviewsService.serializeReview(review))
      })
      .catch(next)
    })

module.exports = reviewsRouter
