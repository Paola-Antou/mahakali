import { useState } from 'react';
import { useExpenses } from '@/hooks/useDatabase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input'; // Adjusted path to match the file structure
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '../ui/textarea'; // Adjusted path to match the file structure
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function ExpensesTab() {
  const { user } = useAuth();
  const { expenses, addExpense } = useExpenses();
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    amount: '',
    payment_mode: '',
    category: '',
    comment: '',
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.payment_mode) {
      alert('Description, montant et mode de paiement sont obligatoires.');
      return;
    }

    addExpense({
      date: formData.date,
      description: formData.description,
      amount: Number(formData.amount),
      payment_mode: formData.payment_mode,
      category: formData.category,
      comment: formData.comment,
      created_by: user!.id,
    });

    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      amount: '',
      payment_mode: '',
      category: '',
      comment: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dépenses</h2>
          <p className="text-sm text-gray-600">Suivi des dépenses</p>
        </div>
        <Badge variant="outline" className="text-base">
          Total : {totalExpenses.toLocaleString('fr-FR')} FCFA
        </Badge>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Ajouter une dépense</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Montant (FCFA) *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="payment_mode">Mode de paiement *</Label>
            <Select value={formData.payment_mode} onValueChange={(value) => setFormData({ ...formData, payment_mode: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Chèque">Chèque</SelectItem>
                <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Mobile money">Mobile money</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Loyer, Salaire..."
            />
          </div>
          <div>
            <Label htmlFor="comment">Commentaire</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={1}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full">
              Ajouter la dépense
            </Button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-3">Liste des dépenses</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-right">Montant</th>
              <th className="px-4 py-2 text-left">Mode</th>
              <th className="px-4 py-2 text-left">Catégorie</th>
              <th className="px-4 py-2 text-left">Créée par</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{expense.date}</td>
                <td className="px-4 py-2">{expense.description}</td>
                <td className="px-4 py-2 text-right">{expense.amount.toLocaleString('fr-FR')}</td>
                <td className="px-4 py-2">{expense.payment_mode}</td>
                <td className="px-4 py-2">{expense.category || '-'}</td>
                <td className="px-4 py-2">{expense.creator_email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}