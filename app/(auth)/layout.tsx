export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-semibold tracking-tight">
            Sub<span className="text-primary">wise</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
