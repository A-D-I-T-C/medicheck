'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardCard from '@/components/DashboardCard';
import DashboardHeader from '@/components/DashboardHeader';
import SessionList from '@/components/SessionList';
import Link from 'next/link';
import { Chat } from '@/lib/db/schema';
import { getChatsByUserIdHandler } from '../actions';

export default function PatientHomePage() {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getChats = async () => {      
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }
      try {
        const fetchedChats = await getChatsByUserIdHandler(session.user.id);
        const chats = fetchedChats.reverse()
        setChats(chats);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      } finally {
        setLoading(false);
      }
    };

    getChats();
  }, [session, status]);

  if (status === 'loading' || loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  if (status === 'unauthenticated') {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Please sign in to access your dashboard</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Gradient Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/50 to-orange-900/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section: Header and Buttons */}
        <div className="flex items-center justify-between mb-12"> {/* Added mb-12 for spacing */}
          <DashboardHeader
            title="Patient Dashboard"
            description="View your chat sessions and start new conversations"
          />
          <div className="flex space-x-4">
            <Link
              href="/"
              className="relative inline-block py-6 px-14 text-white font-bold text-3xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
              style={{
                background: 'linear-gradient(45deg, rgb(9, 65, 41), rgb(133, 117, 28))',
                border: '4px solid white',
              }}
            >
              <span className="relative">Text</span>
            </Link>
            <Link
              href="/"
              className="relative inline-block py-6 px-14 text-white font-bold text-3xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
              style={{
                background: 'linear-gradient(45deg, rgb(9, 65, 41), rgb(133, 117, 28))',
                border: '4px solid white',
              }}
            >
              <span className="relative">Voice</span>
            </Link>
          </div>
        </div>

        {/* Bottom Section: Recent Sessions Card */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardCard title="Recent Sessions" className="md:col-span-2">
            {chats.length > 0 ? (
              <SessionList sessions={chats} />
            ) : (
              <div className="text-center py-8 text-gray-400">
                No chat sessions found. Start a new chat to begin!
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}