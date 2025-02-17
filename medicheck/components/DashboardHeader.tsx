interface DashboardHeaderProps {
    title: string;
    description: string;
  }
  
  export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
    return (
      <div className="relative mb-10">
        <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-8 -right-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <h1 className="relative text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">
          {title}
        </h1>
        <p className="mt-3 text-gray-400 text-lg">{description}</p>
      </div>
    );
  }