const mongoose = require('mongoose');

mongoose.set('strictQuery',false);

const url = process.env.MONGODB_URI;

console.log('conecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('Connecto to MongoDB');
  })
  .catch(error => console.log('Error connecting to MongoDB: ', error.message));

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 3,
    maxLength: 30,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  completed: {
    type: Boolean,
  },
  tag: {
    type: String,
    enum: [
      'personal',
      'finances',
      'job',
      'health'
    ]
  },
});

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Task', taskSchema);