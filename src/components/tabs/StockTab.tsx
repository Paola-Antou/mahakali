import { useState } from 'react';
import { useProducts, useMovements, useStockCalculation } from '@/hooks/useDatabase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Trash2, Edit } from 'lucide-react';

export default function StockTab() {
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { movements } = useMovements();
  const stockByProduct = useStockCalculation(products, movements);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    initial_stock: 0,
    min_stock: 0,
    unit_price: 0,
    purchase_price: 0,
    reseller_price: 0,
    image_path: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      alert('Code et désignation sont obligatoires.');
      return;
    }

    if (editingId) {
      updateProduct(editingId, formData);
      setEditingId(null);
    } else {
      addProduct({ ...formData, created_by: user!.id });
    }

    setFormData({
      code: '',
      name: '',
      category: '',
      initial_stock: 0,
      min_stock: 0,
      unit_price: 0,
      purchase_price: 0,
      reseller_price: 0,
      image_path: '',
    });
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      code: product.code,
      name: product.name,
      category: product.category,
      initial_stock: product.initial_stock,
      min_stock: product.min_stock,
      unit_price: product.unit_price,
      purchase_price: product.purchase_price,
      reseller_price: product.reseller_price,
      image_path: product.image_path,
    });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stock</h2>
          <p className="text-sm text-gray-600">Gestion des articles</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {products.length} article(s)
        </Badge>
      </div>

      <div>
        <Label htmlFor="search">Rechercher un article</Label>
        <Input
          id="search"
          type="text"
          placeholder="Code, désignation, catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">
          {editingId ? 'Modifier un article' : 'Ajouter un article'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="code">Code article *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Désignation *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="initial_stock">Stock initial</Label>
            <Input
              id="initial_stock"
              type="number"
              value={formData.initial_stock}
              onChange={(e) => setFormData({ ...formData, initial_stock: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="min_stock">Stock minimum</Label>
            <Input
              id="min_stock"
              type="number"
              value={formData.min_stock}
              onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="purchase_price">Prix d'achat (FCFA)</Label>
            <Input
              id="purchase_price"
              type="number"
              value={formData.purchase_price}
              onChange={(e) => setFormData({ ...formData, purchase_price: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="reseller_price">Prix revendeur (FCFA)</Label>
            <Input
              id="reseller_price"
              type="number"
              value={formData.reseller_price}
              onChange={(e) => setFormData({ ...formData, reseller_price: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="unit_price">Prix unitaire (FCFA)</Label>
            <Input
              id="unit_price"
              type="number"
              value={formData.unit_price}
              onChange={(e) => setFormData({ ...formData, unit_price: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="image_path">Image (URL)</Label>
            <Input
              id="image_path"
              value={formData.image_path}
              onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full">
              {editingId ? 'Modifier' : 'Ajouter'}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    code: '',
                    name: '',
                    category: '',
                    initial_stock: 0,
                    min_stock: 0,
                    unit_price: 0,
                    purchase_price: 0,
                    reseller_price: 0,
                    image_path: '',
                  });
                }}
              >
                Annuler
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Désignation</th>
              <th className="px-4 py-2 text-left">Catégorie</th>
              <th className="px-4 py-2 text-right">Stock actuel</th>
              <th className="px-4 py-2 text-right">Stock min.</th>
              <th className="px-4 py-2 text-right">PU ref.</th>
              <th className="px-4 py-2 text-center">Alerte</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const currentStock = stockByProduct[product.id] || product.initial_stock;
              const isLowStock = currentStock <= product.min_stock;
              return (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{product.code}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2 text-right">{currentStock}</td>
                  <td className="px-4 py-2 text-right">{product.min_stock}</td>
                  <td className="px-4 py-2 text-right">{product.unit_price.toLocaleString('fr-FR')}</td>
                  <td className="px-4 py-2 text-center">
                    {isLowStock ? (
                      <Badge variant="destructive" className="text-xs">
                        ALERTE
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                        OK
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      {user?.role === 'admin' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm('Supprimer cet article ?')) {
                              deleteProduct(product.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}