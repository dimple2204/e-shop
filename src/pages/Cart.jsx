
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import '../styles/cart.css'

function Cart() {
  const { cart, removeFromCart, clearCart, addToCart } = useCart()

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2)

  if (cart.length === 0) return <div className="cart-empty">Your cart is empty. <Link to="/products">Shop now</Link></div>

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.title}</h3>
              <p>${(item.price * (item.quantity || 1)).toFixed(2)}</p>
              <div className="quantity-controls">
                <span>Qty: {item.quantity || 1}</span>
                <button onClick={() => addToCart({ ...item, quantity: 1 })} className="increase-btn">Increase</button>
                <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p>Total: ${total}</p>
        <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
        <button onClick={clearCart} className="clear-btn">Clear Cart</button>
      </div>
    </div>
  )
}

export default Cart