import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { Download } from "lucide-react";
import { Delete } from "lucide-react";
import { Trash } from "lucide-react";
import useFetch from "../hooks/use-fetch";
import { deleteUrl } from "../db/apiUrls";
import { BeatLoader } from "react-spinners";


export const downloadImage = async (url) => {
  const imgUrl = url?.qr;
  const fileName = url?.title || "download"; // Default file name if url.title is not available

  if (imgUrl) {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const urlObject = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = urlObject;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(urlObject); // Clean up the URL object
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  } else {
    console.error("Image URL is not available");
  }
};

const LinkCard = ({ url, fetchUrls }) => {
  

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        className="h-32 object-contain ring ring-blue-500 self-start"
        alt="QR Code"
      />
      <Link
        to={`/link/${url.id}`}
        className=" flex flex-col flex-1"
        // border border-white
      >
        <span className="text-3xl font-bold hover:underline cursor-pointer">
          {url.title}
        </span>
        <span className="text-2xl text-blue-400 font-semibold hover:underline cursor-pointer">
        https://url-trimmr.vercel.app/{url?.custom_url ? url?.custom_url : url?.short_url}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer">
          {url?.original_url}
        </span>
        <span className="flex items-end font-extralight text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(
              `https://trimmr.in/${url?.short_url}`
            );
          }}
        >
          <Copy />
        </Button>
        <Button variant="ghost" onClick={() => downloadImage(url)}>
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={() => fnDelete().then(() => fetchUrls())}
        >
          {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
