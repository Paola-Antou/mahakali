import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email et mot de passe sont obligatoires.');
      setLoading(false);
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Identifiants invalides.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6">
      <Card className="w-full max-w-md bg-slate-900/95 border-slate-700 p-8 shadow-2xl">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              MAHAKALI
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Système de gestion de stock multi-utilisateurs
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/50 text-blue-300 px-4 py-3 rounded-lg text-xs">
            <p className="font-semibold mb-1">Compte administrateur par défaut :</p>
            <p className="font-mono">admin@mahakali.local / admin123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-slate-800 border-slate-600 text-white focus:border-blue-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-slate-800 border-slate-600 text-white focus:border-blue-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-full shadow-lg shadow-blue-500/50 transition-all"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}