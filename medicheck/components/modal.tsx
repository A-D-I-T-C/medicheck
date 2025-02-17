import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative bg-gray-900 rounded-xl shadow-xl 
        w-full max-w-4xl border border-gray-700/50">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 
            hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content Container */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}