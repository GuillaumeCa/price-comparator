import Link from "next/link";
import { BaseLayout } from "../layout/BaseLayout";

export default function AddProduct() {
  return (
    <BaseLayout>
      <Link href="/">
        <a className="px-2 py-1 bg-gray-700 hover:bg-gray-500 rounded-md">
          View products
        </a>
      </Link>
      <div className="p-4 mt-6 bg-gray-700 rounded-md max-w-xl">
        <h2 className="font-semibold text-2xl mb-6">New Product</h2>
        <form>
          <input name="name" />

          <div className="mt-2">
            <button type="submit" className="px-2 py-1 bg-gray-800 rounded-md">
              Add
            </button>
          </div>
        </form>
      </div>
    </BaseLayout>
  );
}
