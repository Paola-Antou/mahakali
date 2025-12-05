import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <header className="bg-gradient-to-r from-slate-950 to-gray-900 border-b border-slate-700/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">MAHAKALI – Gestion de stock</h1>
            <p className="text-xs text-gray-400 mt-1">
              v3 – Multi-utilisateurs, stats prix, dettes, factures, Naira↔CFA
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-300">
              Connecté : <strong className="text-white">{user?.email}</strong>
              <span className="ml-2 px-2 py-1 bg-slate-800 rounded-full text-xs text-gray-300">
                {user?.role}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 justify-end">
              <span className="px-2 py-1 bg-slate-800 rounded text-xs text-gray-400">
                {format(new Date(), 'dd/MM/yyyy', { locale: fr })}
              </span>
              <Button
                onClick={logout}
                size="sm"
                variant="outline"
                className="bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700 text-xs"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
      <footer className="text-center text-xs text-gray-500 py-4">
        Mahakali – Gestion de stock v3 (React + TypeScript + SQLite)
      </footer>
    </div>
  );
}