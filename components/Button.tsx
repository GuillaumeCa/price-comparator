import React, { ButtonHTMLAttributes } from "react";

export function Button({
  children,
  type,
}: {
  children: React.ReactNode;
  type: ButtonHTMLAttributes<HTMLButtonElement>["type"];
}) {
  return (
    <button
      type={type}
      className="px-2 py-1 bg-gray-700 hover:bg-gray-500 rounded-md"
    >
      {children}
    </button>
  );
}
