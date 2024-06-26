import supabase from "./supabase";
import { UAParser } from "ua-parser-js";


// Fetches all clicks of all urls for a user
export const getClicksForUrls = async (urlIds) => {
  //urlIds->Array of url ids
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to Load Clicks");
  }
  return data;
};

const parser = new UAParser();

export const storeClicks = async ({ id, originalUrl }) => {
  try {
    // console.log("storeClicks ")
    const res = parser.getResult();
    const device = res.type || "desktop";
    const locationRes = await fetch("https://ipapi.co/json");
    const { city, country_name: country } = await locationRes.json();

    await supabase.from("clicks").insert({
      url_id: id,
      city: city,
      country: country,
      device: device,
    });

    window.location.href = originalUrl;
  } catch (e) {
    console.error("Error recording click", error);
  }
};


// Fetches all clicks for one give url for a user
export const getClicksForUrl = async (url_id) => {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load Stats");
  }
  return data;
};
