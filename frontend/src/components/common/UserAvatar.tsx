import {UserRound} from 'lucide-react'

type Props={name?:string;src?:string;size?:'sm'|'md'|'lg'|'xl';className?:string}
const sizes={sm:'h-9 w-9 text-[11px]',md:'h-10 w-10 text-xs',lg:'h-16 w-16 text-lg',xl:'h-32 w-32 text-3xl'}

export function UserAvatar({name='User',src,size='md',className=''}:Props){
  const initials=name.split(' ').filter(Boolean).map(part=>part[0]).slice(0,2).join('').toUpperCase()
  return <div className={`shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700 ${sizes[size]} ${className}`}>
    {src?<img src={src} alt={name} className="h-full w-full object-cover"/>:<div className="grid h-full w-full place-items-center font-extrabold">{initials||<UserRound size={18}/>}</div>}
  </div>
}
