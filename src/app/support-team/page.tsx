'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStaffProfiles } from '@/hooks/useProfileManagement';
import type { StaffProfile } from '@/hooks/useProfileManagement';

export default function SupportTeamPage() {
  const { data: staff, loading, error } = useStaffProfiles();
  const [selectedMember, setSelectedMember] = useState<StaffProfile | null>(null);
  const [filterDept, setFilterDept] = useState('');

  const departments = [...new Set(staff.map(s => s.department || ''))].filter(Boolean);
  const filteredStaff = filterDept ? staff.filter(s => s.department === filterDept) : staff;

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-50 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-md">
          <p className="text-red-800 font-semibold">Error loading support team</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Meet Our Support Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our dedicated support specialists are here to help you succeed. Reach out anytime with questions or support needs.
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-600 mt-6">
                {loading ? 'Loading...' : `${filteredStaff.length} member(s)`}
              </div>
            </div>
          </div>
        )}

        {/* Support Staff Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading support team...</p>
          </div>
        ) : filteredStaff.length > 0 ? (
          <div className="space-y-8">
            {filteredStaff.map(member => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-8 cursor-pointer border-t-4 border-green-500 group"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition">
                      💼
                    </div>
                    {/* Name & Title */}
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-green-600 font-semibold text-lg mb-2">{member.position}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.department && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                          🏢 {member.department}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full">
                        ⭐ {member.satisfaction_rating?.toFixed(1) || '4.5'}/5.0
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                        🟢 {member.status || 'Available'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="text-right">
                    <div className="bg-green-50 p-4 rounded-lg mb-3">
                      <p className="text-sm text-gray-600 font-semibold">Tickets Resolved</p>
                      <p className="text-3xl font-bold text-green-600">{member.tickets_resolved || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">📧 EMAIL</p>
                    <a href={`mailto:${member.email}`} className="text-green-600 font-semibold hover:underline text-sm">
                      {member.email}
                    </a>
                  </div>
                  {member.phone && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">📞 PHONE</p>
                      <a href={`tel:${member.phone}`} className="text-green-600 font-semibold hover:underline">
                        {member.phone}
                      </a>
                    </div>
                  )}
                  {member.specialization && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">🎯 SPECIALTY</p>
                      <p className="text-gray-900 font-semibold text-sm">{member.specialization}</p>
                    </div>
                  )}
                  {member.availability && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">⏰ AVAILABILITY</p>
                      <p className="text-gray-900 font-semibold text-sm">{member.availability}</p>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <p className="text-gray-700 mb-4 line-clamp-2">{member.bio || 'Support specialist'}</p>

                {/* View Profile Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMember(member);
                  }}
                  className="px-6 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:opacity-90 transition"
                >
                  View Full Profile →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-600 text-lg">No support team members available.</p>
          </div>
        )}
      </div>

      {/* Modal - Member Details */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-green-600 to-emerald-600 text-white p-8 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold mb-2">{selectedMember.name}</h2>
                <p className="text-green-100">{selectedMember.position}</p>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Performance Metrics */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 font-semibold mb-2">🎫 Tickets Resolved</p>
                  <p className="text-3xl font-bold text-green-600">{selectedMember.tickets_resolved || 0}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 font-semibold mb-2">⭐ Satisfaction</p>
                  <p className="text-3xl font-bold text-orange-600">{selectedMember.satisfaction_rating?.toFixed(1) || '4.5'}/5</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 font-semibold mb-2">👤 Status</p>
                  <p className="text-lg font-bold text-blue-600">{selectedMember.status || 'Available'}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {selectedMember.department && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-2">🏢 Department</p>
                    <p className="text-gray-900 font-semibold">{selectedMember.department}</p>
                  </div>
                )}
                {selectedMember.specialization && (
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-2">🎯 Specialization</p>
                    <p className="text-gray-900 font-semibold">{selectedMember.specialization}</p>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">📞 Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Email</p>
                    <a href={`mailto:${selectedMember.email}`} className="text-green-600 font-semibold hover:underline">
                      {selectedMember.email}
                    </a>
                  </div>
                  {selectedMember.phone && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Phone</p>
                      <a href={`tel:${selectedMember.phone}`} className="text-green-600 font-semibold hover:underline">
                        {selectedMember.phone}
                      </a>
                    </div>
                  )}
                  {selectedMember.availability && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Availability</p>
                      <p className="text-gray-900 font-semibold">{selectedMember.availability}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="bg-green-50 p-6 rounded-lg mb-6 border-l-4 border-green-400">
                <h3 className="font-bold text-gray-900 mb-3">👤 Professional Bio</h3>
                <p className="text-gray-800 leading-relaxed">{selectedMember.bio || 'Support specialist'}</p>
              </div>

              {/* Story */}
              {selectedMember.story && (
                <div className="bg-linear-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-emerald-400">
                  <h3 className="font-bold text-gray-900 mb-3">📖 Personal Story</h3>
                  <p className="text-gray-800 leading-relaxed italic">{selectedMember.story}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
