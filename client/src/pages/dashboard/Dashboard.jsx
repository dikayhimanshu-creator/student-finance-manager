import { useAuth } from '../../context/AuthContext'

const Dashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-2">Your dashboard is coming soon.</p>
        <button
          onClick={logout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard