import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { NextPage, NextPageContext } from "next";
import { useState } from "react";
import { useQuery } from "react-query";
import { CurrentRatesResponse, fetchCurrentRates } from "../api/exchangerate";
import { fetchProducts, ProductWithRates } from "../api/products";
import { useSession } from "../components/AuthProvider";
import { LinkButton } from "../components/Button";
import { ProductCompareRow } from "../components/ProductCompare";
import { Search } from "../components/Search";
import { BaseLayout } from "../layout/BaseLayout";
dayjs.extend(relativeTime);

enum ProductView {
  ALL,
  FEATURED,
  PERSONAL,
}

function sortProducts(p1: ProductWithRates, p2: ProductWithRates): number {
  return p1.name.localeCompare(p2.name);
}

function filterSearch(
  products: ProductWithRates[],
  search: string
): ProductWithRates[] {
  return products.filter(
    (p) => search === "" || p.name.toLowerCase().includes(search.toLowerCase())
  );
}

function filterByView(products: ProductWithRates[], view: ProductView) {
  return products.filter((p) => {
    switch (view) {
      case ProductView.ALL:
        return true;
      case ProductView.FEATURED:
        return !p.user_id;
      case ProductView.PERSONAL:
        return p.user_id;
    }
  });
}

const Home: NextPage<{
  currentRates: CurrentRatesResponse;
}> = ({ currentRates }) => {
  const { session, loading } = useSession();
  const { data: products, isLoading: isProductsLoading } = useQuery(
    ["products", session?.access_token],
    () => fetchProducts()
  );

  const [search, setSearch] = useState("");
  const [view, setView] = useState(ProductView.ALL);

  const productsViewed = filterSearch(
    filterByView(products ?? [], view).sort(sortProducts) ?? [],
    search
  );

  return (
    <BaseLayout showLogin>
      <Search value={search} onChange={setSearch} />

      <div className="flex mt-3 justify-between">
        <div className="divide-x-2 divide-gray-800">
          <button
            className={`px-3 py-1 bg-gray-700 ${
              view === ProductView.ALL ? "bg-gray-500" : ""
            } hover:bg-gray-500 active:bg-gray-400 rounded-l-md`}
            onClick={() => setView(ProductView.ALL)}
          >
            All
          </button>
          <button
            className={`px-3 py-1 bg-gray-700 ${
              view === ProductView.FEATURED ? "bg-gray-500" : ""
            } hover:bg-gray-500 active:bg-gray-400`}
            onClick={() => setView(ProductView.FEATURED)}
          >
            Featured
          </button>
          <button
            className={`px-3 py-1 bg-gray-700 ${
              view === ProductView.PERSONAL ? "bg-gray-500" : ""
            } hover:bg-gray-500 active:bg-gray-400 rounded-r-md`}
            onClick={() => setView(ProductView.PERSONAL)}
          >
            Personal
          </button>
        </div>
        {session && !loading && (
          <div>
            <LinkButton href="/add-product">Add product</LinkButton>
          </div>
        )}
      </div>

      {isProductsLoading && <p className="mt-2 text-gray-500">Chargement...</p>}

      {!isProductsLoading && productsViewed?.length === 0 && (
        <p className="mt-2 text-gray-500">Aucun produit</p>
      )}
      {!session && !loading && view === ProductView.PERSONAL && (
        <>
          <div className="mt-2 p-3 bg-gray-600 rounded-md inline-block">
            <p className="mb-3">Se connecter pour ajouter des produits</p>
            <LinkButton href="/login">Login</LinkButton>
          </div>
        </>
      )}
      <ul className="mt-3 bg-gray-600 rounded-lg divide-y divide-gray-500">
        {productsViewed?.map((p) => (
          <ProductCompareRow
            key={p.id}
            product={p}
            currentRates={currentRates}
          />
        ))}
      </ul>
    </BaseLayout>
  );
};

export async function getServerSideProps(ctx: NextPageContext) {
  const currentRates = await fetchCurrentRates();

  return { props: { currentRates } };
}

export default Home;
