import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { GiBookshelf } from 'react-icons/gi';
import { auth, provider, signInWithPopup, signOut } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { BiLogOut } from 'react-icons/bi';

const Menu = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Помилка входу:", error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <GiBookshelf className="me-2" /> BookStore
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <Nav.Link as={Link} to="/orders" className="text-light-emphasis text-white-hover">Мої замовлення</Nav.Link>
            )}
            <Nav.Link as={Link} to="/about" className="text-light-emphasis text-white-hover">Про нас</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          {user ? (
            <div className="d-flex align-items-center">
              <span className="text-white-50 me-3 small">{user.displayName}</span>
              <Button variant="outline-light" size="sm" onClick={() => signOut(auth)} className="d-flex align-items-center gap-2">
                Вийти <BiLogOut />
              </Button>
            </div>
          ) : (
            <button className="btn btn-outline-light btn-sm" onClick={handleLogin}>Увійти через Google</button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;