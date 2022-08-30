import { useField } from "formik";
import { InputHTMLAttributes } from "react";

export type FormInputProps = {
  label: string;
  name: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormInput({ label, ...props }: FormInputProps) {
  const [field, meta] = useField(props.name);

  return (
    <div>
      <label>
        <span className="text-gray-400 text-sm">{label}</span>
        <input
          className="mt-1 w-full px-2 py-1 rounded text-gray-700 outline-none focus:ring-2 ring-gray-400"
          {...field}
          {...props}
        />
      </label>
      {meta.touched && meta.error && (
        <div className="text-red-400 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
}
