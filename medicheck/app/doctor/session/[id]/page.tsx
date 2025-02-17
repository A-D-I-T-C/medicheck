'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@/lib/db/schema';
import { getDetails } from '../../actions';

export default function SessionPage() {
    const params = useParams();
    const id = params?.id as string;
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUser() {
        if (id) {
            try {
            const userData = await getDetails(id);
            setUser(userData[0]);
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-white">User Details</h1>
            <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-lg text-white">Name: {user.name}</p>
            <p className="text-lg text-white">Email: {user.email}</p>
            <p className="text-lg text-white">Role: {user.role}</p>
            {/* Add more user details as needed */}
            </div>
        </div>
        </div>
    );
}