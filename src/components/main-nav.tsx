import * as React from "react"
import Link from "next/link"
import { Logo } from "./logo"
import { BrandText } from "./brand-text"

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Logo size={24} />
        <BrandText className="text-2xl pl-2 hidden font-bold sm:inline-block" />
      </Link>
    </div>
  )
}
