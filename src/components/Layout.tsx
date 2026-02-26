import { ThemeToggle } from "@/components/ThemeToggle";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="font-mono text-primary">pico</span>
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>Developed and designed with ❤️ by Corbin Murray</p>
          <p>Copyright &copy; {new Date().getFullYear()} Corbin Murray</p>
        </div>
      </footer>
    </div>
  );
}
