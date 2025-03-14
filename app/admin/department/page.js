"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/button";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/dialog";
import { Field, Label } from "@/components/fieldset";
import { Input } from "@/components/input";
import { useEffect, useState } from "react";

export default function Home({ form_id }) {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [create, setCreate] = useState({ name: "" });
  const [departmentList, setDepartmentList] = useState([]);

  async function getDepartmentList() {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`/api/department/list`, config);
    const res = await response.json();
    if (response.ok) {
      setDepartmentList(res);
    } else {
      alert("ERROR");
    }
  }

  async function createDepartment() {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(create)
    };

    const response = await fetch(`/api/department/create`, config);
    const res = await response.json();
    if (response.ok) {
      setDepartmentList(res);
      setOpenCreate(false);
    } else {
      alert("ERROR");
    }
  }

  async function updateDepartment() {
    const config = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(update)
    };

    const response = await fetch(`/api/department/update`, config);
    const res = await response.json();
    if (response.ok) {
      setDepartmentList(res);
      setOpenUpdate(false);
    } else {
      alert("ERROR");
    }
  }

  async function switchDepartment(id, enable) {
    const config = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id, enable: enable })
    };

    const response = await fetch(`/api/department/switch`, config);
    const res = await response.json();
    if (response.ok) {
      setDepartmentList(res);
    } else {
      alert("ERROR");
    }
  }

  useEffect(() => {
    getDepartmentList();
  }, []);

  return (
    <div className="px-10 py-5">
      <div className="flex justify-end m-5">
        <Button
          color="blue"
          onClick={() => setOpenCreate(true)}
        >
          新增
        </Button>
      </div>
      {/* 新增 */}
      <Dialog
        open={openCreate}
        onClose={setOpenCreate}
      >
        <DialogTitle>新增部門</DialogTitle>
        <DialogBody>
          <Field>
            <Label>部門名稱</Label>
            <Input
              name="full_name"
              value={create.name}
              onChange={(e) => {
                setCreate({
                  ...create,
                  name: e.target.value
                });
              }}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => setOpenCreate(false)}
          >
            關閉
          </Button>
          <Button
            color="green"
            onClick={createDepartment}
          >
            新增
          </Button>
        </DialogActions>
      </Dialog>
      {/* 修改 */}
      <Dialog
        open={openUpdate}
        onClose={setOpenUpdate}
      >
        <DialogTitle>修改部門</DialogTitle>
        <DialogBody>
          <Field>
            <Label>部門名稱</Label>
            <Input
              name="full_name"
              value={update.name}
              onChange={(e) => {
                setUpdate({
                  ...update,
                  name: e.target.value
                });
              }}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => setOpenUpdate(false)}
          >
            關閉
          </Button>
          <Button
            plain
            onClick={updateDepartment}
          >
            修改
          </Button>
        </DialogActions>
      </Dialog>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>部門名稱</TableHeader>
            <TableHeader>狀態</TableHeader>
            <TableHeader>建立時間</TableHeader>
            <TableHeader>設定</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {departmentList.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.enable ? "啟用中" : "關閉中"}</TableCell>
              <TableCell>{new Date(item.create_at).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  className="mx-1"
                  type="button"
                  onClick={() => {
                    switchDepartment(item.id, !item.enable);
                  }}
                >
                  {item.enable ? "關閉" : "開啟"}
                </Button>
                <Button
                  className="mx-1"
                  type="button"
                  onClick={() => {
                    setUpdate(item);
                    setOpenUpdate(true);
                  }}
                >
                  修改
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
