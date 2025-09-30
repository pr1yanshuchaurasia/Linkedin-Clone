import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Dashboard() {

  const router = useRouter();

  const [isTokenThere, setIsTokenThere] = React.useState(false);

    useEffect(()=>{
        if (localStorage.getItem("token") === null){
            router.push("/login")
        }
        setIsTokenThere(true);

    },[router])

    useEffect(()=>{

    },[isTokenThere])
  return (
    <div>
      Dashboard
    </div>
  )
}
