import React, { useEffect } from "react";
import { UrlState } from "../context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QRCode } from "react-qrcode-logo";
import Error from "./Error";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { useRef } from "react";
import useFetch from "../hooks/use-fetch";
import { createUrl } from "../db/apiUrls";
import { BeatLoader } from "react-spinners";

const CreateLink = () => {
  const { user } = UrlState();
  const navigate = useNavigate();
  const ref = useRef();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const initialStateFormData = {
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  };

  let [errors, setErrors] = useState({});
  let [formData, setFormData] = useState(initialStateFormData);

  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    longUrl: Yup.string()
      .url("Must be a valid URL")
      .required("URL is required"),
    customUrl: Yup.string(),
  });

  const handleOnChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  const {
    error,
    loading,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formData, user_id: user.id });

  const handleCreateURLSubmit = async () => {
    setErrors({});
    try {
      await schema.validate(formData, { abortEarly: false });
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  useEffect(() => {
    if (!error && data) {
      // data will give an array with 1st ele contains something like this:
    //   {
    //     created_at: "2024-06-25T14:24:48.196+00:00";
    //     custom_url: null;
    //     id: 3;
    //     original_url: "https://vscode.dev/";
    //     qr: "https://aoziiuaydkmzvvrxffwx.supabase.co/storage/v1/object/public/qrs/dp-cp37";
    //     short_url: "cp37";
    //     title: "vxcode";
    //     user_id: "0ff48242-f4c2-46c7-881e-2030de89907b";
    //   }
      console.log(data);
      navigate(`/link/${data[0].id}`);
    }
  }, [data, error]);

  return (
    // jo longLink hoy upar to jyare bhi shorten click kari dashboard par aave to automatically aa open thai jay
    // and jem dialog box bandh thay upar thi longLink vayi  javi joye
    // !res => dialog bandh thay gyu
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) {
          setSearchParams({});
          setFormData(initialStateFormData);
        }
      }}
    >
      <DialogTrigger>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl tracking-wide">
            Create New
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center">
          {formData?.longUrl && (
            <QRCode value={formData?.longUrl} ref={ref} size={200} />
          )}
        </div>

        <Input
          id="title"
          placeholder="Short link's Title"
          value={formData.title}
          onChange={handleOnChange}
        />
        {errors.title && <Error message={errors.title} />}

        <Input
          id="longUrl"
          placeholder="Enter your Looong URL"
          value={formData.longUrl}
          onChange={handleOnChange}
        />
        {errors.longUrl && <Error message={errors.longUrl} />}

        <div className="flex items-center gap-4">
          <Card className="p-2">trimrr.in</Card> /
          <Input
            id="customUrl"
            value={formData.customUrl}
            onChange={handleOnChange}
            placeholder="Custom link (Optional)"
          />
        </div>
        {error && <Error message={errors.message} />}
        <DialogFooter className="sm:justify-start">
          <Button
            disabled={loading}
            onClick={handleCreateURLSubmit}
            variant="destructive"
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
