import { Link } from 'react-router-dom'

export function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="inline-flex items-center whitespace-nowrap">
      <span className="text-[28px] font-black italic tracking-tight text-white">
        CHORD
      </span>
      <span className="ml-1 text-[24px] font-black text-violet-500">⚡</span>
    </Link>
  )
}