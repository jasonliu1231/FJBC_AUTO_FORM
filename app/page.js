"use client";

import { useEffect, useRef, useState } from "react";
import { Field, Description, Fieldset, Label, Legend } from "@/components/fieldset";
import { Radio, RadioField, RadioGroup } from "@/components/radio";
import { Checkbox, CheckboxField, CheckboxGroup } from "@/components/checkbox";
import { Input } from "@/components/input";
import { Text } from "@/components/text";
import { Button } from "@/components/button";

export default function Home() {
  const [data, setData] = useState({});
  const [form, setForm] = useState();
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  async function checkFrom() {
    let check = true;
    detail.forEach((item) => {
      if (item.required) {
        if (item.type == "1") {
          if (data[`items${item.index}`].content_value == "") {
            alert(`${item.title}，是必填欄位！請幫忙填寫再送出～感謝！`);
            check = false;
            return;
          }
        } else if (item.type == "2") {
          if (data[`items${item.index}`].content_id == "") {
            alert(`${item.title}，是必填欄位！請幫忙填寫再送出～感謝！`);
            check = false;
            return;
          }
        } else if (item.type == "3") {
          if (data[`items${item.index}`].content_id.length == 0) {
            alert(`${item.title}，是必填欄位！請幫忙填寫再送出～感謝！`);
            check = false;
            return;
          }
        }
      }
    });
    if (check) {
      saveFrom();
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
      alert(`感謝您的支持，謝謝您抽出寶貴的時間填寫表單！`);
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
      setDetail(res.detail);
      const def_val = res.detail.map((item) => {
        let type = "";
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
          content_id,
          content_value
        };
      });

      const object = def_val.reduce((acc, item, index) => {
        acc[`items${index}`] = item;
        return acc;
      }, {});

      setData({ form_id: id, ...object });

      setLoading(false);
    } else {
      alert(res.msg);
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    getFrom(id);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="max-w-md sm:max-w-xl mx-auto">
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

      <div className="px-5">
        {form.deadline && <div className="text-center text-red-400">活動期限：{new Date(form.deadline).toLocaleString()}</div>}

        {detail.map((items) => (
          <div key={items.id}>
            {items.title != "" && (
              <div className="p-5">
                {items.type == "1" ? (
                  <Field>
                    <Label>
                      {items.title}
                      <span className="text-red-500">{items.required ? "(必填)" : ""}</span>
                    </Label>
                    <Input
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
                      {items.title}
                      <span className="text-red-500">{items.required ? "(必填)" : ""}</span>
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
                        <RadioField key={index}>
                          <Radio value={`${item.id}@$${item.content}`} />
                          <Label>{item.content}</Label>
                        </RadioField>
                      ))}
                    </RadioGroup>
                  </Fieldset>
                ) : items.type == "3" ? (
                  <Fieldset>
                    <Legend>
                      {items.title}
                      <span className="text-red-500">{items.required ? "(必填)" : ""}</span>
                    </Legend>
                    <CheckboxGroup>
                      {items.content.map((item, index) => (
                        <CheckboxField key={index}>
                          <Checkbox
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
                          <Label>{item.content}</Label>
                        </CheckboxField>
                      ))}
                    </CheckboxGroup>
                  </Fieldset>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center my-5">
        <Button onClick={checkFrom}>Save</Button>
      </div>
    </div>
  );
}
