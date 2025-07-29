import { useCart } from '../../context/CartContext'
   import '../../styles/product.css'

   function ProductCard({ product, view }) {
     const { addToCart } = useCart()

     return (
       <div className={`product-card ${view === 'list' ? 'list-view' : 'grid-view'}`}>
         <img
           src={product.image}
           alt={product.title}
           className="product-image"
         />
         <div className="product-details">
           <h3 className="product-title">{product.title}</h3>
           <p className="product-price">${product.price}</p>
           <button
             onClick={() => addToCart(product)}
             className="add-to-cart"
           >
             Add to Cart
           </button>
         </div>
       </div>
     )
   }

   export default ProductCard