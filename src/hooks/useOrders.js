import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

export const useOrders = () => {
    const [user,   setUser]   = useState(undefined);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);
    const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
        return () => unsubscribe();
      }, []);
    
      useEffect(() => {
        if (user === undefined) return;
        if (!user) { setLoading(false); 
            return;
        }
    
        const fetchOrders = async () => {
        setLoading(true);
        try {
            let q;
            if (user.email === adminEmail) {
            q = query(collection(db, 'orders'), orderBy('date', 'desc'));
            } else {
            q = query(collection(db, 'orders'), where('uid', '==', user.uid), orderBy('date', 'desc'));
            }
            
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
            setOrders(data);
        } catch (err) {
            console.error(err);
            setError('Не вдалось завантажити замовлення.');
        } finally {
            setLoading(false);
        }
        };
        fetchOrders();
      }, [user, adminEmail]);

      return {user, orders, setOrders, loading, error, isAdmin: user?.email === adminEmail};
};