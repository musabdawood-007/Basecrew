"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Business = {
  _id: string;
  ownerId: string;
  name: string;
  category: string;
  description: string;
  currency: string;
  createdAt: string;
};

export type Product = {
  _id: string;
  businessId: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number | null;
  sku: string | null;
  isService: boolean;
  createdAt: string;
};

export type Customer = {
  _id: string;
  businessId: string;
  name: string;
  contact: string;
  notes: string;
  createdAt: string;
};

export type Order = {
  _id: string;
  businessId: string;
  customerId: string;
  items: { productId: string; quantity: number; priceAtSale: number }[];
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
};

export type Expense = {
  _id: string;
  businessId: string;
  category: string;
  amount: number;
  note: string;
  date: string;
  createdAt: string;
};

type BusinessContextType = {
  businesses: Business[];
  currentBusiness: Business | null;
  setCurrentBusiness: (b: Business) => void;
  products: Product[];
  customers: Customer[];
  orders: Order[];
  expenses: Expense[];
  loading: boolean;
  addBusiness: (name: string, category: string) => Promise<boolean>;
  addProduct: (p: Omit<Product, "_id" | "createdAt">) => Promise<boolean>;
  addCustomer: (c: Omit<Customer, "_id" | "createdAt">) => Promise<boolean>;
  addOrder: (o: Omit<Order, "_id" | "createdAt">) => Promise<boolean>;
  addExpense: (e: Omit<Expense, "_id" | "createdAt">) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  deleteCustomer: (id: string) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
};

const BusinessContext = createContext<BusinessContextType | null>(null);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = useCallback(async () => {
    try {
      const res = await fetch("/api/businesses");
      if (res.ok) {
        const data = await res.json();
        setBusinesses(data);
        if (data.length > 0 && !currentBusiness) {
          setCurrentBusiness(data[0]);
        }
        return data;
      }
    } catch {}
    return [];
  }, []);

  const fetchProducts = useCallback(async (bizId: string) => {
    try {
      const res = await fetch(`/api/products?businessId=${bizId}`);
      if (res.ok) setProducts(await res.json());
    } catch {}
  }, []);

  const fetchCustomers = useCallback(async (bizId: string) => {
    try {
      const res = await fetch(`/api/customers?businessId=${bizId}`);
      if (res.ok) setCustomers(await res.json());
    } catch {}
  }, []);

  const fetchOrders = useCallback(async (bizId: string) => {
    try {
      const res = await fetch(`/api/orders?businessId=${bizId}`);
      if (res.ok) setOrders(await res.json());
    } catch {}
  }, []);

  const fetchExpenses = useCallback(async (bizId: string) => {
    try {
      const res = await fetch(`/api/expenses?businessId=${bizId}`);
      if (res.ok) setExpenses(await res.json());
    } catch {}
  }, []);

  const fetchAll = useCallback(async (bizId: string) => {
    await Promise.all([
      fetchProducts(bizId),
      fetchCustomers(bizId),
      fetchOrders(bizId),
      fetchExpenses(bizId),
    ]);
  }, [fetchProducts, fetchCustomers, fetchOrders, fetchExpenses]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const biz = await fetchBusinesses();
      if (biz.length > 0) {
        await fetchAll(biz[0]._id);
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (currentBusiness) {
      fetchAll(currentBusiness._id);
    }
  }, [currentBusiness, fetchAll]);

  const addBusiness = async (name: string, category: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, description: "" }),
      });
      if (res.ok) {
        const newBiz = await res.json();
        setBusinesses((prev) => [...prev, newBiz]);
        setCurrentBusiness(newBiz);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addProduct = async (p: Omit<Product, "_id" | "createdAt">): Promise<boolean> => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (res.ok) {
        const newP = await res.json();
        setProducts((prev) => [newP, ...prev]);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addCustomer = async (c: Omit<Customer, "_id" | "createdAt">): Promise<boolean> => {
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      if (res.ok) {
        const newC = await res.json();
        setCustomers((prev) => [newC, ...prev]);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addOrder = async (o: Omit<Order, "_id" | "createdAt">): Promise<boolean> => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(o),
      });
      if (res.ok) {
        const newO = await res.json();
        setOrders((prev) => [newO, ...prev]);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addExpense = async (e: Omit<Expense, "_id" | "createdAt">): Promise<boolean> => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
      });
      if (res.ok) {
        const newE = await res.json();
        setExpenses((prev) => [newE, ...prev]);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteCustomer = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/customers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c._id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteOrder = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setExpenses((prev) => prev.filter((e) => e._id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const refreshData = async () => {
    if (currentBusiness) {
      await fetchAll(currentBusiness._id);
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        currentBusiness,
        setCurrentBusiness,
        products,
        customers,
        orders,
        expenses,
        loading,
        addBusiness,
        addProduct,
        addCustomer,
        addOrder,
        addExpense,
        deleteProduct,
        deleteCustomer,
        deleteOrder,
        deleteExpense,
        refreshData,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within BusinessProvider");
  return ctx;
}
