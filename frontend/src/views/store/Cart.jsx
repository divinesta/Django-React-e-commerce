import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import CartId from "../plugin/CARTID";
import UserData from "../plugin/UserData";
import GetCurrentAddress from "../plugin/UserCountry";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
   toast: true,
   position: "top",
   showConfirmButton: false,
   timer: 3000,
   timerProgressBar: true,
});

const Cart = () => {
   const [cart, setCart] = useState([]);
   const [cartTotal, setCartTotal] = useState(0);
   const [productQuantities, setProductQuantities] = useState("");

   const [fullName, setFullName] = useState("");
   const [email, setEmail] = useState("");
   const [mobile, setMobile] = useState("");

   const [address, setAddress] = useState("");
   const [city, setCity] = useState("");
   const [state, setState] = useState("");
   const [country, setCountry] = useState("");

   const userData = UserData();
   const cart_id = CartId();
   const currentAddress = GetCurrentAddress();

   const fetchCartData = (cartId, userId) => {
      const url = userId
         ? `/cart-list/${cartId}/${userId}`
         : `/cart-list/${cartId}`;
      apiInstance.get(url).then((res) => {
         setCart(res.data);
      });
   };

   const fetchCartTotal = (cartId, userId) => {
      const url = userId
         ? `/cart-detail/${cartId}/${userId}`
         : `/cart-detail/${cartId}`;
      apiInstance.get(url).then((res) => {
         setCartTotal(res.data);
      });
   };

   if (cart_id !== null || cart_id !== undefined) {
      if (userData !== undefined) {
         useEffect(() => {
            fetchCartData(cart_id, userData?.user_id);
            fetchCartTotal(cart_id, userData?.user_id);
         }, []);
      } else {
         useEffect(() => {
            fetchCartData(cart_id, null);
            fetchCartTotal(cart_id, null);
         }, []);
      }
   }

   useEffect(() => {
      const initialQuantities = {};
      cart.forEach((c) => {
         initialQuantities[c.product.id] = c.quantity;
      });
      setProductQuantities(initialQuantities);
   }, [cart]);

   const handleQuantityChange = (event, product_id) => {
      const quantity = event.target.value;

      setProductQuantities((prevState) => ({
         ...prevState,
         [product_id]: quantity,
      }));
   };

   const updateCart = async (
      product_id,
      price,
      shipping_amount,
      colorValue,
      sizeValue
   ) => {
      const quantityValue = productQuantities[product_id];

      const formdata = new FormData();

      formdata.append("product_id", product_id);
      formdata.append("user_id", userData?.user_id);
      formdata.append("quantity", quantityValue);
      formdata.append("price", price);
      formdata.append("shipping_amount", shipping_amount);
      formdata.append("country", currentAddress.country);
      formdata.append("size", sizeValue);
      formdata.append("color", colorValue);
      formdata.append("cart_id", cart_id);

      const response = await apiInstance.post("cart-view/", formdata);

      fetchCartData(cart_id, userData?.user_id);
      fetchCartTotal(cart_id, userData?.user_id);

      Toast.fire({
         icon: "success",
         title: response.data.message,
      });
   };

   const handleDeleteCartItem = async (itemId) => {
      const url = userData?.user_id
         ? `cart-delete/${cart_id}/${itemId}/${userData?.user_id}/`
         : `cart-delete/${cart_id}/${itemId}/`;

      // await apiInstance.delete(url)

      // fetchCartData(cart_id, userData?.user_id);

      try {
         await apiInstance.delete(url);
         fetchCartData(cart_id, userData?.user_id);
         fetchCartTotal(cart_id, userData?.user_id);
      } catch (error) {
         console.error("Error deleting cart item:", error);
      }

      Toast.fire({
         icon: "success",
         title: "Item removed from cart",
      });
   };

   const handleChange = (event) => {
      const { name, value } = event.target;
      switch (name) {
         case "fullName":
            setFullName(value);
            break;
         case "email":
            setEmail(value);
            break;
         case "mobile":
            setMobile(value);
            break;
         case "address":
            setAddress(value);
            break;
         case "city":
            setCity(value);
            break;
         case "state":
            setState(value);
            break;
         case "country":
            setCountry(value);
            break;
         default:
            break;
      }
   };

   const createOrder = async () => {
      console.log(fullName, email, mobile, address, city, state, country);
      //    const formdata = new FormData();

      //    formdata.append("cart_id", cart_id);
      //    formdata.append("user_id", userData?.user_id);
      //    formdata.append("full_name", fullName);
      //    formdata.append("email", email);
      //    formdata.append("mobile", mobile);
      //    formdata.append("address", address);
      //    formdata.append("city", city);
      //    formdata.append("state", state);
      //    formdata.append("country", country);

      //    const response = await apiInstance.post("order-create/", formdata);

      //    if (response.data.status === "success") {
      //       Toast.fire({
      //          icon: "success",
      //          title: response.data.message,
      //       });
      //    } else {
      //       Toast.fire({
      //          icon: "error",
      //          title: response.data.message,
      //       });
      // }
   };

   return (
      <>
         <main className="mt-5">
            <div className="container">
               <main className="mb-6">
                  <div className="container">
                     <section className="">
                        <div className="row gx-lg-5 mb-5">
                           <div className="col-lg-8 mb-4 mb-md-0">
                              <section className="mb-5">
                                 {cart?.map((c, index) => (
                                    <div
                                       className="row border-bottom mb-4"
                                       key={index}
                                    >
                                       <div className="col-md-2 mb-4 mb-md-0">
                                          <div
                                             className="bg-image ripple rounded-5 mb-4 overflow-hidden d-block"
                                             data-ripple-color="light"
                                          >
                                             <Link to="">
                                                <img
                                                   src={c.product?.image}
                                                   className="w-100"
                                                   alt=""
                                                   style={{
                                                      width: "100px",
                                                      objectFit: "cover",
                                                      borderRadius: "10px",
                                                   }}
                                                />
                                             </Link>
                                             <a href="#!">
                                                <div className="hover-overlay">
                                                   <div
                                                      className="mask"
                                                      style={{
                                                         backgroundColor:
                                                            "hsla(0, 0%, 98.4%, 0.2)",
                                                      }}
                                                   />
                                                </div>
                                             </a>
                                          </div>
                                       </div>
                                       <div className="col-md-8 mb-4 mb-md-0">
                                          <Link
                                             to={null}
                                             className="fw-bold text-dark mb-4"
                                          >
                                             {c.product?.title}
                                          </Link>
                                          <p className="mb-0">
                                             <span className="text-muted me-2">
                                                Price:
                                             </span>
                                             <span>&#8358;{c.price}</span>
                                          </p>
                                          {c.size !== "No Size" && (
                                             <p className="mb-0">
                                                <span className="text-muted me-2">
                                                   Size:
                                                </span>
                                                <span>{c.size}</span>
                                             </p>
                                          )}
                                          {c.color !== "No Color" && (
                                             <p className="mb-0">
                                                <span className="text-muted me-2">
                                                   Color:
                                                </span>
                                                <span>{c.color}</span>
                                             </p>
                                          )}
                                          <p className="mb-0">
                                             <span className="text-muted me-2">
                                                Stock Qty:
                                             </span>
                                             <span>{c.product?.stock_qty}</span>
                                          </p>
                                          <p className="mb-0">
                                             <span className="text-muted me-2">
                                                Vendor:
                                             </span>
                                             <span>
                                                {c.product?.vendor?.name}
                                             </span>
                                          </p>
                                          <p className="mt-3">
                                             <button
                                                onClick={() =>
                                                   handleDeleteCartItem(c.id)
                                                }
                                                className="btn btn-danger "
                                             >
                                                <small>
                                                   <i className="fas fa-trash me-2" />
                                                   Remove
                                                </small>
                                             </button>
                                          </p>
                                       </div>
                                       <div className="col-md-2 mb-4 mb-md-0">
                                          <div className="d-flex justify-content-center align-items-center">
                                             <div className="form-outline">
                                                <input
                                                   type="number"
                                                   onChange={(e) =>
                                                      handleQuantityChange(
                                                         e,
                                                         c.product.id
                                                      )
                                                   }
                                                   className="form-control"
                                                   value={
                                                      productQuantities[
                                                         c.product?.id
                                                      ] || c.quantity
                                                   }
                                                   min={1}
                                                />
                                             </div>
                                             <button
                                                onClick={() =>
                                                   updateCart(
                                                      c.product.id,
                                                      c.product.price,
                                                      c.product.shipping_amount,
                                                      c.color,
                                                      c.size
                                                   )
                                                }
                                                className="ms-2 btn btn-primary"
                                             >
                                                <i className="fas fa-rotate-right"></i>
                                             </button>
                                          </div>
                                          <h5 className="mb-2 mt-3 text-center">
                                             <span className="align-middle">
                                                &#8358;{c.sub_total}
                                             </span>
                                          </h5>
                                       </div>
                                    </div>
                                 ))}

                                 {cart.length < 1 && (
                                    <>
                                       <h5>Your Cart Is Empty</h5>
                                       <Link to="/">
                                          {" "}
                                          <i className="fas fa-shopping-cart"></i>{" "}
                                          Continue Shopping
                                       </Link>
                                    </>
                                 )}
                              </section>
                              {cart?.length > 0 && (
                                 <div>
                                    <h5 className="mb-4 mt-4">
                                       Personal Information
                                    </h5>
                                    {/* 2 column grid layout with text inputs for the first and last names */}
                                    <div className="row mb-4">
                                       <div className="col">
                                          <div className="form-outline">
                                             <label
                                                className="form-label"
                                                htmlFor="full_name"
                                             >
                                                {" "}
                                                <i className="fas fa-user"></i>{" "}
                                                Full Name
                                             </label>
                                             <input
                                                type="text"
                                                id=""
                                                name="fullName"
                                                value={fullName}
                                                className="form-control"
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                    </div>

                                    <div className="row mb-4">
                                       <div className="col">
                                          <div className="form-outline">
                                             <label
                                                className="form-label"
                                                htmlFor="form6Example1"
                                             >
                                                <i className="fas fa-envelope"></i>{" "}
                                                Email
                                             </label>
                                             <input
                                                type="text"
                                                id="form6Example1"
                                                className="form-control"
                                                name="email"
                                                value={email}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                       <div className="col">
                                          <div className="form-outline">
                                             <label
                                                className="form-label"
                                                htmlFor="form6Example1"
                                             >
                                                <i className="fas fa-phone"></i>{" "}
                                                Mobile
                                             </label>
                                             <input
                                                type="text"
                                                id="form6Example1"
                                                className="form-control"
                                                name="mobile"
                                                value={mobile}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                    </div>

                                    <h5 className="mb-1 mt-4">
                                       Shipping address
                                    </h5>

                                    <div className="row mb-4">
                                       <div className="col-lg-6 mt-3">
                                          <div className="form-outline">
                                             <label
                                                className="form-label"
                                                htmlFor="form6Example1"
                                             >
                                                {" "}
                                                Address
                                             </label>
                                             <input
                                                type="text"
                                                id="form6Example1"
                                                className="form-control"
                                                name="address"
                                                value={address}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                       <div className="col-lg-6 mt-3">
                                          <div className="form-outline">
                                             <label
                                                className="form-label"
                                                htmlFor="form6Example1"
                                             >
                                                {" "}
                                                City
                                             </label>
                                             <input
                                                type="text"
                                                id="form6Example1"
                                                className="form-control"
                                                name="city"
                                                value={city}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>

                                       <div className="col-lg-6 mt-3">
                                          <div className="form-outline">
                                             <label
                                                className="form-label"
                                                htmlFor="form6Example1"
                                             >
                                                {" "}
                                                State
                                             </label>
                                             <input
                                                type="text"
                                                id="form6Example1"
                                                className="form-control"
                                                name="state"
                                                value={state}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                       <div className="col-lg-6 mt-3">
                                          <div className="form-outline">
                                             <label
                                                className="form-label"
                                                htmlFor="form6Example1"
                                             >
                                                {" "}
                                                Country
                                             </label>
                                             <input
                                                type="text"
                                                id="form6Example1"
                                                className="form-control"
                                                name="country"
                                                value={country}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                           <div className="col-lg-4 mb-4 mb-md-0">
                              {/* Section: Summary */}
                              <section className="shadow-4 p-4 rounded-5 mb-4">
                                 <h5 className="mb-3">Cart Summary</h5>
                                 <div className="d-flex justify-content-between mb-3">
                                    <span>Subtotal</span>
                                    <span>
                                       &#8358;{cartTotal.sub_total?.toFixed(2)}
                                    </span>
                                 </div>
                                 <div className="d-flex justify-content-between">
                                    <span>Shipping </span>
                                    <span>
                                       &#8358;{cartTotal.shipping?.toFixed(2)}
                                    </span>
                                 </div>
                                 <div className="d-flex justify-content-between">
                                    <span>Tax </span>
                                    <span>
                                       &#8358;{cartTotal.tax?.toFixed(2)}
                                    </span>
                                 </div>
                                 <div className="d-flex justify-content-between">
                                    <span>Servive Fee </span>
                                    <span>
                                       &#8358;
                                       {cartTotal.service_fee?.toFixed(2)}
                                    </span>
                                 </div>
                                 <hr className="my-4" />
                                 <div className="d-flex justify-content-between fw-bold mb-5">
                                    <span>Total </span>
                                    <span>
                                       &#8358;{cartTotal.total?.toFixed(2)}
                                    </span>
                                 </div>
                                 <button onClick={createOrder} className="btn btn-primary btn-rounded w-100">
                                    Procees to Checkout{" "}
                                    <i className="fas fa-arrow-right"></i>
                                 </button>
                              </section>

                              {/* Promo code section */}
                              <section className="shadow rounded-3 card p-4 rounded-5">
                                 <h5 className="mb-4">Apply Promo Code</h5>
                                 <div className="d-flex align-items-center">
                                    <input
                                       type="text"
                                       placeholder="promo code"
                                       className="form-control rounded me-3"
                                    />
                                    <button
                                       type="button"
                                       className="btn btn-success btn-rounde overflow-vi"
                                    >
                                       Apply
                                    </button>
                                 </div>
                              </section>
                              {/* Promo code section */}
                           </div>
                        </div>
                     </section>
                  </div>
               </main>
            </div>
         </main>
      </>
   );
};

export default Cart;
