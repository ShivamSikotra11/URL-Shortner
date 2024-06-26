import { createContext } from "react";
import useFetch from "./hooks/use-fetch";
import { getCurrentUser } from "./db/apiAuth";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
const UrlContext = createContext();

const UrlProvider = ({ children }) => {
  const { data: user, loading, fn: fetchUser } = useFetch(getCurrentUser);
  const isAuthenticated = user?.role === "authenticated";
  const [initialLoading,setInitialLoading] = useState(true);

  useEffect(()=>{
    // console.log("User fetched from context");
    fetchUser().then(()=>setInitialLoading(false));
  },[]);

  return (
  <UrlContext.Provider value={{user,fetchUser,initialLoading,loading,isAuthenticated}} >
    {children}
  </UrlContext.Provider>
  );
};
export const UrlState = () => useContext(UrlContext);
export default UrlProvider;
