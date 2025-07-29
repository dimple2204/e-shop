import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import '../styles/account.css'

function Account() {
  const { cart } = useCart()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [lastActive, setLastActive] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login')
      } else {
        setUser(currentUser)
        setLastActive(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!user) return null

  const orderCount = cart.length

  return (
    <div className="account-page">
      <div className="account-container">
        <h2>My Account</h2>
        <div className="user-info">
          <p><strong>Name:</strong> {user.displayName || 'User'}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {user.metadata.creationTime || '2025-07-01'}</p>
          <p><strong>Orders:</strong> {orderCount}</p>
          <p><strong>Last Active:</strong> {lastActive}</p>
        </div>
        <div className="account-actions">
          <Link to="/myorders" className="account-link">View Orders</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Account