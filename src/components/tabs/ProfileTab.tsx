import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '@/components/ui/label';
import bcrypt from 'bcryptjs';
import { getDatabase, saveDatabase } from '@/lib/db';

export default function ProfileTab() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.currentPassword) {
      setError('Le mot de passe actuel est obligatoire.');
      return;
    }

    try {
      const db = getDatabase();
      const result = db.exec('SELECT password_hash FROM users WHERE id = ?', [user!.id]);

      if (result.length === 0 || result[0].values.length === 0) {
        setError('Utilisateur non trouvé.');
        return;
      }

      const currentHash = result[0].values[0][0] as string;
      if (!bcrypt.compareSync(formData.currentPassword, currentHash)) {
        setError('Le mot de passe actuel est incorrect.');
        return;
      }

      if (formData.email !== user!.email) {
        db.run('UPDATE users SET email = ? WHERE id = ?', [formData.email, user!.id]);
      }

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Les nouveaux mots de passe ne correspondent pas.');
          return;
        }
        if (formData.newPassword.length < 6) {
          setError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
          return;
        }

        const newHash = bcrypt.hashSync(formData.newPassword, 10);
        db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, user!.id]);
      }

      saveDatabase();
      setMessage('Profil mis à jour avec succès.');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      if (formData.email !== user!.email || formData.newPassword) {
        setTimeout(() => {
          logout();
        }, 2000);
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mon profil</h2>
        <p className="text-sm text-gray-600">Modifier votre email et/ou votre mot de passe</p>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="currentPassword">
            Mot de passe actuel <span className="text-red-500">*</span>
          </Label>
          <Input
            id="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="newPassword">
            Nouveau mot de passe <span className="text-sm text-gray-500">(laisser vide pour ne pas changer)</span>
          </Label>
          <Input
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>

        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full">
          Mettre à jour mon profil
        </Button>
      </form>

      <p className="text-xs text-gray-500">
        Pour toute modification, vous devez saisir votre mot de passe actuel. Si vous modifiez l'email ou le mot de
        passe, vous serez déconnecté automatiquement.
      </p>
    </div>
  );
}