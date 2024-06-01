// NodeJS (Express)

const express = require('express');
const app = express();
app.use(express.json());
const request = require('supertest');

let books = [];

//get the list of all books
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

//common method to search for a book with id
function findBookById(id) {
    return books.find(b => b.id === parseInt(id));
}

// get a book by id
app.get('/books/:id', (req, res) => {
    const book = findBookById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.status(200).json(book);
});

// add a book to books(also check if the book extsts before)
app.post('/books', (req, res) => {
    const bookId = req.body.id;
    
    // Checking if the ID already exists in the books array
    const existingBook = findBookById(bookId);
    if (existingBook) {
        return res.status(400).send('Book with this ID already exists');
    }
   
    // If ID does not exist, add the new book
    //geting these references from the test code. 
    const book = {
        id: bookId,
        title: req.body.title,
        author: req.body.author,
        published_date: req.body.published_date,
        price: req.body.price
    };
    books.push(book);
    res.status(201).json(book);
});

//function used to update a book with an id
app.put('/books/:id', (req, res) => {
    const book = findBookById(req.params.id);
    //if book not found
    if (!book) return res.status(404).send('Book not found');
    // if book is found
    book.title = req.body.title;
    book.author = req.body.author;
    book.published_date = req.body.published_date;
    book.price = req.body.price;
    res.status(200).json(book);
});

//delete a book from books
app.delete('/books/:id', (req, res) => {
    const book = findBookById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    const index = books.indexOf(book);
    books.splice(index, 1);
    res.status(200).json(book);
});

app.listen(3000, () => console.log('Server running on port 3000'));

//tests
describe('Test the book store API', () => {
	test('Test POST /books', () => {
    	return request(app)
        	.post('/books')
        	.send({id: 1, title: 'Book 1', author: 'Author 1', published_date: '2022-01-01', price: 9.99})
        	.expect(201);
	});

	test('Test GET /books/1', () => {
    	return request(app)
        	.get('/books/1')
        	.expect(200);
	});

	test('Test PUT /books/1', () => {
    	return request(app)
        	.put('/books/1')
        	.send({title: 'Updated Book 1', author: 'Updated Author 1', published_date: '2022-01-02', price: 19.99})
        	.expect(200);
	});

	test('Test DELETE /books/1', () => {
    	return request(app)
        	.delete('/books/1')
        	.expect(200);
	});

	test('Test GET /books', () => {
    	return request(app)
        	.get('/books')
        	.expect(200);
	});
});





