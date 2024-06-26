import "../index.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { deleteUrl, getUrl } from "../db/apiUrls";
import { getClicksForUrl } from "../db/apiClicks";

import { UrlState } from "@/context";
import useFetch from "@/hooks/use-fetch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BarLoader, BeatLoader, PuffLoader } from "react-spinners";
import { Button } from "../components/ui/button";
import { downloadImage } from "@/components/LinkCard";
import { LinkIcon, Copy, Download, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Location from "../components/Location";
import DeviceStats from "../components/DeviceStats";
import {UrlState} from "../context";

const Link = () => {
  const { user } = UrlState();
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const {myURL} = UrlState();

  const {
    loading,
    data: url,
    fn: fnGetURL,
    error: errorGetURL,
  } = useFetch(getUrl, { url_id: id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
    error: errorStats,
  } = useFetch(getClicksForUrl, id);
  // console.log(stats);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fnGetURL();
    fnStats();
  }, []);

  if (errorGetURL || errorStats) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url?.short_url;
  }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color={"#36d7b7"} />
      )}
      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5 ">
          <span className="text-4xl md:text-6xl font-bold hover:underline cursor-pointer">
            {url?.title}{" "}
          </span>
          <a
            href={`${myURL}${link}`}
            target="_blank"
            className="text-2xl sm:text-3xl text-blue-400 font-semibold hover:underline cursor-pointer hover:text-blue-500 overflowWrap"
          >
            {myURL}{link}
          </a>
          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-1 text-2xl sm:text-3xl hover:underline cursor-pointer hover:text-blue-200"
          >
            <LinkIcon className="p-1" size={40} />
            <span className="overflowWrap">{url?.original_url}</span>
          </a>
          <span className="flex items-end font-extralight text-lg">
            {new Date(url?.created_at).toLocaleString()}
          </span>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                navigator.clipboard.writeText(
                  `${myURL}${url?.short_url}`
                )
              }
            >
              <Copy />
            </Button>
            <Button variant="ghost" onClick={() => downloadImage(url)}>
              <Download />
            </Button>
            <Button
              variant="ghost"
              onClick={() => fnDelete().then(() => navigate("/dashboard"))}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <Trash />
              )}
            </Button>
          </div>

          {isDesktop ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <img
                  src={url?.qr}
                  className="h-46 self-center sm:self-start object-contain ring ring-blue-500 p-1"
                  alt="QR Code"
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="flex flex-col items-center gap-4">
                  <DialogTitle className="text-3xl">Your QR Code</DialogTitle>
                  <img
                    src={url?.qr}
                    className="h-[20rem] sm:h-[23rem] md:h-[25rem] self-center object-contain ring ring-blue-500 p-1"
                    alt="QR Code"
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger>
                <img
                  src={url?.qr}
                  className="h-46 self-center sm:self-start object-contain ring ring-blue-500 p-1"
                  alt="QR Code"
                />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="text-left">
                  <DrawerTitle className="text-3xl">Your QR Code</DrawerTitle>
                </DrawerHeader>
                <img
                  src={url?.qr}
                  className="h-[20rem]  my-2 self-center object-contain ring ring-blue-500 p-1"
                  alt="QR Code"
                />
                <DrawerFooter className="pt-2">
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </div>
        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-bold tracking-wider">
              Statistics
            </CardTitle>
          </CardHeader>

          {stats && stats?.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p> {stats?.length} </p>
                </CardContent>
              </Card>

              <CardTitle>Location</CardTitle>
              <Location stats={stats} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : !loadingStats ? (
            "No Statistics yet"
          ) : (
            <div className="w-full flex justify-center my-[5rem] ">
              <PuffLoader size={100} color={"#36d7b7"} />
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default Link;
