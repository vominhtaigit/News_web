import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Không bắt buộc
    publishedDate: { type: Date, default: Date.now },
    image: { type: String, required: false }, // Thêm trường ảnh
    disabled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

newsSchema.index({ title: 'text', content: 'text' }); // Tạo chỉ mục full-text

export default mongoose.model('News', newsSchema);