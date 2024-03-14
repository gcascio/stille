import * as React from "react"
import Link from "next/link"
import { Logo } from "./logo"

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Logo size={24} />
        <span className="text-2xl pl-2 hidden font-bold tracking-wider sm:inline-block">
          stille
        </span>
      </Link>
    </div>
  )
}
