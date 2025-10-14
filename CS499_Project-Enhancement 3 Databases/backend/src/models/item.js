const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});



//index for faster queries
itemSchema.index({ userId: 1 });
itemSchema.index({ name: 1 });
itemSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    ret._id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;