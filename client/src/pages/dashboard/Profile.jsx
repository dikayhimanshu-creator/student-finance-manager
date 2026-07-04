import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import Layout from '../../components/Layout'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, login, token } = useAuth()
  const [nameForm, setNameForm] = useState({ name: user?.name || '' })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: ''
  })
  const [updatingName, setUpdatingName] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  const handleNameSubmit = async (e) => {
    e.preventDefault()
    setUpdatingName(true)
    try {
      const res = await API.put('/api/auth/profile', nameForm)
      login(res.data.user, token)
      toast.success('Name updated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update name')
    } finally {
      setUpdatingName(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setUpdatingPassword(true)
    try {
      await API.put('/api/auth/password', passwordForm)
      toast.success('Password updated successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    } finally {
      setUpdatingPassword(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-500 text-sm">Manage your account settings</p>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Update Name */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Update Name</h2>
          <form onSubmit={handleNameSubmit} className="flex gap-4">
            <input
              type="text"
              value={nameForm.name}
              onChange={(e) => setNameForm({ name: e.target.value })}
              placeholder="Enter new name"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={updatingName}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {updatingName ? 'Saving...' : 'Update'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value
                })}
                placeholder="Enter current password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value
                })}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={updatingPassword}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {updatingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Profile