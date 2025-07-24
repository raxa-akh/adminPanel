import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import Header from "@/components/Header"
import cls from './style.module.css'

const AppLayout: React.FC = () => (
  <div className={cls.containerSidebar}>
    <Sidebar />
    <div className={cls.containerHeader}>
      <Header />
      <div className={cls.containerMain}>
        <Outlet />  
      </div>
    </div>
  </div>
)


export default AppLayout