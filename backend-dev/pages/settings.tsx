import AdminCard from '@/components/AdminCard'
import React from 'react'

const Settings = () => {
  return (
    <AdminCard 
    title="Settings" 
    subtitle="This is the settings page"
  >
    <div className="text-red-500">
      <p>This is the settings page</p>
      <p className="text-sm text-gray-600 mt-2">
        This is the settings page.
      </p>
    </div>
  </AdminCard>
  )
}

export default Settings