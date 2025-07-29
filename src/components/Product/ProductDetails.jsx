import { useCart } from '../../context/CartContext'
import '../../styles/product-details.css'

function ProductDetails({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="product-details fade-in">
      <img
        src={product.image}
        alt={product.title}
        className="product-details-image"
      />
      <div className="product-details-content">
        <h2 className="product-details-title">{product.title}</h2>
        <p className="product-details-price">${product.price}</p>
        <p className="product-details-description">{product.description}</p>
        <button
          onClick={() => addToCart(product)}
          className="product-details-add-to-cart"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductDetails