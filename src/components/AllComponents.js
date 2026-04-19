import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Accordion } from 'react-bootstrap';
import BookCard from './BookCard';
import Busket from './Busket';
import { BsCart3 } from 'react-icons/bs';
import Pagination from 'react-bootstrap/Pagination';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const favorites = () => JSON.parse(localStorage.getItem('favorites')) || [];
const getBusket = () => JSON.parse(localStorage.getItem('busket')) || [];

function AllComponents() {
  const [books, setBooks] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [favouriteBooks, setFavouriteBooks] = useState(favorites());
  const [busketItems, setBusketItems] = useState(getBusket());
  const [isBusketOpen, setIsBusketOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState("Всі");
  const [activePage, setActivePage] = useState(0);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, "books"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(data);
    };
    fetchBooks();
  }, []);

  const handleShowDetails = (title) => {
    setSelectedBook(title);
    setShow(true);
  }

  const setFavouriteItem = (id) => {
    const isFavorite = checkIsFavourite(id);
    setFavouriteBooks(isFavorite ? favouriteBooks.filter(favouriteItem => favouriteItem !== id) : [...favouriteBooks, id]);
  }
  
  const checkIsFavourite = (id) => {
    return favouriteBooks.find(favouriteItem => favouriteItem === id);
  }

  const handleAddToBusket = (book) => {
    const exists = busketItems.find((item) => item.id === book.id);
    if (exists) {
      setBusketItems(
        busketItems.map((item) => item.id === book.id ? { ...item, qty: item.qty + 1 } : item)
      );
    } else {
      setBusketItems([...busketItems, { ...book, qty: 1 }]);
    }
    setIsBusketOpen(true);
  };

  const handleRemoveFromBusket = (id) => {
    setBusketItems(busketItems.filter((item) => item.id !== id));
  };

  const handleChangeQty = (id, delta) => {
    const updated = busketItems
      .map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item)
      .filter((item) => item.qty > 0);
    setBusketItems(updated);
  };

  const totalQty = busketItems.reduce((sum, item) => sum + item.qty, 0);

  const authors = ["Всі", ...new Set(books.map((book) => book.text))];

  const filteredBooks = selectedAuthor === "Всі" ? books : books.filter((book) => book.text === selectedAuthor);

  const sortedBooks = sortOrder === "asc" ? [...filteredBooks].sort((a, b) => a.price - b.price) : sortOrder === "desc" 
  ? [...filteredBooks].sort((a, b) => b.price - a.price) : filteredBooks;

  const booksPerPage = 6;

  const offset = activePage * booksPerPage;
  
  const currentBooks = sortedBooks.slice(offset, offset + booksPerPage);

  const handleClearBusket = () => {
    setBusketItems([]);
  };

  let items = [];
  for (let number = 1; number <= Math.ceil(sortedBooks.length/6); number++) {
    items.push(
      <Pagination.Item key={number} active={number === (activePage + 1)} onClick={() => setActivePage(number-1)}>
        {number}
      </Pagination.Item>,
    );
  }

  const paginationBasic = () => (
    <div className="d-flex justify-content-center mt-4 mb-4">
      <Pagination>{items}</Pagination>
    </div>
  );

  useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favouriteBooks) );
        localStorage.setItem('busket', JSON.stringify(busketItems));
    }, [favouriteBooks, busketItems]);

  return(
    <>
      {show && (
        <Alert 
          variant="dark" onClose={() => setShow(false)} dismissible className="shadow-sm border-0 mt-3">
          <h4 className="alert-heading">Обрана книга: {selectedBook}</h4>
          <p className="mb-0">
            Ця книга доступна для замовлення. Доставка протягом 2-х днів.
          </p>
        </Alert>
      )}

      <div className="mb-3">
        <label className="me-2">Фільтр за автором: </label>
          <select value={selectedAuthor} onChange={(e) => {setSelectedAuthor(e.target.value); setActivePage(0)}}>
            {authors.map((author) => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>

        <label className="ms-3 me-2">Сортування за ціною: </label>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setActivePage(0);
            }}
          >
          <option value="default">За замовчуванням</option>
          <option value="asc">Від дешевших</option>
          <option value="desc">Від дорожчих</option>
            </select>
      </div>

      <Container>
        <Row>
            {currentBooks.map((item)=>(
            <Col className="justify-content-center mb-4" md={6} lg={4} key={item.id}>
            <BookCard
                card={item}
                onShowDetails={handleShowDetails}
                isFavorite={checkIsFavourite(item.id)}
                setFavouriteItem={setFavouriteItem}
                favouriteBooks={favouriteBooks}
                onAddToBusket={handleAddToBusket}
            />
            </Col>
            ))}
        </Row>
      </Container>

        {paginationBasic()}

        <div className="mt-5">
            <h3>Питання та відповіді</h3>
            <Accordion defaultActiveKey="0" className="shadow-sm rounded">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Доставка та оплата</Accordion.Header>
                <Accordion.Body>
                  Ми доставляємо книги по всій Україні через Нову Пошту та Укрпошту. Оплата можлива при отриманні або картою на сайті.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Чи є можливість повернення книги?</Accordion.Header>
                <Accordion.Body>
                  Так, ви можете повернути товар протягом 14 днів, якщо книга не має пошкоджень та збережено чек.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Чи є знижки для постійних клієнтів?</Accordion.Header>
                <Accordion.Body>
                  Ми регулярно проводимо акції. Слідкуйте за банерами на головній сторінці.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
        </div>
        <button className="busket-btn" onClick={() => setIsBusketOpen(true)}>
          <BsCart3 />
          {totalQty > 0 && (<span className="busket-btn-count">{totalQty}</span>)}
        </button>

        <Busket
          isOpen={isBusketOpen}
          onClose={() => setIsBusketOpen(false)}
          busketItems={busketItems}
          onRemove={handleRemoveFromBusket}
          onChangeQty={handleChangeQty}
          onClearBusket={handleClearBusket}
        />    
    </>
  )
}

export default AllComponents;