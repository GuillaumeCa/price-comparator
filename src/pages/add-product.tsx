import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { insertProduct } from "../api/products";
import { useSession } from "../components/AuthProvider";
import { FormInput } from "../components/FormInput";
import { BaseLayout } from "../layout/BaseLayout";

const AddProductForm = z.object({
  productName: z.string(),
  releaseDate: z.string(),
  releasePrice: z.number().min(0).nullable(),
  releasePriceCompare: z.number().min(0).nullable(),
  fixedTax: z.number().min(0),
});

export default function AddProduct() {
  const { session, loading } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!session && !loading) {
      router.push("/login");
    }
  }, [session, loading]);

  return (
    <BaseLayout>
      <Link href="/">
        <a className="px-2 py-1 bg-gray-700 hover:bg-gray-500 rounded-md">
          View products
        </a>
      </Link>
      <div className="mt-3 p-4 bg-gray-600 rounded-md max-w-md">
        <h2 className="text-2xl font-bold">Product</h2>
        <p className="text-gray-400 italic">Add a new product</p>
        <Formik
          initialValues={{
            productName: "",
            releaseDate: undefined,
            releasePrice: undefined,
            releasePriceCompare: undefined,
            fixedTax: 0,
          }}
          validationSchema={toFormikValidationSchema(AddProductForm)}
          onSubmit={async (values) => {
            const res = await insertProduct({
              name: values.productName,
              release_date: values.releaseDate,
              release_price: values.releasePrice,
              release_price_compare: values.releasePriceCompare,
              fixed_tax: values.fixedTax,
              currency: "USD",
              currency_compare: "EUR",
              user_id: session?.user?.id,
            });

            if (res.error) {
              alert("error: " + res.error.message);
            }

            queryClient.invalidateQueries(["products"]);
            router.push("/");
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3 mt-3">
              <FormInput
                type="text"
                name="productName"
                label="Product Name"
                placeholder="Product name"
              />
              <FormInput type="date" name="releaseDate" label="Release Date" />
              <FormInput
                type="number"
                name="releasePrice"
                label="Release Price ($)"
                min={0}
                placeholder="100$"
              />
              <FormInput
                type="number"
                name="releasePriceCompare"
                label="Release Price (€)"
                min={0}
                placeholder="100€"
              />
              <FormInput
                type="number"
                min={0}
                name="fixedTax"
                label="Fixed Tax (€)"
              />
              <div className="mt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gray-400 hover:bg-gray-300 transition-colors w-full rounded px-2 py-1 font-semibold text-gray-700"
                >
                  {isSubmitting ? "Saving..." : "Add"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </BaseLayout>
  );
}
