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
  sex: {
    type: String,
    required: true,
    default: ""
  },
  activityLevel: {
    type: String,
    required: true,
    default: ""
  },
  goals: {
    type: [String],
    required: true,
    default: []
  },
  mealPlan: {
    type: String,
    required: true,
    default: "[]"
  },
  workoutPlan: {
    type: String,
    required: true,
    default: "[]"
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);