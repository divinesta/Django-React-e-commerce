import { useAuthStore } from "../../store/auth";
import { Link } from "react-router-dom";

const Dashboard = () => {
   const [isLoggedIn, setIsLoggedIn] = useAuthStore((state) => [
      state.isLoggedIn,
      state.user,
   ]);

      
   return (
      <>
         {isLoggedIn() ? (
            <div>
               <h2>Dashboard</h2>
               <Link to={`/logout`}>Logout</Link>
            </div>
         ) : (
            <div>
               <h2>Home page</h2>
               <Link to={`/login`}>Login</Link>
               <Link to={`/register`}>Register</Link>
            </div>
         )}
      </>
   );
}

export default Dashboard;