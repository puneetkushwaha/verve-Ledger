"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  Download, 
  Upload, 
  Search, 
  Edit, 
  Trash2, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    sku: "",
    barcode: "",
    hsnCode: "",
    gstRate: "18",
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
      toast.error("Failed to load inventory");
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
        toast.success("Product added!");
        setIsAddOpen(false);
        fetchProducts();
        setNewProduct({ name: "", price: "", stock: "", sku: "", barcode: "", hsnCode: "", gstRate: "18" });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add product");
      }
    } catch (error) {
      toast.error("Error adding product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(products);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "Inventory_Report.xlsx");
    toast.success("Excel exported!");
  };

  const handleImport = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (evt: any) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      // Logic to send bulk data to API
      toast.info(`Found ${data.length} items. Bulk upload starting...`);
      // API call placeholder
    };
    reader.readAsBinaryString(file);
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center bg-[#02010a]"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black font-outfit text-white tracking-tighter uppercase">Inventory Matrix</h2>
          <p className="text-slate-500 mt-2 font-medium">Synchronizing stock levels with the global retail grid.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={exportToExcel} className="h-12 px-6 border-white/5 bg-white/5 text-white hover:bg-white/10 rounded-xl font-black uppercase tracking-widest text-[11px]">
            <Download className="w-4 h-4 mr-2" /> Data Export
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" className="h-12 px-6 border-white/5 bg-white/5 text-white hover:bg-white/10 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
              <Upload className="w-4 h-4" /> Import Node
            </Button>
            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleImport} />
          </label>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger render={
              <Button className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all">
                <Plus className="w-4 h-4 mr-2" /> Add Entity
              </Button>
            } />
            <DialogContent className="glass-dark border-white/10 text-white max-w-md rounded-[2.5rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black font-outfit uppercase">New Entity Creation</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-6 py-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Identity Name</label>
                    <Input 
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-indigo-500/50"
                      placeholder="e.g. Wireless Matrix Mouse" 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Unit Price (₹)</label>
                    <Input 
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-indigo-500/50"
                      type="number" 
                      placeholder="0.00" 
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Stock Units</label>
                    <Input 
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-indigo-500/50"
                      type="number" 
                      placeholder="0" 
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Laser Barcode</label>
                    <Input 
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-indigo-500/50"
                      placeholder="Scanner Code" 
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">HSN Protocol</label>
                    <Input 
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-indigo-500/50"
                      placeholder="8-digit code" 
                      value={newProduct.hsnCode}
                      onChange={(e) => setNewProduct({...newProduct, hsnCode: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full h-14 bg-white text-black hover:bg-slate-200 rounded-xl font-black uppercase tracking-widest transition-all" disabled={submitting}>
                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Deploy Entity"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="glass-dark border-white/5 rounded-[3rem] shadow-2xl overflow-hidden">
        <CardHeader className="p-10 pb-0">
          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
            <Input 
              placeholder="Search Matrix by name, SKU or barcode..." 
              className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-0 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-10">
          <Table>
            <TableHeader className="bg-white/5 border-b border-white/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="pl-10 h-16 font-black uppercase tracking-widest text-[10px] text-indigo-400">Entity</TableHead>
                <TableHead className="h-16 font-black uppercase tracking-widest text-[10px] text-indigo-400">Valuation</TableHead>
                <TableHead className="h-16 font-black uppercase tracking-widest text-[10px] text-indigo-400">Stock Level</TableHead>
                <TableHead className="h-16 font-black uppercase tracking-widest text-[10px] text-indigo-400">Barcode</TableHead>
                <TableHead className="h-16 font-black uppercase tracking-widest text-[10px] text-indigo-400">HSN Code</TableHead>
                <TableHead className="pr-10 h-16 text-right font-black uppercase tracking-widest text-[10px] text-indigo-400">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
                <TableRow key={product.id} className="group hover:bg-white/5 transition-all border-b border-white/5">
                  <TableCell className="pl-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:border-indigo-500/50 transition-all">
                        <Package className="w-6 h-6" />
                      </div>
                      <span className="font-black font-outfit text-white uppercase tracking-tight text-lg">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-slate-300">₹{product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-4 py-1.5 rounded-lg font-black text-xs uppercase tracking-widest",
                        product.stock < 10 ? "bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]" : "bg-emerald-500/10 text-emerald-400"
                      )}>
                        {product.stock} Units
                      </span>
                      {product.stock < 10 && <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 font-black uppercase tracking-widest text-[10px]">{product.barcode || "N/A"}</TableCell>
                  <TableCell className="text-slate-500 font-black uppercase tracking-widest text-[10px]">{product.hsnCode || "N/A"}</TableCell>
                  <TableCell className="pr-10 text-right">
                    <div className="flex justify-end gap-4">
                      <Button variant="ghost" size="icon" className="h-11 w-11 bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 rounded-xl transition-all">
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="h-11 w-11 bg-white/5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-24 text-slate-600 font-black uppercase tracking-[0.4em] text-xs">
                    Null Set: No entities detected in current matrix.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
