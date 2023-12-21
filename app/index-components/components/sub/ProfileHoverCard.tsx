'use client'
import { formalizeText, getCurrentUserCasualStatus } from '@/lib/my'
import { useClerk } from '@clerk/nextjs'
import { profile } from '@prisma/client'
import { Barcode, Home, LayoutDashboard, LogOut } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
    profile: profile
}

const ProfileHoverCard = (props: Props) => {
    const { signOut } = useClerk()


    const menuItems = [
        {
            name: "Dashboard",
            link: "/user/dashboard",
            icon: LayoutDashboard
        },
        {
            name:"Home",
            link: "/",
            icon: Home
        },
        {
            name: "Orders",
            link: "/orders/verify",
            icon: Barcode
        }
    ]

    return (
        <div>
            <div className='text-xs mb-2 text-slate-400'>
                {props.profile ? `You are signed in as: ${getCurrentUserCasualStatus(props.profile.role)}` : "Navigation"}
            </div>
            <div className='flex flex-col gap-2'>
                {
                    menuItems.map((menu) => {
                        return (
                            <section key={menu.name} className='hover:bg-slate-100 rounded-md p-1'>
                                <Link href={menu.link}>
                                    <div className='font-semibold gap-4 flex items-center text-zinc-600'>
                                        <menu.icon size={18} />
                                        <div>
                                            {menu.name}
                                        </div>
                                    </div>
                                </Link>
                            </section>
                        )
                    })
                }

            </div>
            <div onClick={() => signOut()} className='group cursor-pointer border-t border-slate-200 mt-4 py-1 text-slate-700 flex gap-1 items-center rounded-md hover:px-1 transition-all duration-500 hover:text-red-500 hover:bg-orange-50  hover:border-red-500'>
                <div className='group-hover:rotate-90 transition-all duration-1000'>
                    <LogOut size={15} />
                </div>
                <div>
                    Logout
                </div>
            </div>
        </div>
    )
}

export default ProfileHoverCard