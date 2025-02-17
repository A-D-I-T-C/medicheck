interface DashboardCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
  }
  
  export default function DashboardCard({ title, children, className = '' }: DashboardCardProps) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-gradient" />
        <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
          <h2 className="text-xl font-semibold mb-6 text-gray-100 flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 shadow-lg shadow-blue-500/50" />
            {title}
          </h2>
          {children}
        </div>
      </div>
    );
  }