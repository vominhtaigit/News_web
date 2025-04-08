import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Không bắt buộc
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('News', newsSchema);