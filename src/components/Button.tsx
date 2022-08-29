import Link from "next/link";
import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="px-2 py-1 bg-gray-700 hover:bg-gray-500 rounded-md"
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <a className="px-2 py-1 bg-gray-700 hover:bg-gray-500 rounded-md">
        {children}
      </a>
    </Link>
  );
}
