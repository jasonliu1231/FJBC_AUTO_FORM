"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { useEffect, useState } from "react";

export default function Home({ form_id }) {
  const [returnData, setReturnData] = useState([]);

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
      <Table>
        <TableHead>
          <TableRow>
            {returnData.form_title?.map((item, index) => (
              <TableHeader key={`${item}${index}`}>{item}</TableHeader>
            ))}
            <TableHeader>填表時間</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {returnData.form_return_list?.map((item, index) => (
            <TableRow key={index}>
              {item.items0 != null && <TableCell>{item.items0}</TableCell>}
              {item.items1 != null && <TableCell>{item.items1}</TableCell>}
              {item.items2 != null && <TableCell>{item.items2}</TableCell>}
              {item.items3 != null && <TableCell>{item.items3}</TableCell>}
              {item.items4 != null && <TableCell>{item.items4}</TableCell>}
              {item.items5 != null && <TableCell>{item.items5}</TableCell>}
              {item.items6 != null && <TableCell>{item.items6}</TableCell>}
              {item.items7 != null && <TableCell>{item.items7}</TableCell>}
              {item.items8 != null && <TableCell>{item.items8}</TableCell>}
              {item.items9 != null && <TableCell>{item.items9}</TableCell>}
              <TableCell>{new Date(item.create_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
