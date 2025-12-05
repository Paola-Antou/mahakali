import { useState } from 'react';
import { useProducts, useMovements } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge'; // Ensure this path is correct
// If the Badge component does not exist, create it or adjust the import path accordingly.
import { format } from 'date-fns';

export default function MovementsTab() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { movements, addMovement } = useMovements();
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'ENTREE' as 'ENTREE' | 'SORTIE',
    product_id: '',
    quantity: 1,
    unit_price: '',
    client_name: '',
    client_phone: '',
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id || formData.quantity <= 0) {
      alert('Article et quantité sont obligatoires.');
      return;
    }

    addMovement({
      date: formData.date,
      type: formData.type,
      product_id: Number(formData.product_id),
      quantity: formData.quantity,
      unit_price: formData.unit_price ? Number(formData.unit_price) : null,
      client_name: formData.client_name,
      client_phone: formData.client_phone,
      comment: formData.comment,
      created_by: user!.id,
    });

    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'ENTREE',
      product_id: '',
      quantity: 1,
      unit_price: '',
      client_name: '',
      client_phone: '',
      comment: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Entrées / Sorties</h2>
          <p className="text-sm text-gray-600">Historique des mouvements de stock</p>
        </div>
        <Badge variant="outline">{movements.length} mouvement(s)</Badge>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Enregistrer un mouvement</h3>
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
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value: 'ENTREE' | 'SORTIE') => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ENTREE">Entrée</SelectItem>
                <SelectItem value="SORTIE">Sortie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="product">Article *</Label>
            <Select value={formData.product_id} onValueChange={(value) => setFormData({ ...formData, product_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.code} - {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity">Quantité *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="unit_price">Prix unitaire (optionnel)</Label>
            <Input
              id="unit_price"
              type="number"
              value={formData.unit_price}
              onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="client_name">Nom client</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="client_phone">Téléphone client</Label>
            <Input
              id="client_phone"
              value={formData.client_phone}
              onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="comment">Commentaire</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={2}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full">
              Valider le mouvement
            </Button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-3">Historique</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Article</th>
              <th className="px-4 py-2 text-right">Quantité</th>
              <th className="px-4 py-2 text-right">Prix unit.</th>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Créé par</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{movement.date}</td>
                <td className="px-4 py-2">
                  <Badge variant={movement.type === 'ENTREE' ? 'default' : 'secondary'}>
                    {movement.type}
                  </Badge>
                </td>
                <td className="px-4 py-2">
                  {movement.product_code} - {movement.product_name}
                </td>
                <td className="px-4 py-2 text-right">{movement.quantity}</td>
                <td className="px-4 py-2 text-right">
                  {movement.unit_price ? movement.unit_price.toLocaleString('fr-FR') : '-'}
                </td>
                <td className="px-4 py-2">{movement.client_name || '-'}</td>
                <td className="px-4 py-2">{movement.creator_email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}