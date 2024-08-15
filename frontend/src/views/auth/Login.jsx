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
      if (isLoggedIn()) {
         navigate("/");
      }
   }, []);

   const resetForm = () => {
      setEmail("");
      setPassword("");
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      // const { error } = await login(username, password);
      // if (error) {
      //    alert(error);
      // } else {
      //    navigate("/");
      //    resetForm();
      // }
      // setIsLoading(false);
      try {
         // Replace with actual login logic
         await new Promise((resolve) => setTimeout(resolve, 2000));
         navigate("/");
         resetForm();
         // Handle successful login
      } catch (error) {
         // Handle login error
         alert(error);
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
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />{" "}
               <br /> <br />
               <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password"
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
