'use client';

import { useParams } from 'next/navigation';
import {Chat} from '@/components/chat'; // ✅ Ensure chat is default exported

export default function Page() {
    const params = useParams();

    // ✅ Extract ID from params, if not null
    const id = params?.id;  

    return (
        <div className="p-6">
        <h1 className="text-2xl font-bold">Session Details</h1>
        <p className="text-gray-600">Viewing details for Patient ID: {id}</p>

        {/* ✅ Load Chat Component */}
        <div className="mt-6">
            <h2 className="text-lg font-semibold">Chat</h2>

        </div>
        </div>
    );
}
