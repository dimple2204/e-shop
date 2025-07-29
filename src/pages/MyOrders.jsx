import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import '../styles/myorders.css';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    console.log('Current User UID:', user ? user.uid : 'No user logged in');
    if (user) {
      const ordersRef = ref(database, `orders/${user.uid}`);
      const unsubscribe = onValue(ordersRef, (snapshot) => {
        const ordersData = snapshot.val();
        console.log('Raw Orders Data from Firebase:', ordersData);
        if (ordersData) {
          const ordersList = Object.entries(ordersData).map(([key, value]) => {
            console.log('Raw Order Value:', value);
            // Handle potential nesting or missing fields
            let items = [];
            let totalAmount = '0.00';
            let status = 'Unknown';
            let orderDate = null;

            if (value.items && Array.isArray(value.items)) {
              items = value.items;
            } else if (value.items && !Array.isArray(value.items)) {
              items = [value.items]; // Handle single item case
            }

            if (value.totalAmount) totalAmount = value.totalAmount.toString();
            if (value.status) status = value.status;
            if (value.orderDate) orderDate = value.orderDate;

            return {
              id: key,
              items,
              totalAmount,
              status,
              orderDate
            };
          });
          const sortedOrders = [...ordersList].sort((a, b) => 
            (b.orderDate ? new Date(b.orderDate) : 0) - (a.orderDate ? new Date(a.orderDate) : 0)
          );
          console.log('Processed Orders List:', sortedOrders);
          setOrders(sortedOrders);
        } else {
          setOrders([]);
          console.log('No orders data found for UID:', user.uid);
        }
        setLoading(false);
      }, (error) => {
        console.error('Firebase Error:', error.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setOrders([]);
      setLoading(false);
      console.log('No authenticated user detected');
    }
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="myorders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="orders-list">
          {orders.map(order => (
            <li key={order.id} className="order-item">
              <p><strong>Order ID:</strong> {order.id}</p>
              {order.items.map((item, index) => (
                <div key={index} className="order-item-details">
                  <p><strong>Product:</strong> {item.product || 'N/A'}</p>
                  <p><strong>Quantity:</strong> {item.quantity || 0}</p>
                  <p><strong>Item Total:</strong> ${item.total || '0.00'}</p>
                </div>
              ))}
              <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Ordered Date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }) : 'N/A'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyOrders;