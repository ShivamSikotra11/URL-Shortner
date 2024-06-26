import { getLongUrl } from "@/db/apiUrls";
import { storeClicks } from "@/db/apiClicks";
import useFetch from "@/hooks/use-fetch";
import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();
  const { loading, data, fn: fnGetLongUrl } = useFetch(getLongUrl, id);
  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });
  useEffect(() => {
    fnGetLongUrl();
  }, []);
  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading]);
  console.log(id);

  if (loading || loadingStats) {
    return (
      <>
        <BarLoader className="mb-4" width={"100%"} color={"#36d7b7"} />
        <br />
        Redirecting...
      </>
    );
  }

  return null;
};

export default RedirectLink;
