import { useDebtors } from '@/hooks/useDatabase';

export default function DebtorsTab() {
  const { debtors } = useDebtors();

  const totalBalance = debtors.reduce((sum, d) => sum + d.total_balance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Clients débiteurs</h2>
        <p className="text-sm text-gray-600">Liste des clients avec reste à payer</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Téléphone</th>
              <th className="px-4 py-2 text-left">Première vente</th>
              <th className="px-4 py-2 text-left">Dernière vente</th>
              <th className="px-4 py-2 text-center">Nb ventes</th>
              <th className="px-4 py-2 text-right">Total dû</th>
              <th className="px-4 py-2 text-right">Reste à payer</th>
            </tr>
          </thead>
          <tbody>
            {debtors.map((debtor, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{debtor.client_name}</td>
                <td className="px-4 py-2">{debtor.client_phone || '-'}</td>
                <td className="px-4 py-2">{debtor.first_date}</td>
                <td className="px-4 py-2">{debtor.last_date}</td>
                <td className="px-4 py-2 text-center">{debtor.n_sales}</td>
                <td className="px-4 py-2 text-right">{debtor.total_due.toLocaleString('fr-FR')}</td>
                <td className="px-4 py-2 text-right text-red-600 font-semibold">
                  {debtor.total_balance.toLocaleString('fr-FR')}
                </td>
              </tr>
            ))}
            {debtors.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Aucun client débiteur pour le moment.
                </td>
              </tr>
            ) : (
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={6} className="px-4 py-2 text-right">
                  Total
                </td>
                <td className="px-4 py-2 text-right text-red-600">
                  {totalBalance.toLocaleString('fr-FR')} FCFA
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}