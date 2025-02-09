import React, { useState, useEffect } from 'react'
import apiInstance from "../../utils/axios";
import { useParams } from "react-router-dom";
import { SERVER_URL } from '../../utils/constant';
import Swal from "sweetalert2";

const Toast = Swal.mixin({
   toast: true,
   position: "top",
   showConfirmButton: false,
   timer: 3000,
   timerProgressBar: true,
});

const Checkout = () => {
   const [order, setOrder] = useState([])
   const [couponCode, setCouponCode] = useState("")
   const [paymentLoading, setPaymentLoading] = useState(false)

   const param = useParams()

const fetchOrderData = () => {
   apiInstance.get(`checkout/${param.order_oid}/`).then((res) => {
      setOrder(res.data);
   });
}

   useEffect(() => {
      fetchOrderData()
   }, [])

   const applyCoupon = async () => {
      console.log(couponCode)
      console.log(order.oid)

      const formdata = new FormData()
      formdata.append("order_oid", order.oid)
      formdata.append("coupon_code", couponCode)

      try {
         const response = await apiInstance.post("coupon/", formdata)
         // setOrder(response.data)
         // console.log(response.data.message);
         fetchOrderData()
         Toast.fire({
            icon:response.data.icon,
            title:response.data.message
         })
      } catch (error) {
         console.log(error)
      }
   }

   const payWithStripe = (event) => {
      setPaymentLoading(true)
      event.target.form.submit()
   }

   return (
      <>
         <main className="mb-4 mt-4">
            <div className="container">
               <section className="">
                  <div className="row gx-lg-5">
                     <div className="col-lg-8 mb-4 mb-md-0">
                        <section className="">
                           <div className="alert alert-warning">
                              <strong>
                                 Review Your Shipping &amp; Order Details{" "}
                              </strong>
                           </div>
                           <div>
                              <h5 className="mb-4 mt-4">Shipping address</h5>
                              <div className="row mb-4">
                                 <div className="col-lg-12">
                                    <div className="form-outline">
                                       <label
                                          className="form-label"
                                          htmlFor="form6Example2"
                                       >
                                          Full Name
                                       </label>
                                       <input
                                          type="text"
                                          readOnly
                                          className="form-control"
                                          value={order.full_name}
                                       />
                                    </div>
                                 </div>

                                 <div className="col-lg-6 mt-4">
                                    <div className="form-outline">
                                       <label
                                          className="form-label"
                                          htmlFor="form6Example2"
                                       >
                                          Email
                                       </label>
                                       <input
                                          type="text"
                                          readOnly
                                          className="form-control"
                                          value={order.email}
                                       />
                                    </div>
                                 </div>

                                 <div className="col-lg-6 mt-4">
                                    <div className="form-outline">
                                       <label
                                          className="form-label"
                                          htmlFor="form6Example2"
                                       >
                                          Mobile
                                       </label>
                                       <input
                                          type="text"
                                          readOnly
                                          className="form-control"
                                          value={order.mobile}
                                       />
                                    </div>
                                 </div>
                                 <div className="col-lg-6 mt-4">
                                    <div className="form-outline">
                                       <label
                                          className="form-label"
                                          htmlFor="form6Example2"
                                       >
                                          Address
                                       </label>
                                       <input
                                          type="text"
                                          readOnly
                                          className="form-control"
                                          value={order.address}
                                       />
                                    </div>
                                 </div>
                                 <div className="col-lg-6 mt-4">
                                    <div className="form-outline">
                                       <label
                                          className="form-label"
                                          htmlFor="form6Example2"
                                       >
                                          City
                                       </label>
                                       <input
                                          type="text"
                                          readOnly
                                          className="form-control"
                                          value={order.city}
                                       />
                                    </div>
                                 </div>
                                 <div className="col-lg-6 mt-4">
                                    <div className="form-outline">
                                       <label
                                          className="form-label"
                                          htmlFor="form6Example2"
                                       >
                                          State
                                       </label>
                                       <input
                                          type="text"
                                          readOnly
                                          className="form-control"
                                          value={order.state}
                                       />
                                    </div>
                                 </div>
                                 <div className="col-lg-6 mt-4">
                                    <div className="form-outline">
                                       <label
                                          className="form-label"
                                          htmlFor="form6Example2"
                                       >
                                          Country
                                       </label>
                                       <input
                                          type="text"
                                          readOnly
                                          className="form-control"
                                          value={order.country}
                                       />
                                    </div>
                                 </div>
                              </div>

                              <h5 className="mb-4 mt-4">Billing address</h5>
                              <div className="form-check mb-2">
                                 <input
                                    className="form-check-input me-2"
                                    type="checkbox"
                                    defaultValue=""
                                    id="form6Example8"
                                    defaultChecked=""
                                 />
                                 <label
                                    className="form-check-label"
                                    htmlFor="form6Example8"
                                 >
                                    Same as shipping address
                                 </label>
                              </div>
                           </div>
                        </section>
                        {/* Section: Biling details */}
                     </div>
                     <div className="col-lg-4 mb-4 mb-md-0">
                        {/* Section: Summary */}
                        <section className="shadow-4 p-4 rounded-5 mb-4">
                           <h5 className="mb-3">Cart Summary</h5>
                           <div className="d-flex justify-content-between mb-3">
                              <span>Subtotal </span>
                              <span>&#8358;{order.sub_total}</span>
                           </div>
                           <div className="d-flex justify-content-between mb-3">
                              <span>Shipping </span>
                              <span>&#8358;{order.shipping_amount}</span>
                           </div>
                           <div className="d-flex justify-content-between mb-3">
                              <span>Tax Fee</span>
                              <span>&#8358;{order.tax_fee}</span>
                           </div>
                           <div className="d-flex justify-content-between mb-3">
                              <span>Servive Fee </span>
                              <span>&#8358;{order.service_fee}</span>
                           </div>
                           {order.saved !== "0.00" && (
                              <div className="d-flex text-danger fw-bold justify-content-between mb-3">
                                 <span>Discount </span>
                                 <span>-&#8358;{order.saved}</span>
                              </div>
                           )}
                           <hr className="my-4" />
                           <div className="d-flex justify-content-between fw-bold mb-5">
                              <span>Total </span>
                              <span>&#8358;{order.total}</span>
                           </div>

                           {/* Promo code section */}
                           <section className="shadow rounded-3 card p-4 mb-4 rounded-5">
                              <h5 className="mb-4">Apply Promo Code</h5>
                              <div className="d-flex align-items-center">
                                 <input
                                    type="text"
                                    placeholder="promo code"
                                    className="form-control rounded me-3"
                                    onChange={(e) =>
                                       setCouponCode(e.target.value)
                                    }
                                 />
                                 <button
                                    type="button"
                                    className="btn btn-success btn-rounded overflow-view"
                                    onClick={applyCoupon}
                                 >
                                    Apply
                                 </button>
                              </div>
                           </section>
                           {/* Promo code section */}

                           <div className="shadow p-3 d-flex mt-4 mb-4">
                              <input
                                 readOnly
                                 value={1}
                                 name="couponCode"
                                 type="text"
                                 className="form-control"
                                 style={{ border: "dashed 1px gray" }}
                                 placeholder="Enter Coupon Code"
                                 id=""
                              />
                              <button className="btn btn-success ms-1">
                                 <i className="fas fa-check-circle"></i>
                              </button>
                           </div>

                           {paymentLoading ? (
                              <form
                                 action={`${SERVER_URL}/api/v1/stripe-checkout/${order?.oid}/`}
                                 method="POST"
                              >
                                 <button
                                    type="submit"
                                    className="btn btn-primary btn-rounded w-100 mt-2"
                                    style={{ backgroundColor: "#635BFF" }}
                                    onClick={payWithStripe}
                                    disabled
                                 >
                                    processing payment...
                                 </button>
                              </form>
                           ) : (
                              <form
                                 action={`${SERVER_URL}/api/v1/stripe-checkout/${order?.oid}/`}
                                 method="POST"
                              >
                                 <button
                                    type="submit"
                                    className="btn btn-primary btn-rounded w-100 mt-2"
                                    style={{ backgroundColor: "#635BFF" }}
                                    onClick={payWithStripe}
                                 >
                                    Pay With Stripe{" "}
                                    <i className="fas fa-credit-card"></i>
                                 </button>
                              </form>
                           )}

                           {/* <PayPalScriptProvider options={initialOptions}>
                              <PayPalButtons
                                 className="mt-3"
                                 createOrder={(data, actions) => {
                                    return actions.order.create({
                                       purchase_units: [
                                          {
                                             amount: {
                                                currency_code: "USD",
                                                value: 100,
                                             },
                                          },
                                       ],
                                    });
                                 }}
                                 onApprove={(data, actions) => {
                                    return actions.order
                                       .capture()
                                       .then((details) => {
                                          const name =
                                             details.payer.name.given_name;
                                          const status = details.status;
                                          const payapl_order_id = data.orderID;

                                          console.log(status);
                                          if (status === "COMPLETED") {
                                             navigate(
                                                `/payment-success/${order.oid}/?payapl_order_id=${payapl_order_id}`
                                             );
                                          }
                                       });
                                 }}
                              />
                           </PayPalScriptProvider> */}

                           {/* <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Flutterwave)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paystack)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paypal)</button> */}
                        </section>
                     </div>
                  </div>
               </section>
            </div>
         </main>
      </>
   );
}

export default Checkout;
