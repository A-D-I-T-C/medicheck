// app/(patient)/layout.tsx
export default function PatientLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-background">
        {/* Add any patient-specific layout elements like navigation here */}
        <main>{children}</main>
      </div>
    );
  }