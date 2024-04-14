import mongoose from 'mongoose'

export const bookSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        genre: String,
        publication_date: String,
    }
)

export default mongoose.model('Book', bookSchema)