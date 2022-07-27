import { Link } from "react-router-dom";


export const Dock = () => {
   return (
      <>
         <div className="dock-wrapper">
               <ul>
                  <li>
                     <Link to="/qobyz">
                        <span>Қылқобыз</span>
                        <img src="qyl-icons.png" alt="" />
                     </Link>
                  </li>
                  <li>
                     <Link to="/prima-qobyz">
                        <span>Прима-қобыз</span>
                        <img src="prima-icons.png" alt="" />
                     </Link>
                  </li>
               </ul>
         </div>
      </>
   );
};