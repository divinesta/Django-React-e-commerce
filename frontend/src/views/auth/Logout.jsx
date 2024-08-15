import { useEffect } from "react";
import { logout } from "../../utils/auth";
import { Link } from "react-router-dom";

const Logout = () => {
   useEffect(() => {
      logout()
   }, [])

   return (
      <div>
         <h2>Logout</h2>
         <Link to={'/register'}>Register</Link>
         <Link to={'/login'}>Login</Link>
      </div>
   )
}

export default Logout;