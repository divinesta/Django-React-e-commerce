import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import apiInstance from '../../utils/axios';
import GetCurrentAddress from '../plugin/UserCountry';
import UserData from '../plugin/UserData';
import CartId from '../plugin/CARTID';


const Product = () => {
   const [products, setProducts] = useState([])
   const [category, setCategory] = useState([])

   const [sizeValue, setSizeValue] = useState([])
   const [colorValue, setColorValue] = useState([])
   const [quantityValue, setQuantityValue] = useState(1)

   const [selectedProduct, setSelectedProduct] = useState({})
   const [selectedColors, setSelectedColors] = useState({})
   const [selectedSize, setSelectedSize] = useState({})

   const currentAddress = GetCurrentAddress()
   const userData = UserData()
   const cart_id = CartId()


   const handleColorButtonClick = (event, product_id, colorName) => {
      setColorValue(colorName)
      setSelectedProduct(product_id)

      setSelectedColors((prev) => ({
         ...prev,
         [product_id]: colorName
      }))
   }

   const handleSizeButtonClick = (event, product_id, sizeName) => {
      setSizeValue(sizeName)
      setSelectedProduct(product_id)

      setSelectedSize((prev) => ({
         ...prev,
         [product_id]: sizeName
      }))
   }

   const handleQuantityChange = (event, product_id) => {
      setQuantityValue(event.target.value)
      setSelectedProduct(product_id)
   }

   const handleAddToCart = async (product_id, price, shipping_amount) => {
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

      const response = await apiInstance.post(`cart-view/`, formdata)
      console.log(response.data)
   }

   useEffect(() => {
      apiInstance.get(`products/`).then((res) => {
         setProducts(res.data)
      })
   }, [])

   useEffect(() => {
      apiInstance.get(`category/`).then((res) => {
         setCategory(res.data)
      })
   }, [])

   return (
      <>
         <main className="mt-5">
            <div className="container">
               <section className="text-center">
                  <div className="row">
                     {products.map((product, index) => (
                        <div key={index} className="col-lg-4 col-md-12 mb-4">
                           <div className="card">
                              <div
                                 className="bg-image hover-zoom ripple"
                                 data-mdb-ripple-color="light"
                              >
                                 <Link to={`/detail/${product.slug}/`}>
                                    <img
                                       src={product.image}
                                       className="w-100"
                                       style={{
                                          width: "100%",
                                          height: "250px",
                                          objectFit: "contain",
                                       }}
                                    />
                                 </Link>
                                 {/* <a href="#!">
                                    <div className="mask">
                                       <div className="d-flex justify-content-start align-items-end h-100">
                                          <h5>
                                             <span className="badge badge-primary ms-2">
                                                New
                                             </span>
                                          </h5>
                                       </div>
                                    </div>
                                    <div className="hover-overlay">
                                       <div
                                          className="mask"
                                          style={{
                                             backgroundColor:
                                                "rgba(251, 251, 251, 0.15)",
                                          }}
                                       />
                                    </div>
                                 </a> */}
                              </div>
                              <div className="card-body">
                                 <Link
                                    to={`/detail/${product.slug}/`}
                                    className="text-reset"
                                 >
                                    <h5 className="card-title mb-3">
                                       {product.title}
                                    </h5>
                                 </Link>
                                 <a href="" className="text-reset">
                                    <p>{product.category?.title}</p>
                                 </a>
                                 <div className="d-flex justify-content-center">
                                    <h6 className="mb-3">{product.price}</h6>
                                    <h6 className="mb-3 text-muted ms-2">
                                       <strike>#{product.old_price}</strike>
                                    </h6>
                                 </div>
                                 <div className="btn-group">
                                    <button
                                       className="btn btn-primary dropdown-toggle"
                                       type="button"
                                       id="dropdownMenuClickable"
                                       data-bs-toggle="dropdown"
                                       data-bs-auto-close="false"
                                       aria-expanded="false"
                                    >
                                       Variation
                                    </button>
                                    <ul
                                       className="dropdown-menu"
                                       aria-labelledby="dropdownMenuClickable"
                                    >
                                       <div className="d-flex flex-column">
                                          <li className="p-1">
                                             <b>Quantity</b>
                                          </li>
                                          <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                             <li>
                                                <input
                                                   className="form-control"
                                                   onChange={(e) =>
                                                      handleQuantityChange(
                                                         e,
                                                         product.id
                                                      )
                                                   }
                                                   type="number"
                                                />
                                             </li>
                                          </div>
                                       </div>
                                       {product.size?.length > 0 && (
                                          <div className="d-flex flex-column">
                                             <li className="p-1">
                                                <b>Size</b>:{" "}
                                                {selectedSize[product.id] ||
                                                   "Select Size"}
                                             </li>
                                             <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                                {product.size?.map(
                                                   (size, index) => (
                                                      <li key={index}>
                                                         <button
                                                            onClick={(e) =>
                                                               handleSizeButtonClick(
                                                                  e,
                                                                  product.id,
                                                                  size.name
                                                               )
                                                            }
                                                            className="btn btn-secondary btn-sm me-2 mb-1"
                                                         >
                                                            {size.name}
                                                         </button>
                                                      </li>
                                                   )
                                                )}
                                             </div>
                                          </div>
                                       )}
                                       {product.color?.length > 0 && (
                                          <div className="d-flex flex-column mt-3">
                                             <li className="p-1">
                                                <b>Color</b>:{" "}
                                                {selectedColors[product.id] ||
                                                   "Select Color"}
                                             </li>
                                             <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                                {product.color?.map(
                                                   (color, index) => (
                                                      <li key={index}>
                                                         <button
                                                            className="btn btn-sm me-2 mb-1 p-3"
                                                            style={{
                                                               backgroundColor: `${color.color_code}`,
                                                            }}
                                                            onClick={(e) =>
                                                               handleColorButtonClick(
                                                                  e,
                                                                  product.id,
                                                                  color.name
                                                               )
                                                            }
                                                         />
                                                      </li>
                                                   )
                                                )}
                                             </div>
                                          </div>
                                       )}
                                       <div className="d-flex mt-3 p-1">
                                          <button
                                             type="button"
                                             className="btn btn-primary me-1 mb-1"
                                             onClick={() =>
                                                handleAddToCart(
                                                   product.id,
                                                   product.price,
                                                   product.shipping_amount
                                                )
                                             }
                                          >
                                             <i className="fas fa-shopping-cart" />
                                          </button>
                                          <button
                                             type="button"
                                             className="btn btn-danger px-3 me-1 mb-1 ms-2"
                                          >
                                             <i className="fas fa-heart" />
                                          </button>
                                       </div>
                                    </ul>
                                    <button
                                       type="button"
                                       className="btn btn-danger px-3 me-1 ms-2"
                                    >
                                       <i className="fas fa-heart" />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}

                     <div className="row">
                        {category.map((cat, index) => (
                           <div key={index} className="col-lg-2">
                              <img
                                 src={cat.image}
                                 style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                 }}
                                 alt=""
                              />
                              <h6>{cat.title}</h6>
                           </div>
                        ))}
                     </div>
                  </div>
               </section>
               {/*Section: Wishlist*/}
            </div>
         </main>
      </>
   );
}

export default Product;