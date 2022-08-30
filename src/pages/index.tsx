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

  const publicProducts = products?.filter((p) => !p.user_id);
  const privateProducts = products?.filter((p) => p.user_id);

  return (
    <BaseLayout>
      {!session && !loading && <LinkButton href="/login">Login</LinkButton>}
      {session && !loading && <p>Welcome !</p>}
      {session && !loading && (
        <Button type="button" onClick={() => supabase.auth.signOut()}>
          Logout
        </Button>
      )}
      <h2 className="text-3xl mt-7">Products</h2>
      <ul className="mt-3 bg-gray-600 rounded-lg divide-y divide-gray-500">
        {publicProducts?.map((p) => (
          <ProductCompareRow
            key={p.id}
            product={p}
            currentRates={currentRates}
          />
        ))}
      </ul>
      {session && !loading && (
        <>
          <div className="flex justify-between mt-7 items-center">
            <h2 className="text-3xl">My Products</h2>
            <div>
              <LinkButton href="/add-product">Add product</LinkButton>
            </div>
          </div>
          {privateProducts?.length === 0 && <p>Aucun produit actuellement</p>}
          <ul className="mt-3 bg-gray-600 rounded-lg divide-y divide-gray-500">
            {privateProducts?.map((p) => (
              <ProductCompareRow
                key={p.id}
                product={p}
                currentRates={currentRates}
              />
            ))}
          </ul>
        </>
      )}
    </BaseLayout>
  );
};

export async function getServerSideProps(ctx: NextPageContext) {
  const currentRates = await fetchCurrentRates();

  return { props: { currentRates } };
}

export default Home;
