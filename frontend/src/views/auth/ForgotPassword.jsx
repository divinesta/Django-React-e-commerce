import { useState } from 'react'
import apiInstance from '../../utils/axios'
import { useNavigate, Link } from 'react-router-dom'


const ForgotPassword = () => {
   const [email, setEmail] = useState("")
   const [isLoading, setIsLoading] = useState(false)
   const navigate = useNavigate()

   const handleSubmit = async () => {
      setIsLoading(true)
      try {
         await apiInstance.get(`user/password-reset/${email}/`).then((res) => {
         alert("An Email has been sent to you");
         setIsLoading(false)
      })
      } catch (error) {
         // console.log(error)
         setIsLoading(false)
      }
   }

   return (
      <section>
         <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
            <div className="container">
               {/* Section: Login form */}
               <section className="">
                  <div className="row d-flex justify-content-center">
                     <div className="col-xl-5 col-md-8">
                        <div className="card rounded-5">
                           <div className="card-body p-4">
                              <h3 className="text-center">Forgot Password</h3>
                              <br />

                              <div className="tab-content">
                                 <div
                                    className="tab-pane fade show active"
                                    id="pills-login"
                                    role="tabpanel"
                                    aria-labelledby="tab-login"
                                 >
                                    <div>
                                       {/* Email input */}
                                       <div className="form-outline mb-4">
                                          <label
                                             className="form-label"
                                             htmlFor="Full Name"
                                          >
                                             Email Address
                                          </label>
                                          <input
                                             type="email"
                                             id="email"
                                             name="email"
                                             className="form-control"
                                             value={email}
                                             onChange={(e) =>
                                                setEmail(e.target.value)
                                             }
                                          />
                                       </div>

                                       <div className="text-center">
                                          {isLoading ? (
                                             <button disabled
                                                type='button'
                                                className="btn btn-primary w-100 mb-4"
                                             >
                                                Processing{" "}
                                                <i className="fas fa-spinner spin"></i>
                                             </button>
                                          ) : (
                                             <button
                                                type='button'
                                                onClick={handleSubmit}
                                                className="btn btn-primary w-100 mb-4"
                                             >
                                                Send Email{" "}
                                                <i className="fas fa-paper-plane"></i>
                                             </button>
                                          )}

                                          <div className="text-center">
                                             <p>
                                                Want to signin ?{" "}
                                                <Link to="/login">
                                                   Login{" "}
                                                   <i className="fas fa-sign-in"></i>
                                                </Link>
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
            </div>
         </main>
      </section>
   );
}

export default ForgotPassword;