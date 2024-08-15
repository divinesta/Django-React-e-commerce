import { useState } from 'react'
import apiInstance from '../../utils/axios'
import { useNavigate } from 'react-router-dom'


const ForgotPassword = () => {
   const [email, setEmail] = useState("")
   const navigate = useNavigate()

   const handleSubmit = async () => {
      try {
         await apiInstance.get(`user/password-reset/${email}/`).then((res) => {
         alert("An Email has been sent to you");
         
         })
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <div>
         <h2>ForgotPassword</h2>
         <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="enter email" name="" id="" />
         <br/><br/>
         <button onClick={handleSubmit}>Reset pasword</button>
      </div>
   )
}

export default ForgotPassword;