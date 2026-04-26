import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function PublicInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true }
      },
      shop: {
        include: { settings: true }
      }
    }
  });

  if (!invoice) return notFound();

  // Handle case where settings might be missing
  const settings = invoice.shop?.settings && invoice.shop.settings.length > 0 
    ? invoice.shop.settings[0] 
    : null;
    
  const themeColor = settings?.themeColor || "#8BC34A";

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto border-8 p-6 md:p-12 relative min-h-[80vh]" style={{ borderColor: themeColor }}>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2 text-black">Invoice</h1>
            <div className="text-[10px] font-bold text-slate-600 tracking-[0.3em] uppercase flex gap-4">
              <span>NO. <span className="text-black ml-2">{invoice.invoiceNumber}</span></span>
              <span>DATE <span className="text-black ml-2">{new Date(invoice.createdAt).toLocaleDateString()}</span></span>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black uppercase mb-1 text-black">{invoice.shop.name}</h2>
            <p className="text-xs text-slate-700 font-medium max-w-[250px] ml-auto leading-relaxed">{invoice.shop.address}</p>
            {settings?.gstin && <p className="text-[10px] font-bold mt-2 uppercase tracking-widest text-slate-600">GSTIN: <span className="text-black">{settings.gstin}</span></p>}
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-12">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: themeColor }} className="text-white text-left text-[11px] font-black uppercase tracking-widest">
                <th className="p-4 rounded-tl-xl">Description</th>
                <th className="p-4 text-center">Price</th>
                <th className="p-4 text-center">Qty</th>
                <th className="p-4 text-right rounded-tr-xl">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.items.map((item) => (
                <tr key={item.id} className="text-sm">
                  <td className="p-5 font-bold uppercase tracking-tight text-black">{item.product.name}</td>
                  <td className="p-5 text-center text-slate-700">₹{item.price.toFixed(2)}</td>
                  <td className="p-5 text-center font-bold text-black">{item.quantity}</td>
                  <td className="p-5 text-right font-black text-black">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mt-auto">
          <div className="flex-1">
             <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 border-b border-slate-200 pb-2">Payment Details</h4>
                <div className="space-y-2 text-[11px]">
                  <p className="flex justify-between font-bold text-slate-700"><span>Mode</span> <span className="text-blue-600 uppercase">{invoice.paymentMode}</span></p>
                  <p className="flex justify-between font-bold text-slate-700"><span>Status</span> <span className="text-emerald-600 uppercase">Paid</span></p>
                  {settings?.upiId && <p className="flex justify-between font-bold text-slate-700"><span>UPI ID</span> <span className="text-black">{settings.upiId}</span></p>}
                </div>
             </div>
             <div className="mt-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3">Terms & Conditions</h4>
                <p className="text-[9px] text-slate-600 font-medium leading-relaxed max-w-[400px]">
                  {settings?.terms || "Goods once sold will not be taken back. This is a computer generated invoice."}
                </p>
             </div>
          </div>

          <div className="w-full md:w-[350px]">
            <div className="rounded-[32px] p-10 text-white shadow-2xl transition-all duration-500" style={{ backgroundColor: themeColor }}>
              <div className="space-y-3 mb-6 border-b border-white/20 pb-6">
                <div className="flex justify-between text-[11px] font-black uppercase opacity-80"><span>Subtotal</span> <span>₹{(invoice.totalAmount + invoice.discount - invoice.taxAmount).toFixed(2)}</span></div>
                <div className="flex justify-between text-[11px] font-black uppercase opacity-80"><span>GST</span> <span>₹{invoice.taxAmount.toFixed(2)}</span></div>
                <div className="flex justify-between text-[11px] font-black uppercase text-rose-200"><span>Discount</span> <span>-₹{invoice.discount.toFixed(2)}</span></div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">Total Amount</span>
                <span className="text-4xl font-black tracking-tighter text-white">₹{invoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Thank you for shopping with {invoice.shop.name}</p>
        </div>

      </div>
    </div>
  );
}
