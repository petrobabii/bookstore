import React from 'react';
import { Alert, Spinner, Accordion, Badge, Button } from 'react-bootstrap';
import { useOrders } from '../hooks/useOrders';
import { doc, updateDoc } from 'firebase/firestore';
import {db} from '../firebase';

function Orders() {
  const {user, orders, setOrders, loading, error, isAdmin} = useOrders();

  if (user === undefined || loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2 text-muted">Завантаження...</p>
      </div>
    );
  }

  const togglePaymentStatus = async (orderId, currentStatus) => {
  const orderRef = doc(db, 'orders', orderId);
    try {
      await updateDoc(orderRef, {
        isPaid: !currentStatus
      });
      setOrders(orders.map(o => o.docId === orderId ? { ...o, isPaid: !currentStatus } : o));
    } catch (err) {
      alert("Помилка оновлення статусу");
    }
  };

  if (!user) {
    return (
      <Alert variant="warning" className="mt-4">
        Щоб переглянути замовлення, спочатку <strong>увійдіть через Google</strong>.
      </Alert>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-4">{error}</Alert>;
  }

  if (orders.length === 0) {
    return (
      <div className="mt-4">
        <h3>Мої замовлення</h3>
        <Alert variant="info">
          У вас ще немає замовлень.
        </Alert>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3>{isAdmin ? "Панель адміністратора: Замовлення" : "Мої замовлення"}</h3>
      <Accordion>
        {orders.map((order, index) => {
          const date = order.date?.toDate
            ? order.date.toDate().toLocaleDateString('uk-UA', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            : 'Дата невідома';

          const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);

          return (
            <Accordion.Item eventKey={String(index)} key={order.docId}>
              <Accordion.Header>
                <div className="d-flex justify-content-between w-100 me-3">
                  <span>
                    <strong>Замовлення #{orders.length - index}</strong>
                    <Badge bg={order.isPaid ? "success" : "danger"} className="ms-2">
                      {order.isPaid ? "Оплачено" : "Очікує оплати"}
                    </Badge>
                    {isAdmin && <span className="ms-3"> Клієнт: {order.userName}</span>}
                  </span>
                  
                  <div>
                    {isAdmin && (
                      <Button variant="outline-dark" size="sm" className="me-3" onClick={(e) => {
                          e.stopPropagation();
                          togglePaymentStatus(order.docId, order.isPaid);
                        }}>
                        Змінити статус
                      </Button>
                    )}
                    <Badge bg="dark">{order.total} грн</Badge>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <p className="text-muted mb-2" style={{fontSize: '0.9em'}}>
                  Дата оформлення: {date}
                </p>
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Книга</th>
                      <th className="text-center">Кількість</th>
                      <th className="text-end">Сума</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td className="text-center">{item.qty}</td>
                        <td className="text-end">{item.price * item.qty} грн</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan={1}><strong>Разом</strong></td>
                      <td className="text-center">{itemCount} шт.</td>
                      <td className="text-end"><strong>{order.total} грн</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
}

export default Orders;