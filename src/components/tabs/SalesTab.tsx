import { useState } from 'react';
import { useProducts, useSales } from '@/hooks/useDatabase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

export default function SalesTab() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { sales, addSale } = useSales();
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    product_id: '',
    quantity: 1,
    unit_price: 0,
    payment_mode: '',
    paid_amount: 0,
    client_name: '',
    client_phone: '',
    comment: '',
  });

  const total = formData.quantity * formData.unit_price;
  const balance = Math.max(total - formData.paid_amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id || formData.quantity <= 0 || formData.unit_price <= 0 || !formData.payment_mode) {
      alert('Article, quantité, prix unitaire et mode de paiement sont obligatoires.');
      return;
    }

    addSale({
      date: formData.date,
      product_id: Number(formData.product_id),
      quantity: formData.quantity,
      unit_price: formData.unit_price,
      total,
      payment_mode: formData.payment_mode,
      client_name: formData.client_name,
      client_phone: formData.client_phone,
      paid_amount: formData.paid_amount,
      balance,
      comment: formData.comment,
      created_by: user!.id,
    });

    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      product_id: '',
      quantity: 1,
      unit_price: 0,
      payment_mode: '',
      paid_amount: 0,
      client_name: '',
      client_phone: '',
      comment: '',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Ventes</h2>
        <p className="text-sm text-gray-600">Enregistrement des ventes</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Enregistrer une vente</h3>
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
            <Label htmlFor="unit_price">Prix unitaire (FCFA) *</Label>
            <Input
              id="unit_price"
              type="number"
              value={formData.unit_price}
              onChange={(e) => setFormData({ ...formData, unit_price: Number(e.target.value) })}
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
            <Label htmlFor="paid_amount">Montant payé (FCFA)</Label>
            <Input
              id="paid_amount"
              type="number"
              value={formData.paid_amount}
              onChange={(e) => setFormData({ ...formData, paid_amount: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="client_name">Client</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="client_phone">Téléphone</Label>
            <Input
              id="client_phone"
              value={formData.client_phone}
              onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
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
          <div>
            <Label>Total calculé</Label>
            <Input value={total.toLocaleString('fr-FR')} readOnly className="bg-gray-100" />
          </div>
          <div>
            <Label>Reste à payer</Label>
            <Input value={balance.toLocaleString('fr-FR')} readOnly className="bg-gray-100" />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full">
              Enregistrer la vente
            </Button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-3">Historique des ventes</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Article</th>
              <th className="px-4 py-2 text-right">Qté</th>
              <th className="px-4 py-2 text-right">PU</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2 text-right">Payé</th>
              <th className="px-4 py-2 text-right">Reste</th>
              <th className="px-4 py-2 text-left">Client</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{sale.date}</td>
                <td className="px-4 py-2">
                  {sale.product_code} - {sale.product_name}
                </td>
                <td className="px-4 py-2 text-right">{sale.quantity}</td>
                <td className="px-4 py-2 text-right">{sale.unit_price.toLocaleString('fr-FR')}</td>
                <td className="px-4 py-2 text-right">{sale.total.toLocaleString('fr-FR')}</td>
                <td className="px-4 py-2 text-right">{sale.paid_amount.toLocaleString('fr-FR')}</td>
                <td className="px-4 py-2 text-right text-red-600">{sale.balance.toLocaleString('fr-FR')}</td>
                <td className="px-4 py-2">{sale.client_name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}