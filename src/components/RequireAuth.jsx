import React, { useEffect } from "react";
import { UrlState } from "../context";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RequireAuth = ({children}) => {
  const navigate = useNavigate();

  const { loading, isAuthenticated,initialLoading } = UrlState();

  useEffect(() => {
    if (!isAuthenticated && !loading && !initialLoading ) {
      navigate(`/auth`);
    }
  }, [isAuthenticated, loading,initialLoading]);

  if(loading){
    return <BarLoader width={"100%"} color={"#36d7b7"} />
  }
  if(isAuthenticated){
      return children;
  }
};

export default RequireAuth;
