"use client";

import { useEffect, useState } from "react";
import { Field, Description, Fieldset, Label, Legend } from "@/components/fieldset";
import { Radio, RadioField, RadioGroup } from "@/components/radio";
import { Checkbox, CheckboxField, CheckboxGroup } from "@/components/checkbox";
import { Input } from "@/components/input";
import { Text } from "@/components/text";
import { Button } from "@/components/button";

export default function Home() {
  const [form, setForm] = useState();
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="max-w-full">
        <div
          dangerouslySetInnerHTML={{ __html: form.content }}
          className="editor p-4"
        />
      </div>
      <div className="px-5">
        <div className="text-center text-red-400">活動期限：{new Date(form.deadline).toLocaleString()}</div>
        {detail.map((items) => (
          <div
            className="p-5"
            key={items.id}
          >
            {items.type == 1 ? (
              <Field>
                <Label>
                  {items.title}
                  <span className="text-red-500">{items.required ? "(必填)" : ""}</span>
                </Label>
                <Input name={items.title} />
              </Field>
            ) : items.type == 2 ? (
              <Fieldset>
                <Legend>
                  {items.title}
                  <span className="text-red-500">{items.required ? "(必填)" : ""}</span>
                </Legend>
                <RadioGroup
                  name={items.id}
                  defaultValue="1"
                >
                  {items.content.map((item, index) => (
                    <RadioField key={index}>
                      <Radio value={item.id} />
                      <Label>{item.content}</Label>
                    </RadioField>
                  ))}
                </RadioGroup>
              </Fieldset>
            ) : items.type == 3 ? (
              <Fieldset>
                <Legend>
                  {items.title}
                  <span className="text-red-500">{items.required ? "(必填)" : ""}</span>
                </Legend>
                <CheckboxGroup>
                  {items.content.map((item, index) => (
                    <CheckboxField key={index}>
                      <Checkbox
                        value={item.id}
                        name={items.id}
                      />
                      <Label>{item.content}</Label>
                    </CheckboxField>
                  ))}
                </CheckboxGroup>
              </Fieldset>
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex justify-center my-5">
        <Button>Save</Button>
      </div>
    </div>
  );
}
