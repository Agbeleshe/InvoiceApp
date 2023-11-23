const mongoose = require('mongoose');
const validator = require('validator');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a business name'],
    validate: {
      validator: function (val) {
        return !/([^\sa-zA-Z]+)/g.test(val);
      },
      message: 'Please your Full name must contain letters and spaces only'
    }
  },
  customer_type: {
    type: String,
    enum: ['Business', 'Individual'],
    required: [true, 'Please enter customer type']
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  contact_number: {
    type: String,
    validate: {
      validator: function (val) {
        return !/([^\0-9]+)/g.test(val);
      },
      message: 'Phone numbers should contain numbers only'
    }
  },
  business_address: {
    type: String,
    required: [true, 'Please enter business address']
  },
  owner_id: {
    required: [true, 'Please enter owner id'],
    type: mongoose.Schema.ObjectId,
    ref: 'Owner'
  }
});

module.exports = mongoose.model('Customer', customerSchema);