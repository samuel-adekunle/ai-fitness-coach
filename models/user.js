import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    default: 0,
  },
  height: {
    type: Number,
    required: true,
    default: 0,
  },
  weight: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);