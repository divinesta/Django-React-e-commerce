import { useState } from 'react'
import apiInstance from '../../utils/axios'

const ForgotPassword = () => {
   const [email, setEmail] = useState("")

   const handleSubmit = () => {
      try {
         apiInstance.get(`user/password-reset/${email}/`).then((res) => {
            console.log(res.data)
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