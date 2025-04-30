import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to}
      className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-150 ${
        isActive 
          ? 'bg-[#1E5945]/10 text-[#1E5945]' 
          : 'text-gray-600 hover:bg-[#1E5945]/10 hover:text-[#1E5945]'
      }`}
    >
      <span className="w-4 h-4 mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};