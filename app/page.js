"use client";

import { useEffect, useRef, useState } from "react";
import { Field, Description, Fieldset, Label, Legend } from "@/components/fieldset";
import { Radio, RadioField, RadioGroup } from "@/components/radio";
import { Checkbox, CheckboxField, CheckboxGroup } from "@/components/checkbox";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/dialog";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { Text } from "@/components/text";
import { Button } from "@/components/button";

export default function Home() {
  const [data, setData] = useState({});
  const [form, setForm] = useState();
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [close, setClose] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function checkFrom() {
    let check = true;
    const list = detail.map((item) => {
      if (item.required && item.enable) {
        if (item.type == "1" || item.type == "4" || item.type == "5") {
          if (data[`items${item.index}`].content_value == "") {
            check = false;
            return {
              ...item,
              error: true
            };
          } else {
            return item;
          }
        } else if (item.type == "2") {
          if (data[`items${item.index}`].content_id == "") {
            check = false;
            return {
              ...item,
              error: true
            };
          } else {
            return item;
          }
        } else if (item.type == "3") {
          if (data[`items${item.index}`].content_id.length == 0) {
            check = false;
            return {
              ...item,
              error: true
            };
          } else {
            return item;
          }
        }
      } else {
        return item;
      }
    });

    if (check) {
      saveFrom();
    } else {
      setDetail(list);
      alert(`必填欄位！請幫忙填寫再送出～感謝！`);
    }
  }

  async function saveFrom() {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(`/api/from/save`, config);
    const res = await response.json();
    if (response.ok) {
      setIsOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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

    const response = await fetch(`/api/from/view?id=${id}`, config);
    const res = await response.json();
    if (response.ok) {
      setForm(res.form);
      setDetail(
        res.detail.map((item) => {
          return {
            ...item,
            error: false
          };
        })
      );

      const def_val = res.detail.map((item) => {
        let content_id = null;
        let content_value = "";
        if (item.type == "1") {
          content_id = null;
          content_value = "";
        } else if (item.type == "2") {
          content_id = "";
          content_value = "";
        } else if (item.type == "3") {
          content_id = [];
          content_value = [];
        }

        return {
          type: item.type,
          index: item.index,
          enable: item.enable,
          content_id,
          content_value
        };
      });

      const object = def_val.reduce((acc, item, index) => {
        if (item.enable) {
          acc[`items${item.index}`] = item;
        }
        return acc;
      }, {});

      setData({ form_id: id, ...object });
      setLoading(false);
    } else {
      setClose(true);
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    getFrom(id);
  }, []);

  if (loading) {
    return (
      <div className="max-w-md sm:max-w-xl mx-auto bg-gray-100">
        <Dialog
          open={close}
          onClose={setClose}
          size="sm"
          className="absolute rounded-3xl top-100"
        >
          <DialogTitle className="text-center">
            <span className="text-red-600 text-xl">活動已關閉</span>
          </DialogTitle>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="max-w-md sm:max-w-xl mx-auto bg-gray-100 text-gray-700">
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        size="3xl"
      >
        <DialogTitle className="text-center">{form.finish_message || "感謝您的填寫～"}</DialogTitle>
        <DialogBody>
          {form.finish_photo && (
            <div className="col-span-1 flex justify-center items-center bg-gray-100">
              <img
                src={form.finish_photo}
                alt="Uploaded"
                className="w-full"
              />
            </div>
          )}
        </DialogBody>
        {/* <div className="flex justify-center">
          <Button
            plain
            onClick={() => setIsOpen(false)}
          >
            關閉
          </Button>
        </div> */}
      </Dialog>
      <div className="">
        {form?.banner && (
          <div className="flex justify-center items-center">
            <img
              src={form.banner}
              alt="Uploaded"
              className="w-full"
            />
          </div>
        )}
      </div>
      <div className="max-w-full">
        <div
          dangerouslySetInnerHTML={{ __html: form.content }}
          className="editor p-4"
        />
      </div>

      <div className="p-2">
        <div className="p-3">
          {form.deadline && <div className="text-center text-red-400">活動期限：{new Date(form.deadline).toLocaleString()}</div>}

          {detail.map((items) => (
            <div
              key={items.id}
              className={`my-5 rounded-xl ${items.error ? "bg-red-200" : "bg-gray-200"}`}
            >
              {items.title != "" && items.enable && (
                <div className="p-5">
                  {items.type == "1" ? (
                    <Field>
                      <Label className="text-2xl">
                        <span className="text-lg text-gray-900">{items.title}</span>
                        <span className="text-red-500 m-2">{items.required ? "(必填)" : ""}</span>
                      </Label>
                      <Input
                        className="bg-gray-100 rounded-lg focus:text-gray-600"
                        name={items.title}
                        onChange={(e) => {
                          setData({
                            ...data,
                            [`items${items.index}`]: {
                              ...data[`items${items.index}`],
                              content_id: null,
                              content_value: e.target.value
                            }
                          });
                        }}
                      />
                    </Field>
                  ) : items.type == "2" ? (
                    <Fieldset>
                      <Legend>
                        <span className="text-lg text-gray-900">{items.title}</span>
                        <span className="text-red-500 m-0">{items.required ? "(必填)" : ""}</span>
                      </Legend>
                      <RadioGroup
                        name={items.id}
                        defaultValue="1"
                        onChange={(val) => {
                          const item_val = val.split("@$");
                          setData({
                            ...data,
                            [`items${items.index}`]: {
                              ...data[`items${items.index}`],
                              content_id: item_val[0],
                              content_value: item_val[1]
                            }
                          });
                        }}
                      >
                        {items.content.map((item, index) => (
                          <div key={index}>
                            {item.enable && (
                              <RadioField>
                                <Radio
                                  className="bg-white rounded-full"
                                  color="cyan"
                                  value={`${item.id}@$${item.content}`}
                                />
                                <Label>
                                  <span className="text-gray-600">{item.content}</span>
                                </Label>
                              </RadioField>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    </Fieldset>
                  ) : items.type == "3" ? (
                    <Fieldset>
                      <Legend>
                        <span className="text-lg text-gray-900">{items.title}</span>
                        <span className="text-red-500 mx-2">{items.required ? "(必填)" : ""}</span>
                      </Legend>
                      <CheckboxGroup>
                        {items.content.map((item, index) => (
                          <div key={index}>
                            {item.enable && (
                              <CheckboxField>
                                <Checkbox
                                  className="bg-white rounded-sm"
                                  color="cyan"
                                  name={items.id}
                                  onChange={(checked) => {
                                    if (checked) {
                                      setData({
                                        ...data,
                                        [`items${items.index}`]: {
                                          ...data[`items${items.index}`],
                                          content_id: [...data[`items${items.index}`].content_id, item.id],
                                          content_value: [...data[`items${items.index}`].content_value, item.content]
                                        }
                                      });
                                    } else {
                                      setData({
                                        ...data,
                                        [`items${items.index}`]: {
                                          ...data[`items${items.index}`],
                                          content_id: data[`items${items.index}`].content_id.filter((i) => i != item.id),
                                          content_value: data[`items${items.index}`].content_value.filter((i) => i != item.content)
                                        }
                                      });
                                    }
                                  }}
                                />
                                <Label>
                                  <span className="text-gray-600">{item.content}</span>
                                </Label>
                              </CheckboxField>
                            )}
                          </div>
                        ))}
                      </CheckboxGroup>
                    </Fieldset>
                  ) : items.type == "4" ? (
                    <Field>
                      <Label>
                        <span className="text-lg text-gray-900">{items.title}</span>
                        <span className="text-red-500 mx-2">{items.required ? "(必填)" : ""}</span>
                      </Label>
                      <Input
                        type="datetime-local"
                        name={items.title}
                        onChange={(e) => {
                          setData({
                            ...data,
                            [`items${items.index}`]: {
                              ...data[`items${items.index}`],
                              content_id: null,
                              content_value: new Date(e.target.value).toLocaleString()
                            }
                          });
                        }}
                      />
                    </Field>
                  ) : items.type == "5" ? (
                    <Field>
                      <Label>
                        <span className="text-lg text-gray-900">{items.title}</span>
                        <span className="text-red-500 mx-2">{items.required ? "(必填)" : ""}</span>
                      </Label>
                      <Textarea
                        className="bg-gray-100 rounded-md text-blue-600"
                        name={items.title}
                        onChange={(e) => {
                          setData({
                            ...data,
                            [`items${items.index}`]: {
                              ...data[`items${items.index}`],
                              content_id: null,
                              content_value: e.target.value
                            }
                          });
                        }}
                      />
                    </Field>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center my-5">
          <Button
            color="green"
            onClick={checkFrom}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
