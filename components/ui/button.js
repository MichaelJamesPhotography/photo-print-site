import * as React from "react"

export function Button({ className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 ${className}`}
      {...props}
    />
  )
}
