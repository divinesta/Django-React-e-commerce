import { useEffect, useState } from "react";

const MainWrapper = ({ children }) => {
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const handler = async () => {
         setLoading(true);
         await setUser();
         setLoading(false);
      };
      handler();
   }, []);

   return (
      <>
         {loading ? (
            <div>Loading...</div> // Add a loading indicator
         ) : (
            children
         )}
      </>
   );
};

export default MainWrapper;
