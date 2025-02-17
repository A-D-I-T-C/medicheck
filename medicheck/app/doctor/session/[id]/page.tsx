'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Document } from '@/lib/db/schema';
import { getDetails } from '../../actions';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardCard from '@/components/DashboardCard';
import Modal from '@/components/modal';

export default function SessionPage() {
  const params = useParams();
  const id = params?.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (id) {
        try {
          const { userDetails, userDocuments } = await getDetails(id);
          setUser(userDetails[0]);
          setDocuments(userDocuments);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
    }

    fetchUser();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Gradient Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DashboardHeader 
          title={`Patient: ${user.name}`}
          description="View patient details and documents"
        />

        <div className="grid gap-8">
          {/* Patient Details Card */}
          <DashboardCard title="Patient Information">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-400">Name</p>
                <p className="text-lg text-white font-medium">{user.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400">Email</p>
                <p className="text-lg text-white font-medium">{user.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400">Role</p>
                <p className="text-lg text-white font-medium">{user.role}</p>
              </div>
            </div>
          </DashboardCard>

          {/* Documents Card */}
          <DashboardCard title="Medical Documents">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="relative bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4
                    transition-all duration-300 hover:bg-gray-800/60 hover:border-gray-600/50 
                    hover:shadow-lg hover:shadow-blue-500/10 group"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 
                      transition-colors duration-300"
                    >
                      {doc.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3">{doc.content}</p>
                  </div>
                  
                  {/* View Details Icon */}
                  <div className="absolute top-4 right-4 text-gray-400 
                    transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Document Modal */}
       {/* Document Modal */}
       <Modal isOpen={!!selectedDocument} onClose={() => setSelectedDocument(null)}>
        {selectedDocument && (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
            {/* Header */}
            <div className="border-b border-gray-700/50 pb-4">
              <h2 className="text-2xl font-bold text-white mb-2">{selectedDocument.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Created: {new Date(selectedDocument.createdAt).toLocaleDateString()}</span>
                <span>Type: Medical Record</span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedDocument.content}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-700/50 pt-4 mt-8">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white 
                    transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                    hover:bg-blue-700 rounded-lg transition-colors duration-200"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}