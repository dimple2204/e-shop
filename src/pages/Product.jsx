import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import '../styles/product.css'

function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
      setProduct(response.data)
    }
    fetchProduct()
  }, [id])

  if (!product) return <div className="loading">Loading...</div>

  return (
    <div className="product-page">
      <div className="product-container">
        <img src={product.image} alt={product.title} className="product-image" />
        <div className="product-details">
          <h2>{product.title}</h2>
          <p className="price">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <button onClick={() => { addToCart(product); toast.success('Added to cart!') }} className="add-to-cart">
            Add to Cart
          </button>
          <Link to="/cart" className="view-cart">View Cart</Link>
        </div>
      </div>
    </div>
  )
}

export default Product