"use client";

import dayjs from "dayjs";
import { useState } from "react";
import { FormInput } from "../../components/FormInput";
import { insertProductAction } from "./actions";

function DateFormInput() {
  return (
    <FormInput
      type="date"
      name="releaseDate"
      label="Release Date"
      max={dayjs().format("YYYY-MM-DD")}
    />
  );
}

type FormState = "idle" | "submitting" | "error";

export function ProductForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setFormState("idle");
        const formdata = new FormData(event.currentTarget);

        setFormState("submitting");
        await insertProductAction({
          productName: formdata.get("productName") as string,
          releaseDate: dayjs(
            formdata.get("releaseDate") as string
          ).toISOString(),
          releasePrice: parseFloat(formdata.get("releasePrice") as string),
          releasePriceCompare: parseFloat(
            formdata.get("releasePriceCompare") as string
          ),
          fixedTax: parseFloat(formdata.get("fixedTax") as string),
        });
      }}
    >
      <div className="space-y-3 mt-3">
        <FormInput
          type="text"
          required
          name="productName"
          label="Product Name"
          placeholder="Product name"
        />
        <DateFormInput />
        <FormInput
          type="number"
          name="releasePrice"
          label="Release Price ($)"
          min={0}
          required
          placeholder="100$"
        />
        <FormInput
          type="number"
          name="releasePriceCompare"
          label="Release Price (€)"
          min={0}
          required
          placeholder="100€"
        />
        <FormInput
          type="number"
          defaultValue={0}
          min={0}
          name="fixedTax"
          label="Fixed Tax (€)"
        />
        <div className="mt-3">
          <button
            type="submit"
            disabled={formState === "submitting"}
            className="bg-gray-400 hover:bg-gray-300 transition-colors w-full rounded px-2 py-1 font-semibold text-gray-700"
          >
            {formState === "submitting" ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
    </form>
  );
}
