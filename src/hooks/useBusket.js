import { useState, useEffect } from 'react';

export const useBusket = () => {
  const [favouriteBooks, setFavouriteBooks] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
  const [busketItems, setBusketItems] = useState(() => JSON.parse(localStorage.getItem('busket')) || []);
  const [isBusketOpen, setIsBusketOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favouriteBooks));
    localStorage.setItem('busket', JSON.stringify(busketItems));
  }, [favouriteBooks, busketItems]);

  const handleAddToBusket = (book) => {
    const exists = busketItems.find((item) => item.id === book.id);
    if (exists) {
      setBusketItems(busketItems.map((item) => item.id === book.id ? { ...item, qty: item.qty + 1 } : item));
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

  const handleClearBusket = () => {
    setBusketItems([]);
  };

  const setFavouriteItem = (id) => {
    const isFavorite = checkIsFavourite(id);
    setFavouriteBooks(isFavorite ? favouriteBooks.filter(item => item !== id) : [...favouriteBooks, id]);
  };

  const checkIsFavourite = (id) => {
    return favouriteBooks.some(item => item === id);
  };

  const totalQty = busketItems.reduce((sum, item) => sum + item.qty, 0);

  return {busketItems, isBusketOpen, setIsBusketOpen, favouriteBooks, handleAddToBusket, handleRemoveFromBusket, handleChangeQty, handleClearBusket,
    setFavouriteItem, checkIsFavourite, totalQty};
};