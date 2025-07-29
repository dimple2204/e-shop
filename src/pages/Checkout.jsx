import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ref, push } from 'firebase/database';
import { database, auth } from '../firebase';
import toast from 'react-hot-toast';
import '../styles/checkout.css';

function Checkout() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvv: '' });

  const handleCheckout = async () => {
    console.log('Starting checkout');
    setLoading(true);
    const user = auth.currentUser;
    if (!user) {
      toast.error('User not authenticated.');
      setLoading(false);
      console.log('Loading set to false due to no user');
      return;
    }
    if (cart.length === 0) {
      toast.error('No items in cart.');
      setLoading(false);
      console.log('Loading set to false due to empty cart');
      return;
    }
    setShowPaymentForm(true);
    setLoading(false);
    console.log('Loading set to false after showing payment form');
  };

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    console.log('Starting payment submission');
    setLoading(true);
    const user = auth.currentUser;
    if (!user) {
      toast.error('User not authenticated.');
      setLoading(false);
      console.log('Loading set to false due to no user');
      return;
    }

    if (cardDetails.cardNumber.length === 16 && cardDetails.expiry && cardDetails.cvv.length === 3) {
      try {
        const ordersRef = ref(database, `orders/${user.uid}`);
        const newOrderRef = push(ordersRef);
        const orderData = {
          items: cart.map(item => ({
            product: item.title,
            image: item.image || 'https://via.placeholder.com/150',
            quantity: item.quantity || 1,
            total: (item.price * (item.quantity || 1)).toFixed(2),
            status: 'pending',
            timestamp: new Date().toISOString()
          })),
          totalAmount: cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2),
          orderDate: new Date().toISOString(),
          paymentMethod: 'Card (Mock)',
          cardLastFour: cardDetails.cardNumber.slice(-4)
        };
        await push(newOrderRef, orderData);
        toast.success('Order placed successfully with mock payment!');
        clearCart();
        setShowPaymentForm(false);
        setCardDetails({ cardNumber: '', expiry: '', cvv: '' });
      } catch (error) {
        console.error('Payment error:', error.message);
        toast.error('Failed to process order. Please try again.');
      } finally {
        setLoading(false);
        console.log('Loading set to false after payment attempt');
      }
    } else {
      toast.error('Please enter valid card details (16-digit card number, valid expiry, 3-digit CVV).');
      setLoading(false);
      console.log('Loading set to false due to invalid card details');
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared!');
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {cart.length > 0 ? (
        <div className="checkout-container">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image || 'https://via.placeholder.com/150'} alt={item.title} className="item-image" />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <p>Quantity: {item.quantity || 1}</p>
                  <p>Total: ${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <h3>Order Summary</h3>
            <p>Total Items: {cart.length}</p>
            <p>Total Amount: ${cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2)}</p>
            {!showPaymentForm ? (
              <button onClick={handleCheckout} disabled={loading} className="small-button">
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="payment-form">
                <h3>Enter Card Details</h3>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  placeholder="Card Number (16 digits)"
                  required
                  maxLength="16"
                />
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  required
                  maxLength="5"
                />
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="CVV (3 digits)"
                  required
                  maxLength="3"
                />
                <button type="submit" disabled={loading} className="small-button">
                  {loading ? 'Processing...' : 'Submit Payment'}
                </button>
              </form>
            )}
            <button onClick={handleClearCart} className="small-button clear-button">
              Clear Cart
            </button>
          </div>
        </div>
      ) : (
        <p className="empty-cart">Your cart is empty.</p>
      )}
    </div>
  );
}

export default Checkout;