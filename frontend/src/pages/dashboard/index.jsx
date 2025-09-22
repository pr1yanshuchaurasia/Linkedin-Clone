import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Dashboard() {

const router = useRouter();
    useEffect(()=>{
        if (localStorage.getItem("token") === null){
            router.push("/login")
        }

    },[router])
  return (
    <div>
      Dashboard
    </div>
  )
}
