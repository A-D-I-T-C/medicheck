interface DashboardHeaderProps {
  title: string;
  description: string;
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div className="relative mb-10">
      <div className="absolute -top-8 -left-8 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute -top-8 -right-8 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
      <h1 className="mt-4 relative text-5xl font-bold text-white">
        {title}
      </h1>
      <p className="mt-3 text-white text-xl">{description}</p>
    </div>
  );
}
