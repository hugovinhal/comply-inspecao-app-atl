'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiHome, FiUsers, FiSettings, FiClipboard, FiFileText, FiRefreshCw, FiLogOut } from 'react-icons/fi';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-orange-700 text-white' : 'text-white hover:bg-orange-600';
  };

  return (
    <div className="bg-orange-500 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex items-center justify-center space-x-2 px-4">
        <div className="w-10 h-10 relative">
          <Image 
            src="/comply-logo-white.png" 
            alt="Comply Logo" 
            fill
            style={{objectFit: 'contain'}}
          />
        </div>
        <span className="text-2xl font-extrabold">Comply</span>
      </div>
      
      <nav>
        <Link href="/dashboard" className={`block py-2.5 px-4 rounded transition duration-200 ${isActive('/dashboard')}`}>
          <div className="flex items-center space-x-2">
            <FiHome className="h-5 w-5" />
            <span>Dashboard</span>
          </div>
        </Link>
        
        <Link href="/clients" className={`block py-2.5 px-4 rounded transition duration-200 ${isActive('/clients')}`}>
          <div className="flex items-center space-x-2">
            <FiUsers className="h-5 w-5" />
            <span>Clientes</span>
          </div>
        </Link>
        
        <Link href="/equipments" className={`block py-2.5 px-4 rounded transition duration-200 ${isActive('/equipments')}`}>
          <div className="flex items-center space-x-2">
            <FiSettings className="h-5 w-5" />
            <span>Equipamentos</span>
          </div>
        </Link>
        
        <Link href="/service-orders" className={`block py-2.5 px-4 rounded transition duration-200 ${isActive('/service-orders')}`}>
          <div className="flex items-center space-x-2">
            <FiClipboard className="h-5 w-5" />
            <span>Ordens de Serviço</span>
          </div>
        </Link>
        
        <Link href="/reports" className={`block py-2.5 px-4 rounded transition duration-200 ${isActive('/reports')}`}>
          <div className="flex items-center space-x-2">
            <FiFileText className="h-5 w-5" />
            <span>Relatórios</span>
          </div>
        </Link>
        
        <Link href="/sync" className={`block py-2.5 px-4 rounded transition duration-200 ${isActive('/sync')}`}>
          <div className="flex items-center space-x-2">
            <FiRefreshCw className="h-5 w-5" />
            <span>Sincronização</span>
          </div>
        </Link>
      </nav>
      
      <div className="px-4 mt-auto">
        <div className="pt-2 border-t border-orange-600">
          <div className="block py-2.5 px-4 rounded transition duration-200 hover:bg-orange-600 cursor-pointer" onClick={logout}>
            <div className="flex items-center space-x-2">
              <FiLogOut className="h-5 w-5" />
              <span>Sair</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
