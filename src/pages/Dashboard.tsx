import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import StockTab from '../components/tabs/StockTab';
import MovementsTab from '../components/tabs/MovementsTab';
import ExpensesTab from '../components/tabs/ExpensesTab';
import SalesTab from '../components/tabs/SalesTab';
import DebtorsTab from '../components/tabs/DebtorsTab';
import DashboardTab from '../components/tabs/DashboardTab';
import ShopTab from '../components/tabs/ShopTab';
import ProfileTab from '../components/tabs/ProfileTab';
import { Button } from '../components/ui/button';

type TabType = 'stock' | 'shop' | 'movements' | 'expenses' | 'sales' | 'debtors' | 'dashboard' | 'profile';

export default function Dashboard() {
  const { permissions } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (permissions.can_stock) return 'stock';
    if (permissions.can_movements) return 'movements';
    if (permissions.can_expenses) return 'expenses';
    if (permissions.can_sales) return 'sales';
    if (permissions.can_debtors) return 'debtors';
    if (permissions.can_dashboard) return 'dashboard';
    return 'shop';
  });

  const tabs = [
    { id: 'stock' as TabType, label: 'Stock', show: permissions.can_stock },
    { id: 'shop' as TabType, label: 'Boutique', show: true },
    { id: 'movements' as TabType, label: 'Entrées / Sorties', show: permissions.can_movements },
    { id: 'expenses' as TabType, label: 'Dépenses', show: permissions.can_expenses },
    { id: 'sales' as TabType, label: 'Ventes', show: permissions.can_sales },
    { id: 'debtors' as TabType, label: 'Clients débiteurs', show: permissions.can_debtors },
    { id: 'dashboard' as TabType, label: 'Tableau de bord', show: permissions.can_dashboard },
    { id: 'profile' as TabType, label: 'Profil', show: true },
  ];

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map(
            (tab) =>
              tab.show && (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  className={
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-indigo-500 rounded-full'
                      : 'bg-slate-900/85 text-gray-300 border-slate-700 hover:bg-slate-800 rounded-full'
                  }
                  size="sm"
                >
                  {tab.label}
                </Button>
              )
          )}
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6 min-h-[600px]">
          {activeTab === 'stock' && permissions.can_stock && <StockTab />}
          {activeTab === 'shop' && <ShopTab />}
          {activeTab === 'movements' && permissions.can_movements && <MovementsTab />}
          {activeTab === 'expenses' && permissions.can_expenses && <ExpensesTab />}
          {activeTab === 'sales' && permissions.can_sales && <SalesTab />}
          {activeTab === 'debtors' && permissions.can_debtors && <DebtorsTab />}
          {activeTab === 'dashboard' && permissions.can_dashboard && <DashboardTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </div>
      </div>
    </Layout>
  );
}