import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/home.css'

function Home() {
  const flashSaleEnd = new Date('2025-07-27T23:59:00+05:30').getTime()
  const [flashSaleTime, setFlashSaleTime] = useState(Math.floor((flashSaleEnd - new Date().getTime()) / 1000))
  const [trendingItems, setTrendingItems] = useState([])
  const [flashSaleItems, setFlashSaleItems] = useState([])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = Math.floor((flashSaleEnd - now) / 1000)
      setFlashSaleTime(distance > 0 ? distance : 0)
    }, 1000)

    const fetchData = async () => {
      const response = await axios.get('https://fakestoreapi.com/products')
      const products = response.data
      setTrendingItems(products.slice(0, 3))
      setFlashSaleItems(products.slice(3, 5).map(p => ({ ...p, originalPrice: p.price * 1.2 })))
    }
    fetchData()

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs}h ${mins}m ${secs}s`
  }

  return (
    <div className="home-page">
      <section className="hero fade-in">
        <div className="hero-content">
          <h1>Welcome to E-Shop</h1>
          <p>Discover the best deals today!</p>
          <Link to="/products" className="shop-now">Shop Now</Link>
        </div>
      </section>
      <div className="top-sections">
        <section className="trending-section fade-in">
          <h2>Trending Items</h2>
          <div className="trending-items">
            {trendingItems.map((item) => (
              <Link to={`/product/${item.id}`} key={item.id} className="trending-item">
                <img src={item.image} alt={item.title} className="trending-item-image" />
                <div className="trending-item-details">
                  <h3>{item.title}</h3>
                  <p>${item.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="flash-sale-section fade-in">
          <h2>Flash Sale <span className="timer">Ends: July 27, 2025, 11:59 PM IST ({formatTime(flashSaleTime)})</span></h2>
          <div className="flash-sale-items">
            {flashSaleItems.map((item) => (
              <div key={item.id} className="flash-sale-item">
                <img src={item.image} alt={item.title} className="flash-sale-item-image" />
                <div className="flash-sale-item-details">
                  <h3>{item.title}</h3>
                  <p className="flash-sale-price">${item.price.toFixed(2)} <span className="original-price">${item.originalPrice.toFixed(2)}</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home