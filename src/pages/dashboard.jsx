import React from "react";
import { BarLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Filter } from "lucide-react";
import Error from "@/components/Error";
import useFetch from "../hooks/use-fetch";
import { getUrls } from "../db/apiUrls";
import { getClicksForUrls } from "../db/apiClicks";
import { UrlState } from "../context";
import { useEffect } from "react";
import LinkCard from "../components/LinkCard"
import CreateLink from "../components/CreateLink"

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();
  const {
    loading,
    error,
    data: urls,
    fn: fnUrls,
  } = useFetch(getUrls, user?.id);
  const {
    loading: loadingClicks,
    error: errorClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) {
      fnClicks();
    }
  }, [urls?.length]);

  const filteredUrls = urls?.filter((url) => {
    return url.title.toLowerCase().includes(searchQuery.toLowerCase());
  });
 

  return (
    <div className="flex flex-col gap-8">
      {(loadingClicks || loading) && (
        <BarLoader className="mb-4" width={"100%"} color={"#36d7b7"} />
      )}
      <div className="grid grid-cols-2 gap-14 ">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p> {clicks?.length} </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">My Links</h1>
        {/* <Button>Create link</Button> */}
        <CreateLink/>
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>

      {error && <Error message={error?.message} />}

      {
        (filteredUrls||[]).map((url,ind)=>{
          return <LinkCard key={ind} url={url} fetchUrls={fnUrls} />
        })
      }
    </div>
  );
};

export default Dashboard;
