"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/button";
import { useEffect, useState } from "react";

export default function Home({ form_id }) {
  const [returnData, setReturnData] = useState([]);
  const [show, setShow] = useState(false);

  async function getFromList() {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`/api/return/list?id=${form_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setReturnData(res);
    } else {
      alert("ERROR");
    }
  }

  useEffect(() => {
    if (form_id) {
      getFromList();
    }
  }, [form_id]);

  return (
    <div className="px-10 py-5">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setShow(!show);
          }}
          color={show ? "rose" : "teal"}
        >
          {show ? "隱藏關閉欄位" : "顯示關閉欄位"}
        </Button>
      </div>

      {show ? (
        <Table>
          <TableHead>
            <TableRow className="bg-green-50">
              {returnData.form_title?.map((item, index) => (
                <TableHeader key={`${item.title}${index}`}>{item.title}</TableHeader>
              ))}
              <TableHeader>填表時間</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {returnData.form_return_list?.map((item, index) => (
              <TableRow
                key={index}
                className="hover:bg-blue-50"
              >
                {Array.from({ length: returnData.form_title?.length }, (_, index) => {
                  return <TableCell key={`items${index}`}>{item[`items${index}`]}</TableCell>;
                })}
                <TableCell>{new Date(item.create_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHead>
            <TableRow className="bg-green-50">
              {returnData.form_title?.map((item, index) => (
                <>{item.enable && <TableHeader key={`${item.title}${index}`}>{item.title}</TableHeader>}</>
              ))}
              <TableHeader>填表時間</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {returnData.form_return_list?.map((item, index) => (
              <TableRow
                key={index}
                className="hover:bg-blue-50"
              >
                {Array.from({ length: returnData.form_title?.length }, (_, index) => {
                  if (returnData.form_title[index]?.enable) {
                    return <TableCell key={`items${index}`}>{item[`items${index}`]}</TableCell>;
                  }
                })}
                <TableCell>{new Date(item.create_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
