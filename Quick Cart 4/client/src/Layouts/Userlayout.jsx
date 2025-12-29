import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../Componenets/Header'
import { Footer } from '../Componenets/Footer'


export const Userlayout = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    <Footer/>
    </>
  )
}
