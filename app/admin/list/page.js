"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/button";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/dialog";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [formList, setFormList] = useState([]);
  const [QRCode, setQRCode] = useState("");

  async function getFrom() {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };

    const response = await fetch("/api/from/list", config);
    const res = await response.json();
    if (response.ok) {
      setFormList(res);
    } else {
      alert("ERROR");
    }
  }

  async function setFrom(id, enable) {
    const config = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id,
        enable: enable
      })
    };

    const response = await fetch("/api/from/switch", config);
    const res = await response.json();
    if (response.ok) {
      setFormList(res);
    } else {
      alert("ERROR");
    }
  }

  useEffect(() => {
    getFrom();
  }, []);

  return (
    <div className="px-10 py-5">
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
      >
        <DialogTitle>QRCode</DialogTitle>
        <DialogBody>
          <div className="mt-3 flex items-center justify-center">{QRCode != "" && <QRCodeSVG value={QRCode} />}</div>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => setIsOpen(false)}
          >
            關閉
          </Button>
        </DialogActions>
      </Dialog>

      <Table>
        <TableHead>
          <TableRow className="bg-green-50">
            <TableHeader>名稱</TableHeader>
            <TableHeader>期限</TableHeader>
            <TableHeader>自動開啟</TableHeader>
            <TableHeader>自動關閉</TableHeader>
            <TableHeader>單位</TableHeader>
            <TableHeader>類別</TableHeader>
            <TableHeader>狀態</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {formList.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-blue-50"
            >
              <TableCell className="font-bold">{item.name}</TableCell>
              <TableCell>{item.deadline && new Date(item.deadline).toLocaleString()}</TableCell>
              <TableCell>{item.auto_open && new Date(item.auto_open).toLocaleDateString()}</TableCell>
              <TableCell>{item.auto_close && new Date(item.auto_close).toLocaleDateString()}</TableCell>
              <TableCell>{item.department}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className={`${item.enable ? "text-green-500" : "text-red-500"}`}>{item.enable ? "開啟中" : "關閉中"}</TableCell>
              <TableCell>
                <Button
                  color={item.enable ? "red" : "green"}
                  className="mx-1"
                  onClick={() => {
                    setFrom(item.id, !item.enable);
                  }}
                >
                  {item.enable ? "關閉" : "啟用"}
                </Button>
                <Button
                  color="blue"
                  className="mx-1"
                  onClick={() => {
                    window.open(`${process.env.NEXT_PUBLIC_URL}?id=${item.id}`, "_blank");
                  }}
                >
                  表單頁
                </Button>
                <Button
                  color="blue"
                  className="mx-1"
                  type="button"
                  onClick={() => {
                    setIsOpen(true);
                    setQRCode(`${process.env.NEXT_PUBLIC_URL}id=${item.id}`);
                  }}
                >
                  QRCode
                </Button>
                <Button
                  color="amber"
                  className="mx-1"
                  type="button"
                  onClick={() => {
                    window.location.href = `/admin/update?id=${item.id}`;
                  }}
                >
                  修改
                </Button>
                <Button
                  color="cyan"
                  className="mx-1"
                  type="button"
                  onClick={() => {
                    window.location.href = `/admin/analysis?id=${item.id}`;
                  }}
                >
                  統計
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
