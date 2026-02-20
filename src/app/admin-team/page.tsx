'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminProfiles } from '@/hooks/useProfileManagement';
import type { AdminProfile } from '@/hooks/useProfileManagement';

export default function AdminTeamPage() {
  const { data: admins, loading, error } = useAdminProfiles();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminProfile | null>(null);
  const [filterDept, setFilterDept] = useState('');

  const departments = [...new Set(admins.map(a => a.department || ''))].filter(Boolean);
  const filteredAdmins = filterDept ? admins.filter(a => a.department === filterDept) : admins;

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-md">
          <p className="text-red-800 font-semibold">Error loading admin team</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-blue-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Meet Our Leadership Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our dedicated team of administrators ensures seamless platform operations and strategic growth.
          </p>
        </div>

        {/* Filter */}
        {departments.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Filter by Department</label>
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-600 mt-6">
                {loading ? 'Loading...' : `${filteredAdmins.length} admin(s)`}
              </div>
            </div>
          </div>
        )}

        {/* Admins Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading admin team...</p>
          </div>
        ) : filteredAdmins.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {filteredAdmins.map(admin => (
              <div
                key={admin.id}
                onClick={() => setSelectedAdmin(admin)}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-8 cursor-pointer border-t-4 border-blue-500 group"
              >
                {/* Avatar */}
                <div className="w-20 h-20 bg-linear-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition">
                  👔
                </div>

                {/* Name & Role */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{admin.name}</h3>
                <p className="text-blue-600 font-semibold mb-4">{admin.role}</p>

                {/* Quick Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  {admin.department && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">🏢 Department:</span>
                      <span className="font-semibold text-gray-900">{admin.department}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">📧 Email:</span>
                    <span className="font-semibold text-gray-900 text-sm break-all">{admin.email}</span>
                  </div>
                  {admin.experience && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">⏱️ Experience:</span>
                      <span className="font-semibold text-gray-900 text-sm">{admin.experience}</span>
                    </div>
                  )}
                </div>

                {/* Bio Preview */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{admin.bio || 'Team member'}</p>

                {/* View Profile Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAdmin(admin);
                  }}
                  className="w-full py-2 px-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:opacity-90 transition"
                >
                  View Full Profile →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-600 text-lg">No admin members available.</p>
          </div>
        )}
      </div>

      {/* Modal - Admin Details */}
      {selectedAdmin && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAdmin(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-8 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold mb-2">{selectedAdmin.name}</h2>
                <p className="text-blue-100">{selectedAdmin.role}</p>
              </div>
              <button
                onClick={() => setSelectedAdmin(null)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Info Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {selectedAdmin.department && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-2">🏢 Department</p>
                    <p className="text-gray-900 font-semibold">{selectedAdmin.department}</p>
                  </div>
                )}
                {selectedAdmin.experience && (
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-2">⏱️ Experience</p>
                    <p className="text-gray-900 font-semibold">{selectedAdmin.experience}</p>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">📞 Contact</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Email</p>
                    <a href={`mailto:${selectedAdmin.email}`} className="text-blue-600 font-semibold hover:underline">
                      {selectedAdmin.email}
                    </a>
                  </div>
                  {selectedAdmin.phone && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Phone</p>
                      <a href={`tel:${selectedAdmin.phone}`} className="text-blue-600 font-semibold hover:underline">
                        {selectedAdmin.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Permissions */}
              {selectedAdmin.permissions && selectedAdmin.permissions.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-lg mb-6 border-l-4 border-blue-400">
                  <h3 className="font-bold text-gray-900 mb-3">🔐 Permissions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdmin.permissions.map((perm, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-sm font-medium">
                        ✓ {perm}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              <div className="bg-indigo-50 p-6 rounded-lg mb-6 border-l-4 border-indigo-400">
                <h3 className="font-bold text-gray-900 mb-3">👤 Professional Bio</h3>
                <p className="text-gray-800 leading-relaxed">{selectedAdmin.bio || 'Team member'}</p>
              </div>

              {/* Story */}
              {selectedAdmin.story && (
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
                  <h3 className="font-bold text-gray-900 mb-3">📖 Personal Story</h3>
                  <p className="text-gray-800 leading-relaxed italic">{selectedAdmin.story}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
