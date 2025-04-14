"use server";

import { redirect } from "next/navigation";
import { insertProduct } from "../../api/products";
import { requireAuth } from "../../api/server-auth";

interface InsertProductForm {
  productName: string;
  releaseDate: string;
  releasePrice: number;
  releasePriceCompare: number;
  fixedTax: number;
}

export async function insertProductAction(product: InsertProductForm) {
  const user = await requireAuth();

  console.log("insert product", user.id);
  await insertProduct({
    name: product.productName,
    release_date: product.releaseDate,
    release_price: product.releasePrice,
    release_price_compare: product.releasePriceCompare,
    fixed_tax: product.fixedTax,
    currency: "USD",
    currency_compare: "EUR",
    user_id: user.id,
  });

  redirect("/");
}
