const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const { Book, validateCreateBook, validateUpdateBook } = require('../models/Book');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');


/**
 * @desc Get All Books
 * @Route /api/books
 * @memberof GET
 * @access public
 */

router.get(
    '/',
    asyncHandler(
        async (request, response) => {
            const results = await Book.find().populate("auther");
            response.status(200).json({ message: 'get all books', books: results });
        }
    )
);

/**
 * @desc Get All Book By Id
 * @Route /api/books/:id
 * @memberof GET
 * @access public
 */

router.get(
    '/:id',
    asyncHandler(
        async (request, response) => {
            const book = await Book.findById(request.params.id).populate("auther", ["_id", "firstName", "lastName", "nationality", "image"]);
            if (book) {
                response.status(200).json({
                    message: 'This book founded',
                    book: book
                });
            } else {
                response.status(404).json({
                    message: 'This book not found',
                    book: book
                });
            }
        }
    ));

/**
 * @desc Create new Book
 * @Route /api/books/create
 * @memberof POST
 * @access private (Only Admin)
 */

router.post(
    '/create',
    verifyTokenAndAdmin,
    asyncHandler(
        async (request, response) => {
            console.log('STATUS CODE: ' + request.statusCode);
            console.log('BODY: ' + request.body);


            const { error } = validateCreateBook(request.body);
            if (error) {
                return response.status(400).json({ message: error.details[0].message });
            }

            const book = new Book({
                title: request.body.title,
                auther: request.body.auther,
                description: request.body.description,
                price: request.body.price,
                cover: request.body.cover
            }
            );

            const result = await book.save();
            // 201 =? Created Successfully
            response.status(201).json({
                message: 'Add new book successfully',
                book: result
            });
        }
    )
);

/**
 * @desc Update Book
 * @Route /api/books/update/:id
 * @memberof PUT
 * @access private (Only Admin)
 */

router.put(
    '/update/:id',
    verifyTokenAndAdmin,
    asyncHandler(
        async (request, response) => {

            const { error } = validateUpdateBook(request.body);
            if (error) {
                return response.status(400).json({ message: error.details[0].message });
            }

            const result = await Book.findByIdAndUpdate(request.params.id, {
                $set: {
                    title: request.body.title,
                    auther: request.body.auther,
                    description: request.body.description,
                    price: request.body.price,
                    cover: request.body.cover
                }
            }, { new: true }).populate("auther", ["_id", "firstName", "lastName", "nationality", "image"]);
            if (result) {
                response.status(200).json({ message: 'Book has been updated', book: result });
            } else {
                response.status(404).json({ message: 'Book not Found' });
            }

        }
    ));

/**
 * @desc Delete Book
 * @Route /api/books/delete/:id
 * @memberof DELETE
 * @access private (Only Admin)
 */

router.delete(
    '/delete/:id',
    verifyTokenAndAdmin,
    asyncHandler(
        async (request, response) => {

            const result = await Book.findById(request.params.id);
            if (result) {
                await Book.findByIdAndDelete(request.params.id);
                response.status(200).json({ message: 'Book has been Deleted' });
            } else {
                response.status(404).json({ message: 'Book not Found' });
            }

        }
    ));


module.exports = router;