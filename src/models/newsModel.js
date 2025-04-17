import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        unique: true // Tiêu đề không được trùng
    },
    content: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(value) {
                return value.split(' ').length >= 500; // Nội dung phải có ít nhất 500 chữ
            },
            message: 'Content must have at least 500 words.'
        }
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, 
    publishedDate: { type: Date, default: Date.now },
    image: { 
        type: String, 
        required: true // Hình ảnh bắt buộc
    }, 
    disabled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

newsSchema.index({ title: 'text', content: 'text' }); 

export default mongoose.model('News', newsSchema);