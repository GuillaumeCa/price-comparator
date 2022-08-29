import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { NextPage, NextPageContext } from "next";
import Link from "next/link";
import { CurrentRatesResponse, fetchCurrentRates } from "../api/exchangerate";
import { fetchProducts, ProductWithRates } from "../api/products";
import { ProductCompareRow } from "../components/ProductCompare";
import { BaseLayout } from "../layout/BaseLayout";
dayjs.extend(relativeTime);

const Home: NextPage<{
  currentRates: CurrentRatesResponse;
  products: ProductWithRates[];
}> = ({ currentRates, products }) => {
  return (
    <BaseLayout>
      <ul className="mt-7 bg-gray-600 rounded-lg divide-y divide-gray-500">
        {products.map((p) => (
          <ProductCompareRow
            key={p.id}
            product={p}
            currentRates={currentRates}
          />
        ))}
      </ul>
      <div className="mt-4 text-right">
        <Link href="/add-product">
          <a className="px-2 py-1 bg-gray-700 hover:bg-gray-500 rounded-md">
            Add product
          </a>
        </Link>
      </div>
    </BaseLayout>
  );
};

export async function getServerSideProps(ctx: NextPageContext) {
  const currentRates = await fetchCurrentRates();
  const products = await fetchProducts();
  return { props: { currentRates, products } };
}

export default Home;
