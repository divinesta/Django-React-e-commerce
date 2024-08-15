import { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { register } from "../../utils/auth";

const Register = () => {
   const navigate = useNavigate();
   const [fullname, setFullname] = useState("")
   const [email, setEmail] = useState("")
   const [phone, setPhone] = useState("")
   const [password, setPassword] = useState("")
   const [password2, setPassword2] = useState("")
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);
   const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

   useEffect(() => {
      if (isLoggedIn()) {
         navigate("/")
      }
   }, [])

   const handleSubmit = async (e) => {
      e.preventDefault()
      setIsLoading(true)

      const { error } = await register(fullname, email, phone, password, password2);
      if (error) {
         alert(JSON.stringify(error))
      } else {
         navigate("/")
      }
      setIsLoading(false);  
   }

   return (
      <>
         <div>Register</div>
         <form onSubmit={handleSubmit}>
            <input
               type="text"
               placeholder="Full name"
               name=""
               id=""
               onChange={(e) => setFullname(e.target.value)}
            />
            <br />
            <br />
            <input
               type="email"
               placeholder="email"
               name=""
               id=""
               onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <br />
            <input
               type="number"
               placeholder="Mobile number"
               name=""
               id=""
               onChange={(e) => setPhone(e.target.value)}
            />
            <br />
            <br />
            <input
               type="password"
               placeholder="Password"
               name=""
               id=""
               onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <br />
            <input
               type="password"
               placeholder="Confirm Password"
               name=""
               id=""
               onChange={(e) => setPassword2(e.target.value)}
            />
            <br />
            <br />

            {error && <div style={{ color: "red" }}>{error}</div>}

            <button type="submit" disabled={isLoading}>
               {isLoading ? "Registering..." : "Register"}
            </button>
         </form>
      </>
   );
}

export default Register;