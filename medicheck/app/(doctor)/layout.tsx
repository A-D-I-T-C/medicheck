// app/(doctor)/layout.tsx
export default function DoctorLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-background">
        {/* Add any doctor-specific layout elements like navigation here */}
        <main>{children}</main>
      </div>
    );
  }