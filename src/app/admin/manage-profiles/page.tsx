'use client';

import { useState } from 'react';
import { useTeachersProfiles, useAdminProfiles, useStaffProfiles, useJourneySteps, JourneyStep, TeacherProfile, AdminProfile, StaffProfile } from '@/hooks/useProfileManagement';

export default function ManageProfiles() {
  const [activeTab, setActiveTab] = useState<'teachers' | 'admins' | 'staff' | 'journey'>('teachers');
  const teachersProfiles = useTeachersProfiles();
  const adminProfiles = useAdminProfiles();
  const staffProfiles = useStaffProfiles();
  const journeySteps = useJourneySteps();

  // Teacher state
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherProfile | null>(null);
  const [teacherFormData, setTeacherFormData] = useState<Partial<TeacherProfile>>({});

  // Admin state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminProfile | null>(null);
  const [adminFormData, setAdminFormData] = useState<Partial<AdminProfile>>({});

  // Staff state
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffProfile | null>(null);
  const [staffFormData, setStaffFormData] = useState<Partial<StaffProfile>>({});

  // Journey state
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [editingStep, setEditingStep] = useState<JourneyStep | null>(null);
  const [journeyFormData, setJourneyFormData] = useState<Partial<JourneyStep>>({});

  // Teacher handlers
  const handleOpenTeacherModal = (teacher?: TeacherProfile) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setTeacherFormData(teacher);
    } else {
      setEditingTeacher(null);
      setTeacherFormData({ name: '', rating: 4.5, lessons_completed: 0, bio: '', story: '' });
    }
    setShowTeacherModal(true);
  };

  const handleSaveTeacher = async () => {
    if (!teacherFormData.name) {
      alert('Please fill in all required fields');
      return;
    }
    const result = editingTeacher
      ? await teachersProfiles.updateProfile(editingTeacher.id, teacherFormData)
      : await teachersProfiles.addProfile(teacherFormData as Omit<TeacherProfile, 'id' | 'created_at' | 'updated_at'>);
    if (result) {
      alert('Teacher saved successfully!');
      setShowTeacherModal(false);
      teachersProfiles.fetchProfiles();
    }
  };

  // Admin handlers
  const handleOpenAdminModal = (admin?: AdminProfile) => {
    if (admin) {
      setEditingAdmin(admin);
      setAdminFormData(admin);
    } else {
      setEditingAdmin(null);
      setAdminFormData({ name: '', role: '', bio: '' });
    }
    setShowAdminModal(true);
  };

  const handleSaveAdmin = async () => {
    if (!adminFormData.name) {
      alert('Please fill in all required fields');
      return;
    }
    const result = editingAdmin
      ? await adminProfiles.updateProfile(editingAdmin.id, adminFormData)
      : await adminProfiles.addProfile(adminFormData as Omit<AdminProfile, 'id' | 'created_at' | 'updated_at'>);
    if (result) {
      alert('Admin saved successfully!');
      setShowAdminModal(false);
      adminProfiles.fetchProfiles();
    }
  };

  // Staff handlers
  const handleOpenStaffModal = (staff?: StaffProfile) => {
    if (staff) {
      setEditingStaff(staff);
      setStaffFormData(staff);
    } else {
      setEditingStaff(null);
      setStaffFormData({ name: '', position: '', tickets_resolved: 0, satisfaction_rating: 95, bio: '' });
    }
    setShowStaffModal(true);
  };

  const handleSaveStaff = async () => {
    if (!staffFormData.name) {
      alert('Please fill in all required fields');
      return;
    }
    const result = editingStaff
      ? await staffProfiles.updateProfile(editingStaff.id, staffFormData)
      : await staffProfiles.addProfile(staffFormData as Omit<StaffProfile, 'id' | 'created_at' | 'updated_at'>);
    if (result) {
      alert('Staff saved successfully!');
      setShowStaffModal(false);
      staffProfiles.fetchProfiles();
    }
  };

  // Journey handlers
  const handleOpenJourneyModal = (step?: JourneyStep) => {
    if (step) {
      setEditingStep(step);
      setJourneyFormData(step);
    } else {
      setEditingStep(null);
      setJourneyFormData({});
    }
    setShowJourneyModal(true);
  };

  const handleSaveJourneyStep = async () => {
    if (!editingStep) return;
    const result = await journeySteps.updateStep(editingStep.id, journeyFormData);
    if (result) {
      alert('Journey step updated successfully!');
      setShowJourneyModal(false);
      journeySteps.fetchSteps();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-purple-600 to-pink-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Profile Management</h1>
            <p className="text-purple-100 mt-2">Edit, add, and manage all profiles and journey steps</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b bg-white sticky top-0 z-10 flex-wrap">
            <button
              onClick={() => setActiveTab('teachers')}
              className={`flex-1 py-3 px-4 font-bold transition ${
                activeTab === 'teachers'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👨‍🏫 Teachers ({teachersProfiles.data.length})
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex-1 py-3 px-4 font-bold transition ${
                activeTab === 'admins'
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👔 Admins ({adminProfiles.data.length})
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex-1 py-3 px-4 font-bold transition ${
                activeTab === 'staff'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💬 Support Staff ({staffProfiles.data.length})
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`flex-1 py-3 px-4 font-bold transition ${
                activeTab === 'journey'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🚀 Journey Timeline ({journeySteps.data.length})
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Teachers Tab */}
            {activeTab === 'teachers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Teachers</h2>
                  <button
                    onClick={() => handleOpenTeacherModal()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
                  >
                    + Add Teacher
                  </button>
                </div>
                {teachersProfiles.loading ? (
                  <div className="text-center py-12">Loading teachers...</div>
                ) : teachersProfiles.error ? (
                  <div className="text-center py-12 text-red-600">{teachersProfiles.error}</div>
                ) : (
                  <div className="space-y-4">
                    {teachersProfiles.data.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="bg-white border-l-4 border-purple-600 p-4 rounded-lg flex justify-between items-center hover:shadow-md transition"
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{teacher.name}</h3>
                          <p className="text-sm text-gray-600">Rating: ⭐ {teacher.rating} | Lessons: {teacher.lessons_completed}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenTeacherModal(teacher)}
                            className="px-4 py-2 bg-purple-100 text-purple-600 rounded font-bold hover:bg-purple-200"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this teacher?')) {
                                teachersProfiles.deleteProfile(teacher.id).then(() => teachersProfiles.fetchProfiles());
                              }
                            }}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded font-bold hover:bg-red-200"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Admins Tab */}
            {activeTab === 'admins' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Admin Team</h2>
                  <button
                    onClick={() => handleOpenAdminModal()}
                    className="px-6 py-2 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition"
                  >
                    + Add Admin
                  </button>
                </div>
                {adminProfiles.loading ? (
                  <div className="text-center py-12">Loading admins...</div>
                ) : adminProfiles.error ? (
                  <div className="text-center py-12 text-red-600">{adminProfiles.error}</div>
                ) : (
                  <div className="space-y-4">
                    {adminProfiles.data.map((admin) => (
                      <div
                        key={admin.id}
                        className="bg-white border-l-4 border-pink-600 p-4 rounded-lg flex justify-between items-center hover:shadow-md transition"
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{admin.name}</h3>
                          <p className="text-sm text-gray-600">Role: {admin.role}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenAdminModal(admin)}
                            className="px-4 py-2 bg-pink-100 text-pink-600 rounded font-bold hover:bg-pink-200"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this admin?')) {
                                adminProfiles.deleteProfile(admin.id).then(() => adminProfiles.fetchProfiles());
                              }
                            }}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded font-bold hover:bg-red-200"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Support Staff Tab */}
            {activeTab === 'staff' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Support Staff</h2>
                  <button
                    onClick={() => handleOpenStaffModal()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    + Add Staff
                  </button>
                </div>
                {staffProfiles.loading ? (
                  <div className="text-center py-12">Loading staff...</div>
                ) : staffProfiles.error ? (
                  <div className="text-center py-12 text-red-600">{staffProfiles.error}</div>
                ) : (
                  <div className="space-y-4">
                    {staffProfiles.data.map((staff) => (
                      <div
                        key={staff.id}
                        className="bg-white border-l-4 border-blue-600 p-4 rounded-lg flex justify-between items-center hover:shadow-md transition"
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{staff.name}</h3>
                          <p className="text-sm text-gray-600">Position: {staff.position}</p>
                          <p className="text-sm text-gray-600">Tickets: {staff.tickets_resolved} | Satisfaction: {staff.satisfaction_rating}%</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenStaffModal(staff)}
                            className="px-4 py-2 bg-blue-100 text-blue-600 rounded font-bold hover:bg-blue-200"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this staff?')) {
                                staffProfiles.deleteProfile(staff.id).then(() => staffProfiles.fetchProfiles());
                              }
                            }}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded font-bold hover:bg-red-200"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Journey Timeline Tab */}
            {activeTab === 'journey' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Journey Timeline</h2>
                {journeySteps.loading ? (
                  <div className="text-center py-12">Loading journey steps...</div>
                ) : journeySteps.error ? (
                  <div className="text-center py-12 text-red-600">{journeySteps.error}</div>
                ) : (
                  <div className="space-y-4">
                    {journeySteps.data.map((step) => (
                      <div
                        key={step.id}
                        className="bg-white border-l-4 border-green-600 p-6 rounded-lg hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start gap-4">
                            <span className="text-4xl">{step.emoji}</span>
                            <div>
                              <h3 className="font-bold text-gray-900 text-xl">
                                Step {step.step_number}: {step.title}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleOpenJourneyModal(step)}
                            className="px-4 py-2 bg-green-100 text-green-600 rounded font-bold hover:bg-green-200"
                          >
                            ✏️ Edit
                          </button>
                        </div>
                        {step.what_happens && (
                          <div className="bg-green-50 p-4 rounded-lg mb-4">
                            <p className="font-semibold text-gray-900 mb-2">✓ What Happens:</p>
                            <ul className="text-gray-700 space-y-1 text-sm">
                              {step.what_happens.split('|').map((item, idx) => (
                                <li key={idx}>• {item.trim()}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {step.pro_tip && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-sm text-gray-700">
                            <p className="font-semibold text-yellow-900 mb-1">💡 Pro Tip:</p>
                            <p>{step.pro_tip}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Teacher Modal */}
        {showTeacherModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
              </h2>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={teacherFormData.name || ''}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={teacherFormData.email || ''}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, email: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={teacherFormData.phone || ''}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, phone: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Qualification & Language */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Qualification</label>
                    <input
                      type="text"
                      placeholder="e.g., MA English, TEFL"
                      value={teacherFormData.qualification || ''}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, qualification: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Language</label>
                    <input
                      type="text"
                      placeholder="e.g., English (Native)"
                      value={teacherFormData.language || ''}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, language: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Experience & Availability */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={teacherFormData.experience_years || 0}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, experience_years: parseInt(e.target.value) })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Availability</label>
                    <input
                      type="text"
                      placeholder="e.g., Full-time, Flexible"
                      value={teacherFormData.availability || ''}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, availability: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Rating & Lessons */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="4.5"
                      value={teacherFormData.rating || 0}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, rating: parseFloat(e.target.value) })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Lessons Completed</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={teacherFormData.lessons_completed || 0}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, lessons_completed: parseInt(e.target.value) })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image Path */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Image</label>
                  <input
                    type="text"
                    placeholder="e.g., john-doe.jpg"
                    value={teacherFormData.image || ''}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, image: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">File should be in public/teachers folder</p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                  <textarea
                    placeholder="Professional bio (2-3 sentences)"
                    value={teacherFormData.bio || ''}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, bio: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                {/* Story */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Story</label>
                  <textarea
                    placeholder="Teaching journey and personal story"
                    value={teacherFormData.story || ''}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, story: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4 border-t-2 border-gray-200">
                  <button
                    onClick={handleSaveTeacher}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowTeacherModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-bold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {editingAdmin ? 'Edit Admin' : 'Add Admin'}
              </h2>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={adminFormData.name || ''}
                    onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="admin@example.com"
                      value={adminFormData.email || ''}
                      onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={adminFormData.phone || ''}
                      onChange={(e) => setAdminFormData({ ...adminFormData, phone: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Role & Department */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Role *</label>
                    <input
                      type="text"
                      placeholder="e.g., Super Admin, Manager"
                      value={adminFormData.role || ''}
                      onChange={(e) => setAdminFormData({ ...adminFormData, role: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      placeholder="e.g., Operations, Support"
                      value={adminFormData.department || ''}
                      onChange={(e) => setAdminFormData({ ...adminFormData, department: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Experience & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Experience</label>
                    <input
                      type="text"
                      placeholder="e.g., 5 years"
                      value={adminFormData.experience || ''}
                      onChange={(e) => setAdminFormData({ ...adminFormData, experience: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <input
                      type="text"
                      placeholder="e.g., Active, Inactive"
                      value={adminFormData.status || ''}
                      onChange={(e) => setAdminFormData({ ...adminFormData, status: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Join Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    value={adminFormData.join_date || ''}
                    onChange={(e) => setAdminFormData({ ...adminFormData, join_date: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                  <textarea
                    placeholder="Professional bio"
                    value={adminFormData.bio || ''}
                    onChange={(e) => setAdminFormData({ ...adminFormData, bio: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                {/* Story */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Story</label>
                  <textarea
                    placeholder="Background and career journey"
                    value={adminFormData.story || ''}
                    onChange={(e) => setAdminFormData({ ...adminFormData, story: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4 border-t-2 border-gray-200">
                  <button
                    onClick={handleSaveAdmin}
                    className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowAdminModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-bold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staff Modal */}
        {showStaffModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {editingStaff ? 'Edit Staff' : 'Add Staff'}
              </h2>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={staffFormData.name || ''}
                    onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="staff@example.com"
                      value={staffFormData.email || ''}
                      onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={staffFormData.phone || ''}
                      onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Position & Department */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Position *</label>
                    <input
                      type="text"
                      placeholder="e.g., Support Specialist"
                      value={staffFormData.position || ''}
                      onChange={(e) => setStaffFormData({ ...staffFormData, position: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      placeholder="e.g., Customer Support"
                      value={staffFormData.department || ''}
                      onChange={(e) => setStaffFormData({ ...staffFormData, department: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Specialization & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g., Technical Support"
                      value={staffFormData.specialization || ''}
                      onChange={(e) => setStaffFormData({ ...staffFormData, specialization: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <input
                      type="text"
                      placeholder="e.g., Active, Inactive"
                      value={staffFormData.status || ''}
                      onChange={(e) => setStaffFormData({ ...staffFormData, status: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Join Date & Availability */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Join Date</label>
                    <input
                      type="date"
                      value={staffFormData.join_date || ''}
                      onChange={(e) => setStaffFormData({ ...staffFormData, join_date: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Availability</label>
                    <input
                      type="text"
                      placeholder="e.g., Full-time, Part-time"
                      value={staffFormData.availability || ''}
                      onChange={(e) => setStaffFormData({ ...staffFormData, availability: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tickets & Satisfaction */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tickets Resolved</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={staffFormData.tickets_resolved || 0}
                      onChange={(e) => setStaffFormData({ ...staffFormData, tickets_resolved: parseInt(e.target.value) })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Satisfaction Rating (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="95"
                      value={staffFormData.satisfaction_rating || 0}
                      onChange={(e) => setStaffFormData({ ...staffFormData, satisfaction_rating: parseInt(e.target.value) })}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                  <textarea
                    placeholder="Professional bio"
                    value={staffFormData.bio || ''}
                    onChange={(e) => setStaffFormData({ ...staffFormData, bio: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                {/* Story */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Story</label>
                  <textarea
                    placeholder="Background and career journey"
                    value={staffFormData.story || ''}
                    onChange={(e) => setStaffFormData({ ...staffFormData, story: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4 border-t-2 border-gray-200">
                  <button
                    onClick={handleSaveStaff}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowStaffModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-bold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Journey Step Modal */}
        {showJourneyModal && editingStep && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Journey Step</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={journeyFormData.title || ''}
                  onChange={(e) => setJourneyFormData({ ...journeyFormData, title: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                />
                <textarea
                  placeholder="Description"
                  value={journeyFormData.description || ''}
                  onChange={(e) => setJourneyFormData({ ...journeyFormData, description: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="Emoji (e.g., 📝)"
                  value={journeyFormData.emoji || ''}
                  onChange={(e) => setJourneyFormData({ ...journeyFormData, emoji: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                />
                <select
                  value={journeyFormData.color_theme || 'purple'}
                  onChange={(e) => setJourneyFormData({ ...journeyFormData, color_theme: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="purple">Purple</option>
                  <option value="blue">Blue</option>
                  <option value="pink">Pink</option>
                  <option value="green">Green</option>
                  <option value="orange">Orange</option>
                </select>
                <textarea
                  placeholder="What Happens (pipe-delimited: Item 1 | Item 2)"
                  value={journeyFormData.what_happens || ''}
                  onChange={(e) => setJourneyFormData({ ...journeyFormData, what_happens: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="Time to Complete (e.g., 10-15 minutes)"
                  value={journeyFormData.time_to_complete || ''}
                  onChange={(e) => setJourneyFormData({ ...journeyFormData, time_to_complete: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                />
                <textarea
                  placeholder="Pro Tip"
                  value={journeyFormData.pro_tip || ''}
                  onChange={(e) => setJourneyFormData({ ...journeyFormData, pro_tip: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
                  rows={2}
                />
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSaveJourneyStep}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowJourneyModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-bold hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
