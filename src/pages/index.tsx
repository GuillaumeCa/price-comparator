import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { NextPage, NextPageContext } from "next";
import { useQuery } from "react-query";
import { CurrentRatesResponse, fetchCurrentRates } from "../api/exchangerate";
import { fetchProducts } from "../api/products";
import { supabase } from "../api/supabase";
import { useSession } from "../components/AuthProvider";
import { Button, LinkButton } from "../components/Button";
import { ProductCompareRow } from "../components/ProductCompare";
import { BaseLayout } from "../layout/BaseLayout";
dayjs.extend(relativeTime);

const Home: NextPage<{
  currentRates: CurrentRatesResponse;
}> = ({ currentRates }) => {
  const { session, loading } = useSession();
  const { data: products } = useQuery(["products", session?.access_token], () =>
    fetchProducts()
  );

  return (
    <BaseLayout>
      {!session && !loading && <LinkButton href="/login">Login</LinkButton>}
      {session && !loading && <p>Welcome !</p>}
      {session && !loading && (
        <Button type="button" onClick={() => supabase.auth.signOut()}>
          Logout
        </Button>
      )}

      <ul className="mt-7 bg-gray-600 rounded-lg divide-y divide-gray-500">
        {products?.map((p) => (
          <ProductCompareRow
            key={p.id}
            product={p}
            currentRates={currentRates}
          />
        ))}
      </ul>
      {session && !loading && (
        <div className="mt-4 text-right">
          <LinkButton href="/add-product">Add product</LinkButton>
        </div>
      )}
    </BaseLayout>
  );
};

export async function getServerSideProps(ctx: NextPageContext) {
  const currentRates = await fetchCurrentRates();

  return { props: { currentRates } };
}

export default Home;
