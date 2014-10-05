mongoose  = require 'mongoose'
Schema    = mongoose.Schema
ObjectId  = mongoose.Schema.Types.ObjectId

elementSchema = new Schema
  chunk:      ObjectId
  created:  
    type:     Date
    default:  Date.now
  updated:
    type:     Date
    default:  Date.now
  x:
    type:     Number
    default:  0
  y:
    type:     Number
    default:  0
  value:
    type:     Number
    default:  0


module.exports =
  Model:  mongoose.model 'Element', elementSchema
  Schema: elementSchema
