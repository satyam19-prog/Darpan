export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated gradient blobs for background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/20 blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-500/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      <div className="z-10 w-full max-w-md px-4 relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text tracking-tight mb-2">Darpan</h1>
          <p className="text-slate-400">Track. Compete. Improve.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
