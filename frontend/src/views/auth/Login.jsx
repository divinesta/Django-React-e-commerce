import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { login } from "../../utils/auth";

const Login = () => {
   const navigate = useNavigate();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [isloading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);
   const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

   useEffect(() => {
      if (isLoggedIn) {
         navigate("/");
      }
   }, [isLoggedIn]);

   const resetForm = () => {
      setEmail("");
      setPassword("");
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         const { error } = await login(email, password );
         if (error) {
            setError(error);
         } else {
            navigate("/");
            resetForm();
         }
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div>
         <h1>HI</h1>
         {isloading ? (
            <div>Loading...</div>
         ) : (
            <form onSubmit={handleLogin}>
               <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />{" "}
               <br /> <br />
               <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
               />{" "}
               <br /> <br />
               {error && <div style={{ color: "red" }}>{error}</div>}
               <button type="submit">Log in</button>
            </form>
         )}
      </div>
   );
};

export default Login;
