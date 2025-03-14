"use client";

import { Field, Label, Description, Fieldset, Legend } from "@/components/fieldset";
import { Input } from "@/components/input";
import { Listbox, ListboxLabel, ListboxOption } from "@/components/listbox";
import { Radio, RadioField, RadioGroup } from "@/components/radio";
import { Switch } from "@/components/switch";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { useEffect, useLayoutEffect, useState } from "react";
import Editor from "../Editor";

const item_def = {
  enable: true,
  type: "1",
  required: true,
  title: "",
  content: [{}]
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
  const [form, setForm] = useState({
    name: "",
    content: "",
    deadline: "",
    auto_open: "",
    auto_close: "",
    department: "0"
  });
  const [detail, setDetail] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [textareaValue, setTextareaValue] = useState("");

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

          // 设置 canvas 宽高为图片的原始宽高
          canvas.width = img.width;
          canvas.height = img.height;

          // 将图片绘制到 canvas 上
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // 生成图片的 Data URL
          const originalImageUrl = canvas.toDataURL("image/jpeg");

          // 将图片的 Data URL 设置为状态
          setImageUrl(originalImageUrl);
        };
      };

      reader.readAsDataURL(file);
    }
  }

  async function updateFrom() {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        banner: imageUrl,
        content: textareaValue,
        detail: detail
      })
    };

    const response = await fetch("/api/from/update", config);
    const res = await response.json();
    if (response.ok) {
      alert("修改完成！");
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
      setImageUrl(res.form?.banner);
      setTextareaValue(res.form?.content);
    } else {
      alert("ERROR");
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    getFrom(id);
  }, []);

  return (
    <div className="p-10">
      <div className="grid grid-cols-3 gap-5 p-10 border">
        <Field>
          <Label>表單名稱</Label>
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
            name="department"
            defaultValue="active"
            value={form.department}
            onChange={(val) => {
              setForm({
                ...form,
                department: val
              });
            }}
          >
            <ListboxOption value="1">
              <ListboxLabel>餐廳</ListboxLabel>
            </ListboxOption>
            <ListboxOption value="2">
              <ListboxLabel>健身房</ListboxLabel>
            </ListboxOption>
          </Listbox>
        </Field>
        <Field>
          <Label>Banner 圖片</Label>
          <Input
            name="banner"
            type="file"
            value={""}
            onChange={handleFileChange}
          />
        </Field>
        <div className="col-span-1">
          <Editor
            textareaValue={textareaValue}
            setTextareaValue={setTextareaValue}
          />
        </div>
        {imageUrl && (
          <div className="col-span-2 flex justify-center items-center bg-gray-100">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-1/2"
            />
          </div>
        )}
      </div>
      {/* 一組 */}
      {detail.map((item, index) => {
        return (
          <div
            key={index}
            className="border-b-1 p-5"
          >
            <div className="grid grid-cols-8 gap-5">
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
                    <Radio value={true} />
                    <Label>開啟</Label>
                  </RadioField>
                  <RadioField>
                    <Radio value={false} />
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
                    <Radio value={true} />
                    <Label>是</Label>
                  </RadioField>
                  <RadioField>
                    <Radio value={false} />
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
                    <Radio value="1" />
                    <Label>輸入</Label>
                  </RadioField>
                  <RadioField>
                    <Radio value="2" />
                    <Label>單選</Label>
                  </RadioField>
                  <RadioField>
                    <Radio value="3" />
                    <Label>多選</Label>
                  </RadioField>
                  <RadioField>
                    <Radio value="4" />
                    <Label>行事曆</Label>
                  </RadioField>
                </RadioGroup>
              </Fieldset>
              <Field className="col-span-2">
                <Label>欄位名稱</Label>
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
            </div>
          </div>
        );
      })}
      <div className="flex justify-between p-5">
        <Button
          onClick={() => {
            if (detail.length < 20) {
              setDetail([...detail, item_def]);
            }
          }}
        >
          新增客製化框
        </Button>
        <Button onClick={updateFrom}>更新</Button>
      </div>
    </div>
  );
}
