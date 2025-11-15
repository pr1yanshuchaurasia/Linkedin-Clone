import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getAboutUser } from '@/config/redux/action/authAction';
import { useSelector } from 'react-redux';

export default function Dashboard() {

  const router = useRouter();
  const dispath = useDispatch();

  const authState = useSelector((state)=>state.auth);
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
        dispath(getAboutUser({token: localStorage.getItem("token")}))
      }

    },[isTokenThere])
  return (
    <div>
       {authState.user?.userId?.name && (
      <div>Hey {authState.user.userId.name}</div>
    )}
    </div>
  )
}
