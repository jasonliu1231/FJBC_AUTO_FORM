"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import List from "./list";
import Pic from "./pic";

export default function Home() {
  let [isList, setIsList] = useState(true);
  let [id, setId] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    setId(id);
  }, []);

  return (
    <div className="px-10 py-5">
      <Button
        color="violet"
        className="mx-1"
        onClick={() => {
          setIsList(true);
        }}
      >
        統計表
      </Button>
      <Button
        color="purple"
        className="mx-1"
        onClick={() => {
          setIsList(false);
        }}
      >
        統計圖
      </Button>
      {isList ? <List form_id={id} /> : <Pic form_id={id} />}
    </div>
  );
}
