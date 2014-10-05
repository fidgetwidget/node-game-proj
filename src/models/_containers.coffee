mongoose  = require 'mongoose'
Schema    = mongoose.Schema

Item      = require './_items.js'

containerSchema = new Schema
  created:      
    type:     Date
    default:  Date.now
  updated:
    type:     Date
    default:  Date.now
  type:
    type:     Number
    default:  0
  rows:
    type:     Number
    default:  1 
  columns:
    type:     Number
    default:  1
  _items:     [Item.Schema]

module.exports = 
  Model: mongoose.model 'Container', containerSchema
  Schema: containerSchema

