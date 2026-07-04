import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  MdDashboard,
  MdAttachMoney,
  MdMoneyOff,
  MdSavings,
  MdBarChart,
  MdCreditCard,
  MdPerson,
  MdLogout
} from 'react-icons/md'

const navItems = [
  { path: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
  { path: '/income', icon: MdAttachMoney, label: 'Income' },
  { path: '/expenses', icon: MdMoneyOff, label: 'Expenses' },
  { path: '/budget', icon: MdSavings, label: 'Budget' },
  { path: '/analytics', icon: MdBarChart, label: 'Analytics' },
  { path: '/cards', icon: MdCreditCard, label: 'Cards' },
  { path: '/profile', icon: MdPerson, label: 'Profile' },
]

const Sidebar = () => {
  const { logout, user } = useAuth()

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-md flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">💰 FinanceManager</h1>
        <p className="text-xs text-gray-500 mt-1">{user?.name}</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="text-xl" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all"
        >
          <MdLogout className="text-xl" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar