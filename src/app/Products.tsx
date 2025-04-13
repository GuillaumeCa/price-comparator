"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useUser } from "../api/auth";
import { CurrentRatesResponse } from "../api/exchangerate";
import { ProductWithRates } from "../api/products";
import { Button, LinkButton } from "../components/Button";
import { ProductCompareRow } from "../components/ProductCompare";
import { Search } from "../components/Search";

enum ProductView {
  ALL,
  FEATURED,
  PERSONAL,
}

function sortProducts(p1: ProductWithRates, p2: ProductWithRates): number {
  return p1.product.name.localeCompare(p2.product.name);
}

function filterSearch(
  products: ProductWithRates[],
  search: string
): ProductWithRates[] {
  return products.filter(
    (p) =>
      search === "" ||
      p.product.name.toLowerCase().includes(search.toLowerCase())
  );
}

function filterByView(products: ProductWithRates[], view: ProductView) {
  return products.filter((p) => {
    switch (view) {
      case ProductView.ALL:
        return true;
      case ProductView.FEATURED:
        return !p.product.user_id;
      case ProductView.PERSONAL:
        return p.product.user_id;
    }
  });
}

const queryclient = new QueryClient();

export function Products({
  products,
  currentRates,
}: {
  products: ProductWithRates[];
  currentRates: CurrentRatesResponse;
}) {
  const { user, isLoading } = useUser();
  const [search, setSearch] = useState("");
  const [view, setView] = useState(ProductView.ALL);

  const productsViewed = filterSearch(
    filterByView(products ?? [], view).sort(sortProducts) ?? [],
    search
  );

  return (
    <>
      <Search value={search} onChange={setSearch} />

      <div className="flex mt-3 justify-between">
        <div className="divide-x-2 divide-gray-800">
          <button
            className={`px-3 py-1 ${
              view === ProductView.ALL ? "bg-gray-500" : "bg-gray-700"
            } hover:bg-gray-500 active:bg-gray-400 rounded-l-md`}
            onClick={() => setView(ProductView.ALL)}
          >
            All
          </button>
          <button
            className={`px-3 py-1 ${
              view === ProductView.FEATURED ? "bg-gray-500" : "bg-gray-700"
            } hover:bg-gray-500 active:bg-gray-400`}
            onClick={() => setView(ProductView.FEATURED)}
          >
            Featured
          </button>
          <button
            className={`px-3 py-1 ${
              view === ProductView.PERSONAL ? "bg-gray-500" : "bg-gray-700"
            } hover:bg-gray-500 active:bg-gray-400 rounded-r-md`}
            onClick={() => setView(ProductView.PERSONAL)}
          >
            Personal
          </button>
        </div>
        {user && !isLoading && (
          <div>
            <LinkButton href="/add-product">Add product</LinkButton>
          </div>
        )}
      </div>

      {productsViewed?.length === 0 && (
        <p className="mt-2 text-gray-500">Aucun produit</p>
      )}
      {!user && !isLoading && view === ProductView.PERSONAL && (
        <>
          <div className="mt-2 p-3 bg-gray-600 rounded-md inline-block">
            <p className="mb-3">Se connecter pour ajouter des produits</p>
            <Button onClick={() => signIn("discord")}>Login</Button>
          </div>
        </>
      )}

      <QueryClientProvider client={queryclient}>
        <ul className="mt-3 bg-gray-600 rounded-lg divide-y divide-gray-500">
          {productsViewed?.map((p) => (
            <ProductCompareRow
              key={p.product.id}
              product={p}
              currentRates={currentRates}
            />
          ))}
        </ul>
      </QueryClientProvider>
    </>
  );
}
