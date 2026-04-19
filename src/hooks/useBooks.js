import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("Всі");
  const [sortOrder, setSortOrder] = useState("default");
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, "books"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(data);
    };
    fetchBooks();
  }, []);

  const authors = ["Всі", ...new Set(books.map((book) => book.text))];
  
  const filteredBooks = selectedAuthor === "Всі" ? books : books.filter((book) => book.text === selectedAuthor);

  const sortedBooks = sortOrder === "asc" ? [...filteredBooks].sort((a, b) => a.price - b.price) : sortOrder === "desc" 
  ? [...filteredBooks].sort((a, b) => b.price - a.price) : filteredBooks;

  return {books: sortedBooks, authors, selectedAuthor, setSelectedAuthor, sortOrder, setSortOrder, activePage, setActivePage};
};