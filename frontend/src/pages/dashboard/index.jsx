import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';

export default function Dashboard() {

  const router = useRouter();
  const dispath = useDispatch();

  const [isTokenThere, setIsTokenThere] = React.useState(false);

    useEffect(()=>{
        if (localStorage.getItem("token") === null){
            router.push("/login")
        }
        setIsTokenThere(true);

    },[router])

    useEffect(()=>{
      if(isTokenThere){
        dispath(getAllPosts())
      }

    },[isTokenThere])
  return (
    <div>
      Dashboard
    </div>
  )
}
