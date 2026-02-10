'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { supabase } from '@/lib/supabase';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  created_at: string;
}

export default function ContactsAdminPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'new' | 'read' | 'responded') => {
    try {
      const { error } = await supabase.from('contacts').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      loadContacts();
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      loadContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'read':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'responded':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
        {/* Navigation */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition">
              🎓 Echoverse
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-purple-600 hover:text-pink-600 font-medium transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-linear-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Contact Submissions</h1>
            <p className="text-gray-600">Manage and respond to contact form submissions</p>
          </div>

          {loading ? (
            <div className="text-center text-gray-600 py-12 text-lg">Loading...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* List */}
              <div className="md:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
                <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white p-4">
                  <h2 className="text-lg font-bold">📧 Messages ({contacts.length})</h2>
                </div>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {contacts.length === 0 ? (
                    <div className="p-4 text-center text-gray-600">No contacts yet</div>
                  ) : (
                    contacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className={`w-full text-left p-4 hover:bg-purple-50 transition border-l-4 ${
                          selectedContact?.id === contact.id
                            ? 'border-purple-500 bg-purple-50'
                            : contact.status === 'new'
                              ? 'border-yellow-400'
                              : contact.status === 'responded'
                                ? 'border-green-400'
                                : 'border-purple-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 text-sm truncate">{contact.name}</div>
                        <div className="text-gray-600 text-xs truncate">{contact.email}</div>
                        <span
                          className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(
                            contact.status
                          )}`}
                        >
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Detail View */}
              <div className="md:col-span-2">
                {selectedContact ? (
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedContact.name}</h2>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            <span className="font-semibold text-gray-900">Email:</span>{' '}
                            <a
                              href={`mailto:${selectedContact.email}`}
                              className="text-purple-600 hover:text-pink-600 transition font-medium"
                            >
                              {selectedContact.email}
                            </a>
                          </p>
                          {selectedContact.phone && (
                            <p>
                              <span className="font-semibold text-gray-900">Phone:</span>{' '}
                              <a
                                href={`tel:${selectedContact.phone}`}
                                className="text-purple-600 hover:text-pink-600 transition font-medium"
                              >
                                {selectedContact.phone}
                              </a>
                            </p>
                          )}
                          <p>
                            <span className="font-semibold text-gray-900">Subject:</span> {selectedContact.subject}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-900">Date:</span>{' '}
                            {new Date(selectedContact.created_at).toLocaleDateString()} at{' '}
                            {new Date(selectedContact.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded border ${getStatusColor(
                          selectedContact.status
                        )}`}
                      >
                        {selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1)}
                      </span>
                    </div>

                    <div className="mb-6 pb-6 border-b-2 border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">Message</h3>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedContact.message}</p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => updateStatus(selectedContact.id, 'read')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          selectedContact.status === 'read'
                            ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                      >
                        ✓ Mark as Read
                      </button>
                      <button
                        onClick={() => updateStatus(selectedContact.id, 'responded')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          selectedContact.status === 'responded'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        ✓ Mark as Responded
                      </button>
                      <button
                        onClick={() => deleteContact(selectedContact.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-600 border border-purple-100">
                    <p className="text-lg font-medium">Select a message to view details</p>
                    <p className="text-sm mt-2">Choose a contact from the list on the left</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
