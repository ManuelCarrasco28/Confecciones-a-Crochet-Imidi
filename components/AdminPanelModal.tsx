'use client';

import React, { useState } from 'react';
import { X, Trash2, Edit, ShieldCheck } from 'lucide-react';
import { Product, CategoryType, COLOR_OPTIONS } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export function AdminPanelModal({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: AdminPanelModalProps) {
  // Regla de Hooks de React: Declarar Hooks SIEMPRE en la parte superior antes de retornos condicionales
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'blusas',
    price: 50.00,
    description: '',
    details: ['Tejido a mano'],
    colors: COLOR_OPTIONS,
    sizes: ['S', 'M', 'L'],
    imageUrl: '/productos/466976345_1108162234357955_8056609349265798658_n.jpg',
    inStock: true,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingId) {
      onUpdateProduct({
        ...formData,
        id: editingId,
      } as Product);
    } else {
      onAddProduct({
        ...formData,
        id: Date.now().toString(),
      } as Product);
    }

    setEditingId(null);
    setFormData({
      name: '',
      category: 'blusas',
      price: 50.00,
      description: '',
      details: ['Tejido a mano'],
      colors: COLOR_OPTIONS,
      sizes: ['S', 'M', 'L'],
      imageUrl: '/productos/466976345_1108162234357955_8056609349265798658_n.jpg',
      inStock: true,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-stone-900 border border-stone-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-stone-800">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <h2 className="font-serif text-xl font-bold text-white">Panel Modal Rápido de Administración</h2>
            <p className="text-xs text-stone-400">Gestión simplificada de productos en memoria</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 bg-stone-950 p-5 rounded-2xl border border-stone-800">
            <h3 className="font-bold text-sm text-white mb-4">
              {editingId ? 'Editar Producto' : 'Crear Producto'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Categoría</label>
                  <select
                    value={formData.category || 'blusas'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-2.5 py-2 text-white capitalize font-semibold"
                  >
                    <option value="blusas">Blusas</option>
                    <option value="vestidos">Vestidos</option>
                    <option value="tapetes">Tapetes</option>
                    <option value="diadema">Diadema</option>
                    <option value="gorros">Gorros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={formData.price || 50.00}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Ruta de Imagen</label>
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#437579] hover:bg-[#335C60] text-white font-bold py-2.5 rounded-xl transition-all uppercase tracking-wider text-xs mt-2"
              >
                {editingId ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-bold text-sm text-white">Catálogo Actual ({products.length})</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {products.map((p) => (
                <div key={p.id} className="bg-stone-950 p-3 rounded-2xl border border-stone-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-white text-xs">{p.name}</h4>
                      <span className="text-[10px] text-emerald-400 font-bold">{formatCurrency(p.price)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setEditingId(p.id);
                        setFormData(p);
                      }}
                      className="p-1.5 bg-sky-600/20 text-sky-400 hover:bg-sky-600 hover:text-white rounded-lg transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-1.5 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
