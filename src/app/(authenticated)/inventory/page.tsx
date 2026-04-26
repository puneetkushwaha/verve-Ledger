"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Download, 
  Upload,
  AlertCircle,
  FileSpreadsheet,
  X,
  Check,
  Zap,
  ArrowRight,
  TrendingUp,
  Box,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import * as XLSX from 'xlsx';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    sku: "",
    barcode: "",
    hsnCode: "",
    gstRate: "18",
    category: "General"
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (error) {
      toast.error("Failed to load inventory matrix");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          gstRate: parseFloat(newProduct.gstRate),
        }),
      });

      if (res.ok) {
        toast.success("New product node initialized");
        setIsAddOpen(false);
        fetchProducts();
        setNewProduct({ name: "", price: "", stock: "", sku: "", barcode: "", hsnCode: "", gstRate: "18", category: "General" });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add product node");
      }
    } catch (error) {
      toast.error("Matrix connection error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        toast.success("Product node updated successfully");
        setIsEditOpen(false);
        fetchProducts();
      } else {
        toast.error("Failed to sync updates");
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Terminate this product node?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product node terminated");
        fetchProducts();
      }
    } catch (error) {
      toast.error("Termination failed");
    }
  };

  const exportToExcel = () => {
    const dataToExport = products.map(p => ({
      Name: p.name,
      Price: p.price,
      Stock: p.stock,
      Barcode: p.barcode || 'N/A',
      HSN: p.hsnCode || 'N/A',
      GST: p.gstRate,
      Category: p.category
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, `Stock_Matrix_${new Date().toLocaleDateString()}.xlsx`);
    toast.success("Excel ledger generated!");
  };

  const handleImport = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (evt: any) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);
        
        toast.info(`Injecting ${data.length} product nodes...`);
        
        for (const item of data) {
          await fetch("/api/products/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: item.Name || item.name,
              price: parseFloat(item.Price || item.price || 0),
              stock: parseInt(item.Stock || item.stock || 0),
              barcode: item.Barcode || item.barcode || "",
              hsnCode: item.HSN || item.hsnCode || "",
              gstRate: parseFloat(item.GST || item.gstRate || 18),
              category: item.Category || item.category || "General"
            }),
          });
        }
        
        toast.success("Bulk injection completed!");
        fetchProducts();
      } catch (err) {
        toast.error("Failed to parse data matrix");
      }
    };
    reader.readAsBinaryString(file);
  };

  if (loading) {
    return (
      <div className="space-y-16 animate-pulse max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="space-y-4">
            <Skeleton className="h-16 w-96 rounded-3xl" />
            <Skeleton className="h-4 w-[600px] opacity-20" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-16 w-48 rounded-[2rem]" />
            <Skeleton className="h-16 w-48 rounded-[2rem]" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-[3rem]" />
          ))}
        </div>
      </div>
    );
  }

  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-16 pb-40 max-w-7xl mx-auto px-4">
      {/* Balanced Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00CF64]/10 rounded-xl flex items-center justify-center border border-[#00CF64]/20 shadow-xl">
                <Package className="w-5 h-5 text-[#00CF64]" />
            </div>
            <h1 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter">Inventory</h1>
          </div>
          <div className="flex items-center gap-4 ml-14">
              <p className="text-slate-500 font-bold uppercase text-[8px] tracking-[0.4em]">Resource Ledger</p>
              {lowStockCount > 0 && (
                  <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-[9px] font-black uppercase text-rose-500 tracking-widest">{lowStockCount} Alerts</span>
                  </div>
              )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={exportToExcel} className="h-11 px-6 border-white/5 bg-white/5 text-white hover:bg-white/10 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all">
            <Download className="w-3.5 h-3.5 mr-2" /> Export
          </Button>
          
          <div className="relative">
            <input type="file" id="import-excel" className="hidden" accept=".xlsx, .xls" onChange={handleImport} />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('import-excel')?.click()}
              className="h-11 px-6 border-white/5 bg-white/5 text-white hover:bg-white/10 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all"
            >
              <Upload className="w-3.5 h-3.5 mr-2" /> Bulk Sync
            </Button>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger
              render={
                <Button className="h-10 px-6 bg-[#00CF64] hover:bg-[#10B981] text-white rounded-xl font-black uppercase tracking-widest text-[8px] shadow-xl transition-all hover:scale-105 active:scale-95 flex gap-2">
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </Button>
              }
            />
            <DialogContent className="bg-[#050505] border-white/10 text-white max-w-lg rounded-[3rem] p-0 overflow-hidden shadow-3xl">
              <div className="bg-gradient-to-r from-[#00CF64]/20 to-transparent p-10 border-b border-white/5">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tighter">Add Product</DialogTitle>
                  <DialogDescription className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-2">Initialize a new product entry</DialogDescription>
                </DialogHeader>
              </div>

              <form onSubmit={handleAddProduct} className="p-10 space-y-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Resource Designation</label>
                    <input 
                      className="premium-input w-full"
                      placeholder="e.g. Quantum Processor" 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Unit Value (₹)</label>
                    <input 
                      className="premium-input w-full"
                      type="number" 
                      placeholder="0.00" 
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Total Stock</label>
                    <input 
                      className="premium-input w-full"
                      type="number" 
                      placeholder="0" 
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <Button disabled={submitting} type="submit" className="w-full h-20 bg-white text-black hover:bg-slate-100 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all hover:scale-[1.01]">
                  {submitting ? "Processing..." : "Commit Node"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Stock Table */}
      <div className="space-y-8">
        <div className="relative group max-w-2xl px-4">
            <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-600 group-focus-within:text-[#00CF64] transition-all" />
            <input 
              placeholder="Filter by Resource Identity..." 
              className="w-full h-20 bg-[#050505] border border-white/5 rounded-[2.5rem] pl-24 pr-10 text-white placeholder:text-slate-700 font-outfit text-2xl focus:border-[#00CF64]/30 transition-all shadow-3xl outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
        </div>

        <div className="space-y-4">
          {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
            <div key={product.id} className="premium-card group relative hover:translate-x-2">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00CF64] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-10 flex-1">
                        <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-slate-700 group-hover:text-[#00CF64] group-hover:border-[#00CF64]/40 transition-all shadow-3xl relative overflow-hidden">
                            <Box className="w-10 h-10 relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00CF64]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">Resource Unit</span>
                            <h3 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter mt-1 group-hover:text-[#00CF64] transition-colors">{product.name}</h3>
                            <div className="flex items-center gap-6 mt-3">
                                <div className="flex items-center gap-2">
                                    <Layers className="w-3.5 h-3.5 text-slate-700" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{product.category || "General Core"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-3.5 h-3.5 text-slate-700" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HSN: {product.hsnCode || "UNSET"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-16 w-full lg:w-auto justify-between lg:justify-end">
                        <div className="text-right">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">Asset Value</span>
                            <p className="text-3xl font-black text-white font-outfit tracking-tighter mt-1">₹{product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                        </div>

                        <div className="text-right min-w-[120px]">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">Stock Count</span>
                            <div className="flex items-center justify-end gap-3 mt-1">
                                <p className="text-2xl font-black text-white font-outfit tracking-tighter">{product.stock}</p>
                                <div className={cn(
                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                    product.stock < 10 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-[#00CF64]"
                                )}>
                                    {product.stock < 10 ? "Critical" : "Nominal"}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button 
                                onClick={() => { setEditingProduct(product); setIsEditOpen(true); }}
                                className="h-14 w-14 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                                <Edit className="w-6 h-6" />
                            </Button>
                            <Button 
                                onClick={() => handleDelete(product.id)}
                                className="h-14 w-14 bg-rose-500/5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-2xl transition-all border border-rose-500/10">
                                <Trash2 className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="py-48 flex flex-col items-center justify-center text-slate-800 bg-[#050505] rounded-[4rem] border border-white/5 shadow-3xl group">
                <Box className="w-24 h-24 mb-8 opacity-5 group-hover:opacity-20 transition-all duration-700 -rotate-12" />
                <p className="font-black uppercase tracking-[0.6em] text-[12px]">Inventory Offline</p>
                <p className="text-[9px] font-bold text-slate-600 uppercase mt-4 tracking-widest opacity-50">No products were found in the current sector</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal Overhaul */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-white max-w-lg rounded-[3rem] p-0 overflow-hidden shadow-3xl">
          <div className="bg-gradient-to-r from-blue-500/20 to-transparent p-10 border-b border-white/5">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tighter">Sync Updates</DialogTitle>
              <DialogDescription className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-2">Modify product parameters</DialogDescription>
            </DialogHeader>
          </div>

          {editingProduct && (
            <form onSubmit={handleUpdateProduct} className="p-10 space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Resource Designation</label>
                  <input 
                    className="premium-input w-full"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Unit Value (₹)</label>
                  <input 
                    className="premium-input w-full"
                    type="number" 
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    required 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Total Stock</label>
                  <input 
                    className="premium-input w-full"
                    type="number" 
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                    required 
                  />
                </div>
              </div>
              <Button disabled={submitting} type="submit" className="w-full h-20 bg-white text-black hover:bg-slate-100 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all hover:scale-[1.01]">
                {submitting ? "Synchronizing..." : "Apply Sync"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Floating Insight Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none">
          <div className="glass-dark rounded-[3rem] p-6 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] pointer-events-auto flex items-center justify-between px-10">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#00CF64]/10 rounded-xl flex items-center justify-center text-[#00CF64]"><TrendingUp className="w-5 h-5" /></div>
                  <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Inventory Value</p>
                      <p className="text-xl font-black text-white font-outfit tracking-tighter">₹{products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
              </div>
              <div className="flex items-center gap-10">
                  <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Product List</p>
                      <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest mt-1">Verified stock levels</p>
                  </div>
                  <div className="text-right border-l border-white/10 pl-10">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">System Health</p>
                      <p className="text-xl font-black text-[#00CF64] font-outfit tracking-tighter">NOMINAL</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
