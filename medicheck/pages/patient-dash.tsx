export default function PatientDashboard() {
  return (
    <div className="flex flex-col h-screen">
      {/* ✅ Patient Dashboard Section */}
      <div className="p-6 bg-gray-100 border-b shadow-md">
        <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
        <p className="text-gray-600">Welcome, patient! View your consultations and chat with your doctor.</p>
      </div>

      {/* ✅ Embed Chat using an iframe */}
      <div className="flex-grow">
        <iframe
          src="/chat" // ✅ Uses the existing (chat) folder
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
}
