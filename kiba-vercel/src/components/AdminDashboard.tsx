import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Order, OperationType } from '../types';
import { Search, Loader2, CheckCircle2, Trash2, Calendar, Phone, Award, Clock, TrendingUp, Sparkles, Eye, ShieldAlert, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  currentUser: any;
  theme: 'dark' | 'light';
}

export default function AdminDashboard({ currentUser, theme }: AdminDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedUtr, setCopiedUtr] = useState(false);

  // 1. Verify and Bootstrap Admin Status
  useEffect(() => {
    if (!currentUser) return;

    const checkAndBootstrapAdmin = async () => {
      // Offline guest developer simulator bypass check
      if (currentUser.uid === 'offline-guest-simulation-id') {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Owner email always gets admin access immediately
      if (currentUser.email === 'kebamimi1@gmail.com') {
        setIsAdmin(true);
        setLoading(false);
        // Best-effort bootstrap into Firestore (non-blocking)
        try {
          const adminDocRef = doc(db, 'admins', currentUser.uid);
          const adminSnap = await getDoc(adminDocRef);
          if (!adminSnap.exists()) {
            await setDoc(adminDocRef, {
              email: currentUser.email,
              createdAt: serverTimestamp(),
            });
          }
        } catch (_) { /* ignore */ }
        return;
      }

      try {
        const adminDocRef = doc(db, 'admins', currentUser.uid);
        const adminSnap = await getDoc(adminDocRef);

        if (adminSnap.exists()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error verifying admin authorization:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAndBootstrapAdmin();
  }, [currentUser]);

  // 2. Fetch Orders Real-time if authorized
  useEffect(() => {
    if (!isAdmin) return;

    // Offline Guest Simulator fallback
    if (currentUser?.uid === 'offline-guest-simulation-id') {
      const loadSimulatedOrders = () => {
        const storedOrders = localStorage.getItem('_offline_orders');
        if (storedOrders) {
          try {
            setOrders(JSON.parse(storedOrders));
          } catch (e) {
            console.error('Failed to parse offline orders, resetting', e);
          }
        } else {
          // Generate realistic default mock orders if none exist
          const defaultMocks = [
            {
              id: "offline-order-1",
              packageName: "💎 1000 + 150 Diamonds Bundle",
              price: "₹ 1,599",
              uid: "84729104",
              serverId: "9283",
              whatsAppNumber: "+91 9845210142",
              paymentUtr: "740201490210",
              status: "pending",
              userEmail: "playerone@gmail.com",
              userId: "offline-guest-simulation-id",
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              updatedAt: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: "offline-order-2",
              packageName: "💎 Weekly Diamonds Pass (Active Premium)",
              price: "₹ 190",
              uid: "39201948",
              serverId: "4019",
              whatsAppNumber: "+91 8839201948",
              paymentUtr: "849201940193",
              status: "completed",
              userEmail: "championslayer@yahoo.com",
              userId: "offline-guest-simulation-id",
              createdAt: new Date(Date.now() - 7200000).toISOString(),
              updatedAt: new Date(Date.now() - 7000000).toISOString(),
            },
            {
              id: "offline-order-3",
              packageName: "💎 5000 + 1000 Diamonds Ultimate Chest",
              price: "₹ 7,999",
              uid: "51029481",
              serverId: "8401",
              whatsAppNumber: "+91 7730192847",
              paymentUtr: "937402948102",
              status: "pending",
              userEmail: "fannygod123@gmail.com",
              userId: "offline-guest-simulation-id",
              createdAt: new Date(Date.now() - 14400000).toISOString(),
              updatedAt: new Date(Date.now() - 14400000).toISOString(),
            }
          ];
          setOrders(defaultMocks);
          localStorage.setItem('_offline_orders', JSON.stringify(defaultMocks));
        }
        setLoading(false);
      };

      loadSimulatedOrders();
      // Listen to localStorage changes in case order is added while admin dashboard is open
      const handleStorageUpdate = (e: StorageEvent) => {
        if (e.key === '_offline_orders') {
          loadSimulatedOrders();
        }
      };
      window.addEventListener('storage', handleStorageUpdate);
      const interval = setInterval(loadSimulatedOrders, 1000); // Quick sync poll for local comfort

      return () => {
        window.removeEventListener('storage', handleStorageUpdate);
        clearInterval(interval);
      };
    }

    const path = 'orders';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orderData: Order[] = [];
        snapshot.forEach((doc) => {
          orderData.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(orderData);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin, currentUser]);

  // 3. Mark order as completed
  const markAsCompleted = async (order: Order) => {
    if (order.status === 'completed') return;

    if (currentUser?.uid === 'offline-guest-simulation-id') {
      const updated = orders.map(o => o.id === order.id ? { ...o, status: 'completed' as const, updatedAt: new Date().toISOString() as any } : o);
      setOrders(updated);
      localStorage.setItem('_offline_orders', JSON.stringify(updated));
      if (selectedOrder?.id === order.id) {
        setSelectedOrder({ ...selectedOrder, status: 'completed' });
      }
      return;
    }

    const path = `orders/${order.id}`;
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, {
        status: 'completed',
        updatedAt: serverTimestamp(),
      });
      if (selectedOrder?.id === order.id) {
        setSelectedOrder({ ...selectedOrder, status: 'completed' });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  // 4. Delete order
  const deleteOrder = async (orderId: string) => {
    const confirmDelete = window.confirm('Are you absolutely sure you want to delete this order record? This cannot be undone.');
    if (!confirmDelete) return;

    if (currentUser?.uid === 'offline-guest-simulation-id') {
      const updated = orders.filter(o => o.id !== orderId);
      setOrders(updated);
      localStorage.setItem('_offline_orders', JSON.stringify(updated));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
      return;
    }

    const path = `orders/${orderId}`;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUtr(true);
      setTimeout(() => setCopiedUtr(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  // Search/Filter computation
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serverId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.paymentUtr && order.paymentUtr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.whatsAppNumber.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  
  const totalRevenue = orders.reduce((acc, order) => {
    const num = parseInt(order.price.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + (order.status === 'completed' ? num : 0);
  }, 0);

  if (loading || bootstrapping) {
    return (
      <div className={`flex flex-col items-center justify-center p-12 text-center border rounded-2xl min-h-[400px] ${
        theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
        <h3 className={`font-display font-medium mb-1 uppercase tracking-wider text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {bootstrapping ? 'BOOTSTRAPPING FIRST ADMIN CREDENTIALS...' : 'LOADING SALES DASHBOARD...'}
        </h3>
        <p className="text-xs text-slate-400">Verifying secure database credentials...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={`p-8 text-center border rounded-2xl ${
        theme === 'dark' ? 'bg-slate-950/80 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'bg-rose-50 border-rose-200 shadow-sm'
      }`}>
        <ShieldAlert className="mx-auto text-rose-500 mb-4" size={48} />
        <h2 className="font-display font-black text-rose-500 text-2xl tracking-tight uppercase mb-2">
          ACCESS RESTRICTED
        </h2>
        <p className={`text-sm max-w-md mx-auto mb-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
          Your credentials do not designate you as an authorized Admin. Only the shop owner can access the order database.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-xl relative overflow-hidden ${
          theme === 'dark' ? 'bg-slate-950/80 border-slate-850' : 'bg-white border-slate-200'
        }`}>
          <Clock className="absolute top-4 right-4 text-slate-450" size={20} />
          <span className="text-[10px] text-slate-400 font-mono block uppercase">PENDING PROCESS</span>
          <span className="text-2xl font-black font-mono text-amber-500">{pendingOrders}</span>
        </div>
        <div className={`p-4 border rounded-xl relative overflow-hidden ${
          theme === 'dark' ? 'bg-slate-950/80 border-slate-850' : 'bg-white border-slate-200'
        }`}>
          <CheckCircle2 className="absolute top-4 right-4 text-slate-450" size={20} />
          <span className="text-[10px] text-slate-400 font-mono block uppercase">COMPLETED CHECKS</span>
          <span className="text-2xl font-black font-mono text-emerald-500">{completedOrders}</span>
        </div>
        <div className={`p-4 border rounded-xl relative overflow-hidden ${
          theme === 'dark' ? 'bg-slate-950/80 border-slate-850' : 'bg-white border-slate-200'
        }`}>
          <Award className="absolute top-4 right-4 text-slate-450" size={20} />
          <span className="text-[10px] text-slate-400 font-mono block uppercase">TOTAL TRANSACTIONS</span>
          <span className="text-2xl font-black font-mono text-sky-500">{totalOrders}</span>
        </div>
        <div className={`p-4 border rounded-xl relative overflow-hidden ${
          theme === 'dark' ? 'bg-slate-950/80 border-slate-850' : 'bg-white border-slate-200'
        }`}>
          <TrendingUp className="absolute top-4 right-4 text-slate-450" size={20} />
          <span className="text-[10px] text-slate-400 font-mono block uppercase">EARNED REVENUE</span>
          <span className="text-2xl font-black font-mono text-emerald-500">₹{totalRevenue}</span>
        </div>
      </div>

      {/* Main Admin Section */}
      <div className={`border rounded-2xl p-6 ${
        theme === 'dark' ? 'bg-slate-950/80 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-amber-500/10">
          <div>
            <h2 className="text-2xl font-black text-amber-500 font-display tracking-tight uppercase flex items-center gap-2">
              <Sparkles size={22} className="text-amber-500 animate-pulse" />
              ORDERS AUDIT MANAGEMENT
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time Top-ups orders bank verification</p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`text-xs px-3.5 py-1.5 rounded-lg border font-bold uppercase transition-all ${
                statusFilter === 'all'
                  ? 'bg-amber-950/50 text-amber-400 border-amber-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`text-xs px-3.5 py-1.5 rounded-lg border font-bold uppercase transition-all ${
                statusFilter === 'pending'
                  ? 'bg-amber-950/50 text-amber-400 border-amber-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`text-xs px-3.5 py-1.5 rounded-lg border font-bold uppercase transition-all ${
                statusFilter === 'completed'
                  ? 'bg-emerald-950/50 text-emerald-405 border-emerald-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-3 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search orders by Player UID, Server ID, Payment UTR code, WhatsApp phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 ${
              theme === 'dark'
                ? 'bg-slate-900 border border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500'
                : 'bg-slate-100 border border-slate-300 text-slate-900 focus:border-amber-600 focus:ring-amber-600'
            }`}
          />
        </div>

        {/* Grid: Order Listings & Details Block */}
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center bg-slate-905/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
              No orders found in real-time Firestore database matching criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-amber-500/10 text-[10px] text-slate-400 uppercase font-mono">
                  <th className="py-3 px-4">Order / Time</th>
                  <th className="py-3 px-4">Top-Up Item</th>
                  <th className="py-3 px-4">MLBB Details</th>
                  <th className="py-3 px-4">Payment UTR Code</th>
                  <th className="py-3 px-4 text-center">Contact</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  const dateObj = order.createdAt?.toDate ? order.createdAt.toDate() : new Date();
                  return (
                    <tr
                      key={order.id}
                      className={`border-b transition-colors cursor-pointer text-xs ${
                        theme === 'dark' 
                          ? isSelected ? 'bg-amber-950/20 border-slate-900' : 'border-slate-900/60 hover:bg-slate-900/30' 
                          : isSelected ? 'bg-amber-50 border-slate-200' : 'border-slate-100 hover:bg-slate-50'
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-4 px-4 font-mono">
                        <span className={`block font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">
                          {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`block font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{order.packageName}</span>
                        <span className="text-amber-500 block font-mono font-bold mt-0.5">{order.price}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-mono block font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          UID: {order.uid}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px] block mt-0.5">
                          Server: {order.serverId}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono">
                        <span className="text-amber-500 font-black tracking-widest block bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-center max-w-[150px]">
                          {order.paymentUtr}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-center">
                        <span className={`block font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          {order.whatsAppNumber}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                            order.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                              : 'bg-amber-950 text-amber-400 border border-amber-900 animate-pulse'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className={`p-1.5 px-2.5 text-[11px] font-bold rounded-lg border transition-all flex items-center gap-1 ${
                              theme === 'dark'
                                ? 'bg-slate-900 border-slate-800 text-sky-400 hover:text-white hover:border-sky-500'
                                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                            }`}
                            title="See details"
                          >
                            <Eye size={12} />
                            View
                          </button>
                          
                          {order.status === 'pending' && (
                            <button
                              onClick={() => markAsCompleted(order)}
                              className="p-1.5 px-2.5 text-[11px] font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg hover:scale-105 transition-all"
                              title="Mark order Completed"
                            >
                              Fulfill
                            </button>
                          )}

                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-1.5 text-slate-450 hover:text-rose-500 rounded-lg transition-colors"
                            title="Delete database record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Selected Order Details Overlay Card */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-3xl border-2 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
                theme === 'dark' ? 'bg-slate-950 border-amber-500/55 text-white' : 'bg-white border-amber-600/30 text-slate-900'
              }`}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-amber-500/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-amber-505/10 text-amber-500 px-2.5 py-1.5 rounded-full border border-amber-500/30 font-bold">
                      ORDER DETAILS REPORT
                    </span>
                    <h3 className={`text-xl font-bold font-display mt-3 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      #{selectedOrder.id.toUpperCase()}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className={`p-1.5 font-bold text-xs px-3 rounded-lg border transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
                        : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Player data */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase font-mono tracking-wider text-amber-500 font-bold">
                      MLBB PLAYER DETAILS
                    </h4>

                    <div className={`p-4 rounded-xl border space-y-2.5 text-xs ${
                      theme === 'dark' ? 'bg-slate-900/40 border-slate-850 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <div className="flex justify-between pb-1 border-b border-amber-500/5">
                        <span className="text-slate-450 uppercase font-mono text-[9px] font-bold">User UID</span>
                        <strong className={`font-mono select-all ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{selectedOrder.uid}</strong>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-amber-500/5">
                        <span className="text-slate-450 uppercase font-mono text-[9px] font-bold">Server ID</span>
                        <strong className={`font-mono select-all ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{selectedOrder.serverId}</strong>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-amber-500/5">
                        <span className="text-slate-450 uppercase font-mono text-[9px] font-bold">Product Package</span>
                        <strong className={`select-all ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{selectedOrder.packageName}</strong>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-amber-500/5">
                        <span className="text-slate-450 uppercase font-mono text-[9px] font-bold">Price</span>
                        <strong className="text-amber-500 font-mono text-sm">{selectedOrder.price}</strong>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-amber-500/5">
                        <span className="text-slate-450 uppercase font-mono text-[9px] font-bold">WhatsApp Phone</span>
                        <strong className="text-sky-505 select-all text-sky-400">{selectedOrder.whatsAppNumber}</strong>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5">
                      {selectedOrder.status === 'pending' ? (
                        <button
                          onClick={() => markAsCompleted(selectedOrder)}
                          className="flex-1 py-3 px-4 rounded-xl font-bold bg-emerald-500 text-slate-950 text-center text-xs hover:bg-emerald-600 font-display uppercase tracking-wider transition-all"
                        >
                          Mark Flipped Completed
                        </button>
                      ) : (
                        <div className="flex-1 text-center py-3 bg-emerald-950/20 text-emerald-450 border border-emerald-900 rounded-xl font-bold text-xs uppercase font-mono">
                          ✓ TOP-UP DONE
                        </div>
                      )}

                      <a
                        href={`https://wa.me/${selectedOrder.whatsAppNumber.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className={`py-3 px-4 rounded-xl font-bold text-center text-xs font-display uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border ${
                          theme === 'dark'
                            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                            : 'bg-slate-100 border-slate-350 text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        WhatsApp Chat
                      </a>
                    </div>
                  </div>

                  {/* Right Column: UTR and Security info */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs uppercase font-mono tracking-wider text-amber-500 font-bold mb-3">
                        UPI BANKING AUTH UTR
                      </h4>

                      <div className={`p-5 rounded-2xl border text-center relative ${
                        theme === 'dark' ? 'bg-slate-900/60 border-amber-500/20' : 'bg-amber-50/50 border-amber-500/20'
                      }`}>
                        <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                          12-DIGIT TRANSACTION UTR CODE
                        </span>
                        
                        <div className="flex items-center justify-center gap-2.5 my-3">
                          <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-amber-500 select-all">
                            {selectedOrder.paymentUtr}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(selectedOrder.paymentUtr)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              theme === 'dark' ? 'hover:bg-slate-800 border-slate-700' : 'hover:bg-slate-100 border-slate-300'
                            }`}
                            title="Copy UTR to Clipboard"
                          >
                            {copiedUtr ? (
                              <Check size={14} className="text-emerald-500" />
                            ) : (
                              <Copy size={14} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} />
                            )}
                          </button>
                        </div>

                        <span className="text-[10px] text-slate-500 leading-normal block mt-1">
                          Open your banking console (G Pay, PhonePe, Paytm, etc) & search for this code to verify the receipt.
                        </span>
                      </div>
                    </div>

                    {/* Security credentials notification */}
                    <div className={`p-4 rounded-xl border border-dashed flex gap-3 text-xs ${
                      theme === 'dark' ? 'bg-slate-900/30 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>
                      <span className="text-lg">🔒</span>
                      <div className="leading-relaxed">
                        <span className="font-bold text-amber-500 block uppercase font-mono text-[10px]">Security Lock Active</span>
                        The Moonton email & password are not stored in any table of Firebase. They were processed strictly in local client-side memory to formulate the WhatsApp click-to-chat message text.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
