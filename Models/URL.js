import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const URLSchema = new Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  clickCount: { type: Number, default: 0 },
  createdBy: { type: Number, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const URL = model('URL', URLSchema);
export default URL;
