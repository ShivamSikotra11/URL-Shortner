import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./Error";
import * as Yup from "yup";
import useFetch from "../hooks/use-fetch"
import { login } from "@/db/apiAuth";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {UrlState} from "../context"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errros, setErrors] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get('createNew');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {data,loading,error,fn:fnLogin} = useFetch(login,formData);
  const {fetchUser,user} = UrlState();


  useEffect(()=>{
    // console.log(data);
    if(error === null && data){
      navigate(`/dashboard?${longLink?`createNew=${longLink}`:""}`);
      fetchUser();
      console.log(user);
    }  
  },[data,error]);


  const handleLoginSubmit = async (e) => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid Email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be atleast 6 characters")
          .required("Password is required"),
      });
      await schema.validate(formData, { abortEarly: false });
      // api call
      await fnLogin();
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          to your account if you already have one
        </CardDescription>
        {error &&  <Error message={error.message} />}

      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            onChange={handleInputChange}
          />
          {errros.email &&  <Error message={errros.email} />}
        </div>
        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
            />
          {errros.password &&  <Error message={errros.password} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLoginSubmit}>
          {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
