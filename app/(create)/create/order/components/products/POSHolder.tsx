'use client'
import React, { useEffect, useState } from 'react'
import { usePOS } from '@/hooks/usePOS'
import POSItemsHolder from './POSHolder/POSItemsHolder'
import POSOrderRowHolder from './POSHolder/POSOrderRowHolder'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/DatePicker/DatePicker'
import axios from 'axios'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

type Props = {
    products: any
    currentUser: any
}

type productSpecifications = {
    id: string,
    weight: number,
    amount: number
}

const POSHolder = (props: Props) => {
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [totalAmount, setTotalAmount] = useState<number>(0)
    const [customer, setCustomer] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentUser, setCurrentUser] = useState<any>(props.currentUser)
    const POS: any = usePOS()
    const { signOut } = useClerk()
    const router = useRouter()

    useEffect(() => {
        // setCurrentUser(user.user)
        // console.log(user)

        console.log(currentUser)
    }, [currentUser])


    useEffect(() => {
        POS.customer = customer
    }, [customer, POS])

    // useEffect(() => {
    //     console.log(`POS Products: `, POS.products)
    // }, [POS.products])

    useEffect(() => {
        console.log(customer)
    }, [customer])

    function handleNewOrder() {
        setIsLoading(true)
        setCustomer(null)
        setSelectedProduct(null)
        POS.products = []
        POS.customer = null
        setIsLoading(false)
    }

    async function handleSearch(phone: string) {
        setIsLoading(true)
        if (phone === "00000000001") {
            return
        }
        const res = await axios.get("../api/customer/find/phone/" + phone).then((res: any) => {
            if (res.status == 200) {
                setCustomer(res.data)
                setCustomer(res?.data?.data)
            } else {
                setCustomer(null)
                setCustomer(null)
            }
        }).catch((err: any) => {
            console.log(`Customer: `, err)
        })
        setIsLoading(false)
    }

    const handleLogout = () => {
        signOut() 
        router.push('/') 
    }

    return (
        <>
            {isLoading && (
                <label className='absolute z-50 text-black left-[45%] top-[45%]'>
                    <div className='p-2 flex justify-center items-center gap-2 bg-red-800 text-white rounded-md'>
                        <Loader className='animate-spin' />
                        <p>
                            Please wait...
                        </p>
                    </div>
                </label>)
            }
            <div className={`${isLoading && "bg-red-500/40 blur-lg"}`}>
                <div className='flex gap-2 p-4 justify-between bg-slate-200 items-center drop-shadow-md'>
                    <div className='opacity-80 border p-2 rounded-md h-24'>
                        <div className=''>
                            <DatePicker >
                                <section>
                                    <p className='font-semibold text-sm tracking-wider'>Booking Date:</p>
                                    <button className='text-sm border-b border-spacing-2'>
                                        {new Date().toDateString()}
                                    </button>
                                </section>
                            </DatePicker>
                            <p className='text-center mt-2 text-sm font-semibold border-b-2 border border-slate-300 hover:bg-yellow-100 transition-all drop-shadow-sm hover:tracking-tight p-2 rounded-md h-fit'>TODAY</p>
                        </div>
                    </div>
                    <div>
                        {/* <HoverCardProvider content={<CustomerInput setCustomer={setCustomer} />}> */}
                        <div className='flex flex-col'>
                            <p className='font-semibold text-sm tracking-wider'>Name:</p>
                            <Input disabled={isLoading} name='customername' placeholder='Customer' className='text-black' value={customer ? customer?.name : ""} onChange={(e: any) => {
                                setCustomer({ ...customer, name: e.target.value })
                            }} />
                        </div>
                        {/* </HoverCardProvider> */}
                        <div className='flex gap-2'>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-sm tracking-wider'>Phone 01:</p>
                                <Input disabled={isLoading} name='customerphone01' placeholder='Phone01' type='number' className='text-black' value={customer ? customer?.phone : ""} onChange={(e: any) => { setCustomer({ ...customer, phone: e.target.value }) }} maxLength={11} onKeyDown={async (e: any) => e.key === "Enter" ? await handleSearch(customer?.phone) : null} />
                            </div>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-sm tracking-wider'>Phone 02:</p>
                                <Input disabled={isLoading} name='customerphone02' placeholder='Phone02' type='number' className='text-black' value={customer ? customer?.phone2 : ""} onChange={(e: any) => { setCustomer({ ...customer, phone2: e.target.value }) }} maxLength={11} onKeyDown={async (e: any) => e.key === "Enter" ? await handleSearch(customer?.phone2) : null} />
                            </div>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-sm tracking-wider'>City:</p>
                                <Input disabled={isLoading} name='customercity' placeholder='City' className='text-black' value={customer ? customer?.city : ""} onChange={(e: any) => { setCustomer({ ...customer, city: e.target.value }) }} />
                            </div>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-sm tracking-wider'>Address:</p>
                                <Input disabled={isLoading} name='customeraddress' placeholder='Address' className='text-black' value={customer ? customer?.address : ""} onChange={(e: any) => { setCustomer({ ...customer, address: e.target.value }) }} />
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-2 rounded-md p-1 w-56 h-24 place-items-center justify-items-center'>
                        <button onClick={() => handleNewOrder()} className='border border-slate-300 hover:bg-yellow-100 transition-all drop-shadow-sm hover:tracking-tight p-2 rounded-md h-fit'>
                            New order
                        </button>
                        <button className='border border-slate-300 hover:bg-yellow-100 transition-all drop-shadow-sm hover:tracking-tight p-2 rounded-md h-fit'>
                            Save order
                        </button>
                    </div>
                </div>
                <div className="flex gap-2 min-h-screen mt-2 drop-shadow-md">
                    <div className='w-[40%] text-ellipsis overflow-hidden whitespace-nowrap p-2 bg-slate-200 flex flex-col justify-between'>
                        <POSItemsHolder products={props.products} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
                        <div className='py-4 px-1 w-full flex gap-2 items-center bg-slate-50'>
                            <Image src={currentUser.imageURL} alt='loggedInUser' width={65} height={65} className='rounded-md' />
                            <section>
                                <h1>
                                    {
                                        currentUser && currentUser.name
                                    }
                                </h1>
                                <p className='text-xs'>
                                    {currentUser && currentUser.role}
                                </p>
                                <div>
                                    <button onClick={handleLogout} className='text-xs text-red-800 border-b border-red-800/40 p-0'>
                                        Logout
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                    <div className='w-[60%] text-ellipsis overflow-hidden whitespace-nowrap px-2 bg-slate-200'>
                        <POSOrderRowHolder />
                    </div>
                </div>
            </div>
        </>
    )
}

export default POSHolder