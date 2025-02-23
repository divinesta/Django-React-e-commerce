import { useAuthStore } from '../store/auth'
import axios from './axios'
import { jwtDecode } from 'jwt-decode'
import Cookie from 'js-cookie'
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
   toast: true,
   position: 'top',
   showConfirmButton: false,
   timer: 3000,
   timerProgressBar: true,
})

export const login = async (email, password) => {
   try {
      const {data, status } = await axios.post(`user/token/`, {
         email,
         password
      })

      if (status === 200) {
         setAuthUser(data.access, data.refresh)

         // Alert - sign in sucessfully
         Toast.fire({
            icon:"success",
            title: "Login Sucessfully"
         })
      }

      return { data, error: null}

   } catch (error) {
      return {
         data: null,
         error: error.response.data?.detail || 'Something went wrong'
      }
   } 
}

export const register = async (full_name, email, phone, password, password2) => {
   try {
      const { data } = await axios.post("user/register/", {
         full_name,
         email,
         phone,
         password,
         password2
      })

      await login(email, password)

      // Alert - sign up sucessfully
      Toast.fire({
            icon:"success",
            title: "Account created Successfully"
         })
      return { data, error: null }
   } catch (error) {
      return {
         data: null,
         error: error.response.data || 'Something went wrong'
      }
   }
}

export const logout = () => {
   Cookie.remove("access_token")
   Cookie.remove("refresh_token")
   useAuthStore.getState().setUser(null)

   // Alert - sign out sucessfully
}

export const setAuthUser = (access_token, refresh_token) => {
   Cookie.set("access_token", access_token, {
      expires: 1,
      secure: true,
      sameSite: 'strict'
   })
   
   Cookie.set("refresh_token", refresh_token, {
      expires: 7,
      secure: true,
      sameSite: 'strict'
   })
   const user = jwtDecode(access_token)
   if (user) {
      useAuthStore.getState().setUser(user)
   }
   useAuthStore.getState().setLoading(false)
}

export const getRefreshToken = async () => {
   const refresh_token = Cookie.get("refresh_token")
   const response = await axios.post("user/refresh/", {
      refresh: refresh_token
   })

   return response.data
}

export const isAccessTokenExpired = (accessToken) => {
   try {
      const { exp } = jwtDecode(accessToken)
      return Date.now() >= exp * 1000
   } catch (error) {
      return true
   }
}