import React, { useEffect, useState } from 'react';
import { User, Mail, CreditCard, Clock, Eye, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import apiFetch from '@wordpress/api-fetch';

interface TopUser {
  user_id: string;
  transaction_count: number;
  name: string;
  email: string;
  status: string;
  user_registered: string;
}

interface TopUsersTableProps {
  className?: string;
}

const TopUsersTable: React.FC<TopUsersTableProps> = ({ className = '' }) => {
  const [users, setUsers] = useState<TopUser[]>([]);

  useEffect(() => {
    apiFetch({
      path: '/pika/v1/admin/users',
      method: 'GET'
    }).then((users) => {
      setUsers(users as TopUser[]);
    });
  }, []);

  const handleViewUser = (userId: string) => {
    window.open(`/wp-admin/user-edit.php?user_id=${userId}&wp_http_referer=%2Fwp-admin%2Fusers.php`, '_blank');
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Top Users by Transaction Volume</h3>
        <p className="text-sm text-gray-600 mt-1">Users with highest transaction activity</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  User
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Transactions
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Registered
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.transaction_count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.user_registered}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", {
                    'bg-green-100 text-green-800': user.status === 'active',
                    'bg-gray-100 text-gray-800': user.status === 'inactive'
                  })}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleViewUser(user.user_id)} className="text-blue-600 hover:text-blue-900 mr-3 flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </button>
                  <button disabled className="text-gray-600 disabled:opacity-50 hover:text-gray-900 flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopUsersTable;
