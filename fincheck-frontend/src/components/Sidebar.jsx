import React from 'react'
import { FiLogOut, FiPieChart } from 'react-icons/fi'

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="bg-blue-700 text-white w-64 min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-10">FinCheck</h2>

      <nav className="space-y-4">
        <div className="flex items-center space-x-2">
          <FiPieChart />
          <span>Dashboard</span>
        </div>        
      </nav>

      <button
        onClick={onLogout}
        className="absolute bottom-6 left-6 flex items-center space-x-2 text-red-200 hover:text-white"
      >
        <FiLogOut />
        <span>Sair</span>
      </button>
    </aside>
  )
}

export default Sidebar
