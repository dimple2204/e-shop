import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useDebounce } from '../hooks/useDebounce'
import '../styles/products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState('grid')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('https://fakestoreapi.com/products')
      setProducts(response.data)
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  )

  return (
    <div className="products-page">
      <div className="products-header">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="view-toggle">
          <button onClick={() => setView('grid')} className={view === 'grid' ? 'active' : ''}>Grid</button>
          <button onClick={() => setView('list')} className={view === 'list' ? 'active' : ''}>List</button>
        </div>
      </div>
      <div className={`products-container ${view}-view`}>
        {filteredProducts.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className={`product-card ${view}`}>
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-details">
              <h3>{product.title}</h3>
              <p>${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Products