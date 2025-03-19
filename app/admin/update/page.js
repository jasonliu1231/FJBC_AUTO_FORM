"use client";

import { Field, Label, Description, Fieldset, Legend } from "@/components/fieldset";
import { Input } from "@/components/input";
import { Listbox, ListboxLabel, ListboxOption } from "@/components/listbox";
import { Radio, RadioField, RadioGroup } from "@/components/radio";
import { Switch } from "@/components/switch";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Editor from "../Editor";

const item_def = {
  enable: true,
  type: "1",
  required: true,
  title: "",
  content: [{ enable: true, content: [] }]
};

function changeDate(data) {
  if (!data) return;
  return new Date(data).toISOString().split("T")[0];
}

function changeDateTime(data) {
  if (!data) return;
  const dateObj = new Date(data);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  const dateStr = `${year}-${month}-${day}T${hours}:${minutes}`;

  return dateStr;
}

export default function Home() {
  const form_id = useRef();
  const [form, setForm] = useState({
    id: "",
    name: "",
    content: "",
    enable: true,
    deadline: "",
    auto_open: "",
    auto_close: "",
    department_id: "",
    category_id: "",
    finish_message: ""
  });
  const [detail, setDetail] = useState([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [bannerImage, setBannerImage] = useState("");
  const [finishImage, setFinishImage] = useState("");

  function handleFileChange(event) {
    const file = event.target.files[0]; // 获取选中的文件
    if (file) {
      const reader = new FileReader(); // 创建 FileReader 来读取文件

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const originalImageUrl = canvas.toDataURL("image/jpeg");

          if (event.target.name === "banner") {
            setBannerImage(originalImageUrl);
          } else if (event.target.name === "finish_photo") {
            setFinishImage(originalImageUrl);
          }
        };
      };

      reader.readAsDataURL(file);
    }
  }

  async function updateFrom() {
    const seen = new Set();
    const hasDuplicate = detail.some((item) => (seen.has(item.index) ? true : (seen.add(item.index), false)));
    if (hasDuplicate) {
      alert("欄位序號重複");
      return;
    }

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        banner: bannerImage,
        finish_photo: finishImage,
        content: textareaValue,
        detail: detail
      })
    };

    const response = await fetch("/api/from/update", config);
    const res = await response.json();
    if (response.ok) {
      alert("修改完成！");
      window.location.href = "/admin/list";
    } else {
      alert(res.msg);
    }
  }

  async function getFrom(id) {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`/api/from/detail?id=${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setForm(res.form);
      setDetail(res.detail);
      setBannerImage(res.form?.banner);
      setFinishImage(res.form?.finish_photo);
      setTextareaValue(res.form?.content);
    } else {
      alert("ERROR");
    }
  }

  async function getCategoryList() {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`/api/category/list`, config);
    const res = await response.json();
    if (response.ok) {
      setCategoryList(res);
    } else {
      alert("ERROR");
    }
  }

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

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    form_id.current = id;
    getFrom(id);
    getCategoryList();
    getDepartmentList();
  }, []);

  return (
    <div className="p-10">
      <div className="grid grid-cols-3 gap-5 p-10 border">
        <Field>
          <Label>
            表單名稱<span className="text-red-600">(必填欄位)</span>
          </Label>
          <Input
            name="name"
            value={form.name}
            onChange={(e) => {
              setForm({
                ...form,
                name: e.target.value
              });
            }}
          />
        </Field>
        <Field>
          <Label>期限</Label>
          <Input
            name="deadline"
            type="datetime-local"
            value={changeDateTime(form.deadline)}
            onChange={(e) => {
              setForm({
                ...form,
                deadline: e.target.value
              });
            }}
          />
        </Field>
        <Field>
          <Label>自動開啟</Label>
          <Input
            name="auto_open"
            type="date"
            value={changeDate(form.auto_open)}
            onChange={(e) => {
              setForm({
                ...form,
                auto_open: e.target.value
              });
            }}
          />
        </Field>
        <Field>
          <Label>自動關閉</Label>
          <Input
            name="auto_close"
            type="date"
            value={changeDate(form.auto_close)}
            onChange={(e) => {
              setForm({
                ...form,
                auto_close: e.target.value
              });
            }}
          />
        </Field>
        <Field>
          <Label>單位</Label>
          <Listbox
            name="department_id"
            value={form.department_id}
            onChange={(val) => {
              setForm({
                ...form,
                department_id: val
              });
            }}
          >
            {departmentList.map((item) => (
              <ListboxOption
                key={item.id}
                value={item.id}
              >
                <ListboxLabel>{item.name}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>
        </Field>
        <Field>
          <Label>表單類型</Label>
          <Listbox
            name="category_id"
            value={form.category_id}
            onChange={(val) => {
              setForm({
                ...form,
                category_id: val
              });
            }}
          >
            {categoryList.map((item) => (
              <ListboxOption
                key={item.id}
                value={item.id}
              >
                <ListboxLabel>{item.name}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>
        </Field>
        <div className="col-span-1 row-span-3">
          <Editor
            textareaValue={textareaValue}
            setTextareaValue={setTextareaValue}
          />
        </div>
        <Field>
          <Label>Banner 圖片</Label>
          <Input
            name="banner"
            type="file"
            onChange={handleFileChange}
          />
        </Field>
        <Field>
          <Label>Banner 預覽</Label>
          {bannerImage && (
            <div className="col-span-1 flex justify-center items-center bg-gray-100">
              <img
                src={bannerImage}
                alt="Uploaded"
                className="w-1/2"
              />
            </div>
          )}
        </Field>

        <Field>
          <Label>結束圖片</Label>
          <Input
            name="finish_photo"
            type="file"
            onChange={handleFileChange}
          />
        </Field>
        <Field>
          <Label>結束圖片 預覽</Label>
          {finishImage && (
            <div className="col-span-1 flex justify-center items-center bg-gray-100">
              <img
                src={finishImage}
                alt="Uploaded"
                className="w-1/2"
              />
            </div>
          )}
        </Field>

        <Field>
          <Label>結束訊息</Label>
          <Input
            name="finish_message"
            value={form.finish_message}
            onChange={(e) => {
              setForm({
                ...form,
                finish_message: e.target.value
              });
            }}
          />
        </Field>
      </div>
      {/* 一組 */}
      {detail.map((item, index) => {
        return (
          <div
            key={index}
            className="border-b-1 p-5"
          >
            <div className="grid grid-cols-8 gap-5">
              <Field>
                <Label>欄位序號</Label>
                <Input
                  name="name"
                  type="number"
                  value={item.index}
                  onChange={(e) => {
                    setDetail(
                      detail.map((i, idx) => {
                        if (idx == index) {
                          return {
                            ...i,
                            index: Number(e.target.value)
                          };
                        } else {
                          return i;
                        }
                      })
                    );
                  }}
                />
              </Field>
              <Fieldset>
                <Legend>啟用</Legend>
                <RadioGroup
                  name={`enable` + index}
                  value={item.enable}
                  onChange={(val) => {
                    setDetail(
                      detail.map((i, idx) => {
                        if (idx == index) {
                          return {
                            ...i,
                            enable: val
                          };
                        } else {
                          return i;
                        }
                      })
                    );
                  }}
                >
                  <RadioField>
                    <Radio
                      color="cyan"
                      value={true}
                    />
                    <Label>開啟</Label>
                  </RadioField>
                  <RadioField>
                    <Radio
                      color="cyan"
                      value={false}
                    />
                    <Label>關閉</Label>
                  </RadioField>
                </RadioGroup>
              </Fieldset>
              <Fieldset>
                <Legend>必填</Legend>
                <RadioGroup
                  name={`required` + index}
                  value={item.required}
                  onChange={(val) => {
                    setDetail(
                      detail.map((i, idx) => {
                        if (idx == index) {
                          return {
                            ...i,
                            required: val
                          };
                        } else {
                          return i;
                        }
                      })
                    );
                  }}
                >
                  <RadioField>
                    <Radio
                      color="blue"
                      value={true}
                    />
                    <Label>是</Label>
                  </RadioField>
                  <RadioField>
                    <Radio
                      color="blue"
                      value={false}
                    />
                    <Label>否</Label>
                  </RadioField>
                </RadioGroup>
              </Fieldset>
              <Fieldset>
                <Legend>型態</Legend>
                <RadioGroup
                  name={`type` + index}
                  value={item.type}
                  onChange={(val) => {
                    setDetail(
                      detail.map((i, idx) => {
                        if (idx == index) {
                          return {
                            ...i,
                            type: val
                          };
                        } else {
                          return i;
                        }
                      })
                    );
                  }}
                >
                  <RadioField>
                    <Radio
                      color="sky"
                      value="1"
                    />
                    <Label>輸入</Label>
                  </RadioField>
                  <RadioField>
                    <Radio
                      color="sky"
                      value="2"
                    />
                    <Label>單選</Label>
                  </RadioField>
                  <RadioField>
                    <Radio
                      color="sky"
                      value="3"
                    />
                    <Label>多選</Label>
                  </RadioField>
                  <RadioField>
                    <Radio
                      color="sky"
                      value="4"
                    />
                    <Label>行事曆</Label>
                  </RadioField>
                  <RadioField>
                    <Radio
                      color="sky"
                      value="5"
                    />
                    <Label>備住</Label>
                  </RadioField>
                </RadioGroup>
              </Fieldset>
              <Field className="col-span-2">
                <Label>
                  欄位名稱<span className="text-red-600">(必填欄位)</span>
                </Label>
                <Input
                  name={`title` + index}
                  value={item.title}
                  onChange={(e) => {
                    setDetail(
                      detail.map((i, idx) => {
                        if (idx == index) {
                          return {
                            ...i,
                            title: e.target.value
                          };
                        } else {
                          return i;
                        }
                      })
                    );
                  }}
                />
              </Field>
              {(item.type == 2 || item.type == 3) && (
                <Field className="col-span-2">
                  <Label>內容</Label>
                  {item.content?.map((content, content_index) => (
                    <div
                      key={content_index}
                      className="flex items-center"
                    >
                      <Input
                        value={content.content}
                        onChange={(e) => {
                          setDetail(
                            detail.map((i, idx) => {
                              if (idx == index) {
                                return {
                                  ...i,
                                  content: i.content.map((ii, iidx) => {
                                    if (content_index == iidx) {
                                      return {
                                        ...ii,
                                        content: e.target.value
                                      };
                                    } else {
                                      return ii;
                                    }
                                  })
                                };
                              } else {
                                return i;
                              }
                            })
                          );
                        }}
                      />
                      <Switch
                        className="mx-2"
                        color="green"
                        checked={content.enable}
                        onChange={(val) => {
                          setDetail(
                            detail.map((i, idx) => {
                              if (idx == index) {
                                return {
                                  ...i,
                                  content: i.content.map((ii, iidx) => {
                                    if (content_index == iidx) {
                                      return {
                                        ...ii,
                                        enable: val
                                      };
                                    } else {
                                      return ii;
                                    }
                                  })
                                };
                              } else {
                                return i;
                              }
                            })
                          );
                        }}
                      />
                    </div>
                  ))}
                  <div className="p-2 flex justify-center">
                    <Button
                      color="teal"
                      onClick={() => {
                        setDetail(
                          detail.map((i, idx) => {
                            if (idx == index) {
                              return {
                                ...i,
                                content: [...item.content, { content: "", enable: true }]
                              };
                            } else {
                              return i;
                            }
                          })
                        );
                      }}
                    >
                      新增
                    </Button>
                  </div>
                </Field>
              )}
            </div>
          </div>
        );
      })}
      <div className="flex justify-between p-5">
        <Button
          color="blue"
          onClick={() => {
            if (detail.length < 50) {
              setDetail([...detail, { ...item_def, index: detail.length }]);
            }
          }}
        >
          新增客製化框
        </Button>
        <Button
          color="green"
          onClick={updateFrom}
        >
          更新
        </Button>
      </div>
    </div>
  );
}
