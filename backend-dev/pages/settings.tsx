import AdminCard from '@/components/AdminCard'
import React from 'react'

const Settings = () => {
  return (
    <AdminCard 
    title="TypeScript Admin Component" 
    subtitle="This is built with TypeScript and React"
  >
    <div className="text-red-500">
      <p>Hello from TypeScript! 🚀</p>
      <p className="text-sm text-gray-600 mt-2">
        This component demonstrates TypeScript integration with WordPress scripts.
      </p>
    </div>
  </AdminCard>
  )
}

export default Settings