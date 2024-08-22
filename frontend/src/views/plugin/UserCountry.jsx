import { useState, useEffect } from "react";

const GetCurrentAddress = () => {
   const [address, setAddress] = useState(null);

   useEffect(() => {
      navigator.geolocation.getCurrentPosition((position) => {
         const { latitude, longitude } = position.coords;

         const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

         fetch(url)
            .then((response) => response.json())
            .then((data) => setAddress(data.address));
      });
   }, []);



   return address;
};

export default GetCurrentAddress;
