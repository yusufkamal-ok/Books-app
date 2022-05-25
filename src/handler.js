const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    
    if (name === undefined){
      const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
  }
  if (readPage > pageCount){
      const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
  }

    
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (readPage === pageCount);
    

    const newBook = {
        name,year,author,summary,publisher,pageCount, readPage, reading, id, insertedAt, updatedAt, finished
      };
      books.push(newBook);

    const Success = books.filter((book) => book.id === id).length > 0;
    
    
    if (Success) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
};

const allBooks = (request, h) => {
  // const { name, reading, finished } = request.query;
  
  let filBooks  = books;

  // if (name !== undefined){
  //   filBooks = filBooks.filter((book)=>book.name.toLoweeCase().includes(name.toLoweeCase()));

  // }

  // if (reading !== undefined){
  //   filBooks = filBooks.filter((book)=>book.reading === !!Number(reading));
    
  // }

  // if (finished !== undefined){
  //   filBooks = filBooks.filter((book)=>book.finished === !!Number(finished));
    
  // }

  const response = h.response({
    status: 'success',
    data : {
      books: filBooks.map((book)=>({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }))
    },
  });
  response.code(200)
  return response;
};

const detailBook = (request, h) => {
  const { id } = request.params;
  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status : 'success',
      data: {
        book,
      }
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};


const editBook = (request, h) => {
  const { id } = request.params;

  
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    if(name === undefined){
      const response = h.response({
        status : 'fail',
        message : 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      response.code(400);
      return response;
    }

    if(readPage > pageCount){
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400);
      return response;
    }

    books[index] = {
      ...books[index],
      name, 
      year, 
      author, 
      summary, 
      publisher, 
      pageCount, 
      readPage, 
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


const deleteBook = (request, h) => {

  const { id } = request.params;

  
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {addBook, allBooks, detailBook, editBook, deleteBook};