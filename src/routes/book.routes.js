const express = require('express')
const router = express.Router()
const Book = require('../models/book.model');
const res = require('express/lib/response');

//MIDDLEWARE
const getBook = async (req, res, next) => {
    let book;
    const {id} = req.params;

    //Comprueba que el id que trae sea valido para Mongo
    if (!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({message: 'El ID no es valido'})
    }

    try {
        //Busca objeto con ese Id en la base de datos
        book = await Book.findById(id);
        if(!book){
            return res.status(404).json({message: 'El libro no fue encontrado'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

    res.book = book;
    //Next sirve para que continue con otros procesos
    next()
}

//Obtener todos los objetos
router.get('/', async (req, res) => {
    try {
        const books = await Book.find() 
        console.log('ALL BOOKS', books)
        if (books.length === 0){
            return res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Crear un objeto
router.post('/', async (req, res) => {
    const {title, author, genre, publication_date } = req?.body
    if(!title || !author || !genre || !publication_date){
        return res.status(400).json({
            message: "Todos los campos son obligatorios"
        })
    }

    const book = new Book(
        {
            title, 
            author, 
            genre, 
            publication_date
        }
    )

    try {
        const newBook = await book.save()
        console.log(newBook)
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/:id', getBook, async(req,res) => {
    res.json(res.book);
})

router.put('/:id', getBook, async(req,res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save()
        res.json(updatedBook)

    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.patch('/:id', getBook, async(req,res) => {

    if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
        res.status(400).json({message: 'Al menos uno de estos campos debe ser enviado: Titulo, Autor, Genero o fecha de publicacion' })
    }
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save()
        res.json(updatedBook)

    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.delete('/:id', getBook, async(req,res) => {
    try {
        const book = res.book
        await book.deleteOne();
        res.json({
            message: `El libro ${book.title} fue eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})


module.exports = router