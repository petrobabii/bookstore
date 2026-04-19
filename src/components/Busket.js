import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Alert } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

function Busket({ isOpen, onClose, busketItems, onRemove, onChangeQty, onClearBusket }) {
  const total = busketItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalQty = busketItems.reduce((sum, item) => sum + item.qty, 0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOrder = async () => {
  const user = auth.currentUser;

    if (!user) {
      setError('Щоб оформити замовлення, увійдіть через Google.');
      return;
    }

    setLoading(true);
    setError(null);
    setOrderSuccess(false);

    try {
      await addDoc(collection(db, 'orders'), {
        uid: user.uid,
        userName: user.displayName,
        items: busketItems.map(({ id, title, price, qty }) => ({ id, title, price, qty })),
        total,
        date: serverTimestamp(),
        isPaid: false,
      });

      setOrderSuccess(true);
      onClearBusket();
    } catch (err) {
      console.error('Помилка при збереженні замовлення:', err);
      setError('Не вдалось оформити замовлення. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setOrderSuccess(false);
    }}, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="busket-overlay" onClick={onClose}>
      <div className="busket-panel" onClick={(e) => e.stopPropagation()}>

        <div className="busket-header">
          <h5>Кошик</h5>
          <Button variant="light" size="sm" onClick={onClose}>
            <AiOutlineClose />
          </Button>
        </div>

        <div className="busket-body">
          {busketItems.length === 0 ? (
            <p className="text-muted text-center mt-3">Кошик порожній</p>) : (<ListGroup variant="flush"> {busketItems.map((item) => (
                <ListGroup.Item key={item.id} className="busket-item">

                  <div className="busket-item-info">
                    <strong>{item.title}</strong>
                    <span className="text-muted">{item.text}</span>
                    <span>{item.price * item.qty} грн</span>
                  </div>

                  <div className="busket-item-controls">
                    <Button variant="outline-secondary" size="sm" onClick={() => onChangeQty(item.id, -1)}>
                        −
                    </Button>

                    <span className="busket-qty">{item.qty}</span>

                    <Button variant="outline-secondary" size="sm" onClick={() => onChangeQty(item.id, 1)}>
                        +
                    </Button>

                    <Button variant="outline-danger" size="sm" onClick={() => onRemove(item.id)}>
                      <AiOutlineClose />
                    </Button>
                  </div>

                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>

        {orderSuccess && (
          <div className="busket-footer">
            <Alert variant="success" className="mb-0">
              Замовлення успішно оформлено! Дякуємо за покупку.
            </Alert>
          </div>
        )}

        {error && (
          <div className="busket-footer">
            <Alert variant="danger" className="mb-0">{error}</Alert>
          </div>
        )}

        {busketItems.length > 0 && (
          <div className="busket-footer">
            <p>Товарів: {totalQty} шт.</p>
            <h5>Разом: {total} грн</h5>
            <Button variant="dark" className="w-100" onClick={handleOrder} disabled={loading}>
              {loading ? 'Оформлення...' : 'Оформити замовлення'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Busket;