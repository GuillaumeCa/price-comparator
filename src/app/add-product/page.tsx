import Link from "next/link";
import { ProductForm } from "./ProductForm";

export default function AddProduct() {
  return (
    <div>
      <Link
        href="/"
        className="px-2 py-1 bg-gray-700 hover:bg-gray-500 rounded-md"
      >
        View products
      </Link>
      <div className="mt-3 p-4 bg-gray-600 rounded-md max-w-md">
        <h2 className="text-2xl font-bold">Product</h2>
        <p className="text-gray-400 italic">Add a new product</p>
        <ProductForm />
      </div>
    </div>
  );
}
