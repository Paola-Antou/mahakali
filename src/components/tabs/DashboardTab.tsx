import { useProducts, useMovements, useExpenses, useStockCalculation } from '@/hooks/useDatabase';
import { Card } from '../ui/card'; // Adjusted path to Card component

export default function DashboardTab() {
  const { products } = useProducts();
  const { movements } = useMovements();
  const { expenses } = useExpenses();
  const stockByProduct = useStockCalculation(products, movements);

  let totalStockValue = 0;
  let lowStockCount = 0;
  const categoryStats: Record<string, { count: number; value: number }> = {};

  products.forEach((p) => {
    const currentStock = stockByProduct[p.id] || p.initial_stock;
    const value = currentStock * p.unit_price;
    totalStockValue += value;

    if (currentStock <= p.min_stock) {
      lowStockCount++;
    }

    const cat = p.category || 'Sans catégorie';
    if (!categoryStats[cat]) {
      categoryStats[cat] = { count: 0, value: 0 };
    }
    categoryStats[cat].count++;
    categoryStats[cat].value += value;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="text-sm text-gray-600">Synthèse globale du stock et des dépenses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Valeur totale du stock</h3>
          <p className="text-3xl font-bold text-blue-600">{totalStockValue.toLocaleString('fr-FR')}</p>
          <p className="text-xs text-gray-600 mt-1">FCFA</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Articles en stock</h3>
          <p className="text-3xl font-bold text-green-600">{products.length}</p>
          <p className="text-xs text-gray-600 mt-1">Nombre d'articles</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Articles en alerte</h3>
          <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
          <p className="text-xs text-gray-600 mt-1">Stock ≤ minimum</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Total des dépenses</h3>
          <p className="text-3xl font-bold text-red-600">{totalExpenses.toLocaleString('fr-FR')}</p>
          <p className="text-xs text-gray-600 mt-1">FCFA</p>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Valeur du stock par catégorie</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 text-left">Catégorie</th>
                <th className="px-4 py-2 text-right">Nombre d'articles</th>
                <th className="px-4 py-2 text-right">Valeur totale (FCFA)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categoryStats).map(([cat, stats]) => (
                <tr key={cat} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{cat}</td>
                  <td className="px-4 py-2 text-right">{stats.count}</td>
                  <td className="px-4 py-2 text-right">{stats.value.toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}