import { useState, useEffect } from 'react';
import { getDatabase, saveDatabase } from '@/lib/db';
import { Product, Movement, Expense, Sale, Debtor } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    try {
      const db = getDatabase();
      const result = db.exec(`
        SELECT p.*, u.email AS creator_email
        FROM products p
        LEFT JOIN users u ON u.id = p.created_by
        ORDER BY p.name
      `);

      if (result.length > 0) {
        const data = result[0].values.map((row) => ({
          id: row[0] as number,
          code: row[1] as string,
          name: row[2] as string,
          category: row[3] as string,
          initial_stock: row[4] as number,
          min_stock: row[5] as number,
          unit_price: row[6] as number,
          purchase_price: row[7] as number,
          reseller_price: row[8] as number,
          image_path: row[9] as string,
          created_by: row[10] as number,
          creator_email: row[11] as string,
        }));
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = (product: Omit<Product, 'id'>) => {
    try {
      const db = getDatabase();
      db.run(
        `INSERT INTO products (code, name, category, initial_stock, min_stock, unit_price, purchase_price, reseller_price, image_path, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.code,
          product.name,
          product.category,
          product.initial_stock,
          product.min_stock,
          product.unit_price,
          product.purchase_price,
          product.reseller_price,
          product.image_path,
          product.created_by,
        ]
      );
      saveDatabase();
      loadProducts();
      return true;
    } catch (error) {
      console.error('Failed to add product:', error);
      return false;
    }
  };

  const updateProduct = (id: number, product: Partial<Product>) => {
    try {
      const db = getDatabase();
      db.run(
        `UPDATE products SET code=?, name=?, category=?, initial_stock=?, min_stock=?, 
         unit_price=?, purchase_price=?, reseller_price=?, image_path=? WHERE id=?`,
        [
          product.code,
          product.name,
          product.category,
          product.initial_stock,
          product.min_stock,
          product.unit_price,
          product.purchase_price,
          product.reseller_price,
          product.image_path,
          id,
        ]
      );
      saveDatabase();
      loadProducts();
      return true;
    } catch (error) {
      console.error('Failed to update product:', error);
      return false;
    }
  };

  const deleteProduct = (id: number) => {
    try {
      const db = getDatabase();
      db.run('DELETE FROM products WHERE id = ?', [id]);
      saveDatabase();
      loadProducts();
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  };

  return { products, loading, addProduct, updateProduct, deleteProduct, reload: loadProducts };
}

export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMovements = () => {
    try {
      const db = getDatabase();
      const result = db.exec(`
        SELECT m.*, p.code AS product_code, p.name AS product_name, u.email AS creator_email
        FROM movements m
        JOIN products p ON p.id = m.product_id
        LEFT JOIN users u ON u.id = m.created_by
        ORDER BY m.date DESC, m.id DESC
      `);

      if (result.length > 0) {
        const data = result[0].values.map((row) => ({
          id: row[0] as number,
          date: row[1] as string,
          type: row[2] as 'ENTREE' | 'SORTIE',
          product_id: row[3] as number,
          quantity: row[4] as number,
          unit_price: row[5] as number | null,
          client_name: row[6] as string,
          client_phone: row[7] as string,
          comment: row[8] as string,
          created_by: row[9] as number,
          product_code: row[10] as string,
          product_name: row[11] as string,
          creator_email: row[12] as string,
        }));
        setMovements(data);
      } else {
        setMovements([]);
      }
    } catch (error) {
      console.error('Failed to load movements:', error);
      setMovements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const addMovement = (movement: Omit<Movement, 'id' | 'product_code' | 'product_name' | 'creator_email'>) => {
    try {
      const db = getDatabase();
      db.run(
        `INSERT INTO movements (date, type, product_id, quantity, unit_price, client_name, client_phone, comment, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          movement.date,
          movement.type,
          movement.product_id,
          movement.quantity,
          movement.unit_price,
          movement.client_name,
          movement.client_phone,
          movement.comment,
          movement.created_by,
        ]
      );
      saveDatabase();
      loadMovements();
      return true;
    } catch (error) {
      console.error('Failed to add movement:', error);
      return false;
    }
  };

  return { movements, loading, addMovement, reload: loadMovements };
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExpenses = () => {
    try {
      const db = getDatabase();
      const result = db.exec(`
        SELECT e.*, u.email AS creator_email
        FROM expenses e
        LEFT JOIN users u ON u.id = e.created_by
        ORDER BY e.date DESC, e.id DESC
      `);

      if (result.length > 0) {
        const data = result[0].values.map((row) => ({
          id: row[0] as number,
          date: row[1] as string,
          description: row[2] as string,
          amount: row[3] as number,
          payment_mode: row[4] as string,
          category: row[5] as string,
          comment: row[6] as string,
          created_by: row[7] as number,
          creator_email: row[8] as string,
        }));
        setExpenses(data);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error('Failed to load expenses:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const addExpense = (expense: Omit<Expense, 'id' | 'creator_email'>) => {
    try {
      const db = getDatabase();
      db.run(
        `INSERT INTO expenses (date, description, amount, payment_mode, category, comment, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          expense.date,
          expense.description,
          expense.amount,
          expense.payment_mode,
          expense.category,
          expense.comment,
          expense.created_by,
        ]
      );
      saveDatabase();
      loadExpenses();
      return true;
    } catch (error) {
      console.error('Failed to add expense:', error);
      return false;
    }
  };

  return { expenses, loading, addExpense, reload: loadExpenses };
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSales = () => {
    try {
      const db = getDatabase();
      const result = db.exec(`
        SELECT s.*, p.code AS product_code, p.name AS product_name, u.email AS creator_email
        FROM sales s
        JOIN products p ON p.id = s.product_id
        LEFT JOIN users u ON u.id = s.created_by
        ORDER BY s.date DESC, s.id DESC
      `);

      if (result.length > 0) {
        const data = result[0].values.map((row) => ({
          id: row[0] as number,
          date: row[1] as string,
          product_id: row[2] as number,
          quantity: row[3] as number,
          unit_price: row[4] as number,
          total: row[5] as number,
          payment_mode: row[6] as string,
          client_name: row[7] as string,
          client_phone: row[8] as string,
          paid_amount: row[9] as number,
          balance: row[10] as number,
          comment: row[11] as string,
          created_by: row[12] as number,
          product_code: row[13] as string,
          product_name: row[14] as string,
          creator_email: row[15] as string,
        }));
        setSales(data);
      } else {
        setSales([]);
      }
    } catch (error) {
      console.error('Failed to load sales:', error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const addSale = (sale: Omit<Sale, 'id' | 'product_code' | 'product_name' | 'creator_email'>) => {
    try {
      const db = getDatabase();
      db.run(
        `INSERT INTO sales (date, product_id, quantity, unit_price, total, payment_mode, client_name, client_phone, paid_amount, balance, comment, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sale.date,
          sale.product_id,
          sale.quantity,
          sale.unit_price,
          sale.total,
          sale.payment_mode,
          sale.client_name,
          sale.client_phone,
          sale.paid_amount,
          sale.balance,
          sale.comment,
          sale.created_by,
        ]
      );

      db.run(
        `INSERT INTO movements (date, type, product_id, quantity, unit_price, client_name, client_phone, comment, created_by)
         VALUES (?, 'SORTIE', ?, ?, ?, ?, ?, ?, ?)`,
        [
          sale.date,
          sale.product_id,
          sale.quantity,
          sale.unit_price,
          sale.client_name,
          sale.client_phone,
          sale.comment,
          sale.created_by,
        ]
      );

      saveDatabase();
      loadSales();
      return true;
    } catch (error) {
      console.error('Failed to add sale:', error);
      return false;
    }
  };

  return { sales, loading, addSale, reload: loadSales };
}

export function useDebtors() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const db = getDatabase();
      const result = db.exec(`
        SELECT
          COALESCE(client_name, 'Client inconnu') AS client_name,
          COALESCE(client_phone, '') AS client_phone,
          MIN(date) AS first_date,
          MAX(date) AS last_date,
          SUM(total) AS total_due,
          SUM(balance) AS total_balance,
          COUNT(*) AS n_sales
        FROM sales
        WHERE balance > 0
        GROUP BY client_name, client_phone
        ORDER BY total_balance DESC
      `);

      if (result.length > 0) {
        const data = result[0].values.map((row) => ({
          client_name: row[0] as string,
          client_phone: row[1] as string,
          first_date: row[2] as string,
          last_date: row[3] as string,
          total_due: row[4] as number,
          total_balance: row[5] as number,
          n_sales: row[6] as number,
        }));
        setDebtors(data);
      } else {
        setDebtors([]);
      }
    } catch (error) {
      console.error('Failed to load debtors:', error);
      setDebtors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { debtors, loading };
}

export function useStockCalculation(products: Product[], movements: Movement[]) {
  const stockByProduct: Record<number, number> = {};

  products.forEach((p) => {
    stockByProduct[p.id] = p.initial_stock;
  });

  movements.forEach((m) => {
    if (stockByProduct[m.product_id] !== undefined) {
      if (m.type === 'ENTREE') {
        stockByProduct[m.product_id] += m.quantity;
      } else {
        stockByProduct[m.product_id] -= m.quantity;
      }
    }
  });

  return stockByProduct;
}