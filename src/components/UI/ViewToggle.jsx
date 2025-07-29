import { FaList, FaTh } from 'react-icons/fa'
   import '../../styles/view-toggle.css'

   function ViewToggle({ view, setView }) {
     return (
       <div className="view-toggle">
         <button
           onClick={() => setView('grid')}
           className={view === 'grid' ? 'active' : ''}
         >
           <FaTh />
         </button>
         <button
           onClick={() => setView('list')}
           className={view === 'list' ? 'active' : ''}
         >
           <FaList />
         </button>
       </div>
     )
   }

   export default ViewToggle