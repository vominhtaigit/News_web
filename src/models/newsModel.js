import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, 
    publishedDate: { type: Date, default: Date.now },
    image: { type: String, required: false }, 
    disabled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

newsSchema.index({ title: 'text', content: 'text' }); 

export default mongoose.model('News', newsSchema);