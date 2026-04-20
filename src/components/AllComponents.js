import React, { useState } from 'react';
import { Container, Row, Col, Alert, Accordion } from 'react-bootstrap';
import BookCard from './BookCard';
import Busket from './Busket';
import { BsCart3 } from 'react-icons/bs';
import Pagination from 'react-bootstrap/Pagination';
import { useBusket } from '../hooks/useBusket';
import { useBooks } from '../hooks/useBooks';

function AllComponents() {
  const [show, setShow] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const {
    busketItems,
    isBusketOpen,
    setIsBusketOpen,
    favouriteBooks,
    handleAddToBusket,
    handleRemoveFromBusket,
    handleChangeQty,
    handleClearBusket,
    setFavouriteItem,
    checkIsFavourite,
    totalQty
  } = useBusket();
  const {books: sortedBooks, authors, selectedAuthor, setSelectedAuthor, sortOrder, setSortOrder, activePage, setActivePage } = useBooks();


  const handleShowDetails = (title) => {
    setSelectedBook(title);
    setShow(true);
  }

  const booksPerPage = 6;

  const offset = activePage * booksPerPage;
  
  const currentBooks = sortedBooks.slice(offset, offset + booksPerPage);

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

  return(
    <>
      {show && (
        <Alert 
          variant="dark" onClose={() => setShow(false)} dismissible 
          className="shadow-sm border-0 mt-3">
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