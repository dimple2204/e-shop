import { useCart } from '../../context/CartContext'
import '../../styles/cart-item.css'

function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart()

  return (
    <div className="cart-item">
      <img
        src={item.image}
        alt={item.title}
        className="cart-item-image"
      />
      <div className="cart-item-details">
        <h3 className="cart-item-title">{item.title}</h3>
        <p className="cart-item-price">${item.price}</p>
      </div>
      <div className="cart-item-controls">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="quantity-btn"
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="quantity-btn"
        >
          +
        </button>
        <button
          onClick={() => removeFromCart(item.id)}
          className="remove-btn"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem