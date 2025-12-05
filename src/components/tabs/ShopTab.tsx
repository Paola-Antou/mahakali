import { useProducts, useMovements, useStockCalculation } from '@/hooks/useDatabase';
import { Card } from '../ui/card';

export default function ShopTab() {
  const { products } = useProducts();
  const { movements } = useMovements();
  const stockByProduct = useStockCalculation(products, movements);

  const availableProducts = products.filter((p) => {
    const stock = stockByProduct[p.id] || p.initial_stock;
    return stock > 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Boutique</h2>
        <p className="text-sm text-gray-600">Vue client des produits disponibles en stock</p>
      </div>

      {availableProducts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aucun produit disponible en stock pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableProducts.map((product) => {
            const stock = stockByProduct[product.id] || product.initial_stock;
            const price = product.reseller_price || product.unit_price;
            return (
              <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow">
                {product.image_path ? (
                  <img
                    src={product.image_path}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">
                      {product.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  {product.code} · {product.category}
                </p>
                <p className="text-lg font-bold text-blue-600 mb-1">
                  {price.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-xs text-gray-600">Stock disponible : {stock}</p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}