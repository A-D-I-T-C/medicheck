'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { register, type RegisterActionState } from '../actions';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // Add name state
  const [name, setName] = useState(''); // Add name state
  const [role, setRole] = useState('patient'); // Default to patient
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast.error('Account already exists');
    } else if (state.status === 'failed') {
      toast.error('Failed to create account');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      console.log('Redirecting with role:', role); // Debugging log
      toast.success('Account created successfully');
      setIsSuccessful(true);
      router.push(role === 'doctor' ? '/doctor/home' : '/patient/home');
    }
  }, [state, router, role]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    setName(formData.get('name') as string); // Set name state
    setName(formData.get('name') as string); // Set name state
    formData.set('role', role); // ✅ Ensure role is sent to the backend
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign Up</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Create an account with your email and password
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          {/* Name Input Field */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded-md mb-4"
            required
          />
          {/* Role Selection */}
          {/* Name Input Field */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded-md mb-4"
            required
          />
          {/* Role Selection */}
          <select
            className="p-2 border rounded-md mb-4"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          <SubmitButton isSuccessful={isSuccessful}>Sign Up</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {'Already have an account? '}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign in
            </Link>
            {' instead.'}
          </p>
        </AuthForm>
      </div>
    </div>
  );
}