import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="font-heading text-xl font-bold tracking-tight">
      Mode<span className="text-[var(--color-brand)]">sy</span>
    </Link>
  )
}
