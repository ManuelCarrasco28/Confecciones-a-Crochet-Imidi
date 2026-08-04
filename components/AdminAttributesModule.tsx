'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, Check, X, RotateCcw, Scissors, Palette, Search } from 'lucide-react';
import { fetchStoreAttributes, getStoredAttributes, saveStoreAttributes, DEFAULT_ATTRIBUTES, StoreAttributes } from '@/lib/attributes';

interface AdminAttributesModuleProps {
  isDark?: boolean;
}

export function AdminAttributesModule({ isDark = false }: AdminAttributesModuleProps) {
  const [attrs, setAttrs] = useState<StoreAttributes>(getStoredAttributes);
  const [activeSubTab, setActiveSubTab] = useState<'hilos' | 'colores' | 'tallas'>('hilos');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');

  // Modales ("Mini Ventanas")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemInput, setNewItemInput] = useState('');

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const handleUpdate = () => setAttrs(getStoredAttributes());
    fetchStoreAttributes().then(setAttrs).catch(() => {
      // Mantener el respaldo local si Supabase no está disponible.
    });
    window.addEventListener('imidi_attributes_updated', handleUpdate);
    return () => window.removeEventListener('imidi_attributes_updated', handleUpdate);
  }, []);

  const handleSaveAll = async (updated: StoreAttributes) => {
    try {
      await saveStoreAttributes(updated);
      setAttrs(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      return true;
    } catch {
      alert('No se pudo guardar en Supabase. Revisa la conexión y vuelve a intentarlo.');
      return false;
    }
  };

  // Agregar elemento mediante mini ventana
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = newItemInput.trim();
    if (!val) return;

    if (activeSubTab === 'hilos') {
      if (attrs.yarns.includes(val)) return alert('Este tipo de hilo ya existe.');
      if (!(await handleSaveAll({ ...attrs, yarns: [...attrs.yarns, val] }))) return;
    } else if (activeSubTab === 'colores') {
      if (attrs.colors.includes(val)) return alert('Este color ya existe.');
      if (!(await handleSaveAll({ ...attrs, colors: [...attrs.colors, val] }))) return;
    } else {
      if (attrs.sizes.includes(val)) return alert('Esta talla ya existe.');
      if (!(await handleSaveAll({ ...attrs, sizes: [...attrs.sizes, val] }))) return;
    }
    setNewItemInput('');
    setIsAddModalOpen(false);
  };

  // Guardar edición mediante mini ventana
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex === null) return;
    const val = editingText.trim();
    if (!val) return;

    if (activeSubTab === 'hilos') {
      const copy = [...attrs.yarns];
      copy[editingIndex] = val;
      if (!(await handleSaveAll({ ...attrs, yarns: copy }))) return;
    } else if (activeSubTab === 'colores') {
      const copy = [...attrs.colors];
      copy[editingIndex] = val;
      if (!(await handleSaveAll({ ...attrs, colors: copy }))) return;
    } else {
      const copy = [...attrs.sizes];
      copy[editingIndex] = val;
      if (!(await handleSaveAll({ ...attrs, sizes: copy }))) return;
    }
    setEditingIndex(null);
    setEditingText('');
  };

  // Eliminar elemento
  const handleDeleteItem = async (idx: number) => {
    const list = activeSubTab === 'hilos' ? attrs.yarns : activeSubTab === 'colores' ? attrs.colors : attrs.sizes;
    if (list.length <= 1) {
      alert('Debe existir al menos 1 elemento registrado.');
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) return;

    if (activeSubTab === 'hilos') {
      await handleSaveAll({ ...attrs, yarns: attrs.yarns.filter((_, i) => i !== idx) });
    } else if (activeSubTab === 'colores') {
      await handleSaveAll({ ...attrs, colors: attrs.colors.filter((_, i) => i !== idx) });
    } else {
      await handleSaveAll({ ...attrs, sizes: attrs.sizes.filter((_, i) => i !== idx) });
    }
  };

  const handleResetDefault = async () => {
    if (window.confirm('¿Deseas restablecer las opciones a los valores iniciales de fábrica?')) {
      await handleSaveAll(DEFAULT_ATTRIBUTES);
    }
  };

  // Obtener lista actual filtrada
  const currentList = activeSubTab === 'hilos' ? attrs.yarns : activeSubTab === 'colores' ? attrs.colors : attrs.sizes;
  const filteredList = currentList
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => item.toLowerCase().includes(filterSearch.toLowerCase()));

  const subTabLabels = {
    hilos: { title: 'Tipos de Hilo', singular: 'Tipo de Hilo', icon: Scissors, count: attrs.yarns.length, labelName: 'Nombre del Tipo de Hilo (ej. Algodón Mercerizado)' },
    colores: { title: 'Colores de Hilo', singular: 'Color de Hilo', icon: Palette, count: attrs.colors.length, labelName: 'Nombre del Color (ej. Turquesa Imidi)' },
    tallas: { title: 'Tallas & Dimensiones', singular: 'Talla o Dimensión', icon: Tag, count: attrs.sizes.length, labelName: 'Nombre de la Talla (ej. XL, A Medida, 40cm x 40cm)' },
  };

  const currentTabConfig = subTabLabels[activeSubTab];

  // Estilos de Alto Contraste para ambos modos (Claro y Oscuro)
  const cardBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#B2CFCF] shadow-sm';
  const tableHeaderBg = isDark ? 'bg-slate-950 text-slate-200' : 'bg-[#DDE8E8] text-[#162C2E] font-extrabold';
  const inputBg = isDark
    ? 'bg-slate-950 border-slate-700 text-white font-bold focus:border-[#437579]'
    : 'bg-[#F8F5EF] border-[#C4D8D9] text-[#162C2E] font-extrabold focus:border-[#437579] focus:bg-white shadow-sm';
  const floatingLabel = isDark
    ? 'text-[#6BB3B8] peer-placeholder-shown:text-slate-400 peer-focus:text-[#6BB3B8] font-bold'
    : 'text-[#214347] peer-placeholder-shown:text-[#597477] peer-focus:text-[#214347] font-extrabold';
  const textPrimary = isDark ? 'text-white' : 'text-[#162C2E]';
  const subText = isDark ? 'text-slate-300' : 'text-[#2D4D51] font-semibold';

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      
      {/* 1. Selector de Pestañas de Atributos + Botones de Acción */}
      <div className={`${cardBg} p-3 sm:p-4 rounded-2xl sm:rounded-3xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4`}>
        
        {/* Pestañas Principales */}
        <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-2">
          <button
            onClick={() => { setActiveSubTab('hilos'); setEditingIndex(null); }}
            className={`min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-extrabold transition-all border sm:shrink-0 ${
              activeSubTab === 'hilos'
                ? 'bg-[#437579] text-white border-[#437579] shadow-md'
                : isDark ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800' : 'bg-white text-[#213B3E] border-[#B2CFCF] hover:bg-[#E2ECEC]'
            }`}
          >
            <Scissors className="w-4 h-4 text-amber-500" />
            <span className="leading-tight text-center">Hilos ({attrs.yarns.length})</span>
          </button>

          <button
            onClick={() => { setActiveSubTab('colores'); setEditingIndex(null); }}
            className={`min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-extrabold transition-all border sm:shrink-0 ${
              activeSubTab === 'colores'
                ? 'bg-[#437579] text-white border-[#437579] shadow-md'
                : isDark ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800' : 'bg-white text-[#213B3E] border-[#B2CFCF] hover:bg-[#E2ECEC]'
            }`}
          >
            <Palette className="w-4 h-4 text-emerald-500" />
            <span>Colores ({attrs.colors.length})</span>
          </button>

          <button
            onClick={() => { setActiveSubTab('tallas'); setEditingIndex(null); }}
            className={`min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-extrabold transition-all border sm:shrink-0 ${
              activeSubTab === 'tallas'
                ? 'bg-[#437579] text-white border-[#437579] shadow-md'
                : isDark ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800' : 'bg-white text-[#213B3E] border-[#B2CFCF] hover:bg-[#E2ECEC]'
            }`}
          >
            <Tag className="w-4 h-4 text-sky-500" />
            <span>Tallas ({attrs.sizes.length})</span>
          </button>
        </div>

        {/* Indicador de Éxito & Restablecimiento */}
        <div className="flex items-center justify-end gap-2 shrink-0 sm:self-auto">
          {saveSuccess && (
            <span className="bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>¡Guardado!</span>
            </span>
          )}
          <button
            onClick={handleResetDefault}
            className="inline-flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-extrabold px-3 py-2 rounded-2xl border border-rose-200 transition-all shadow-sm"
            title="Restablecer opciones"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>

      </div>

      {/* 2. Tabla Única de Atributos (Sin columna de Estado de Visibilidad) */}
      <div className={`${cardBg} rounded-2xl sm:rounded-3xl border overflow-hidden`}>
        
        {/* Cabecera de Tabla con Título, Buscador y Botón Crear Mini Ventana */}
        <div className="p-4 sm:p-5 border-b border-slate-700/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          <div>
            <h3 className={`font-serif text-base font-extrabold ${textPrimary} flex items-center gap-2`}>
              <currentTabConfig.icon className="w-4.5 h-4.5 text-[#437579]" />
              <span>Gestión de {currentTabConfig.title}</span>
            </h3>
            <p className={`text-xs ${subText} mt-0.5`}>
              Todas las opciones registradas aparecen en los productos de la tienda.
            </p>
          </div>

          <div className="flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center gap-2.5 w-full sm:w-auto">
            {/* Buscador Integrado */}
            <div className="relative flex-1 sm:w-56">
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Filtrar opción..."
                className={`w-full ${inputBg} rounded-2xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#437579]`}
              />
              <Search className="w-4 h-4 text-[#437579] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Botón Abrir Mini Ventana Agregar */}
            <button
              onClick={() => { setNewItemInput(''); setIsAddModalOpen(true); }}
              className="bg-[#437579] hover:bg-[#335C60] text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all inline-flex items-center justify-center space-x-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Crear {currentTabConfig.singular}</span>
            </button>
          </div>

        </div>

        {/* Tabla Única y Limpia */}
        <div className="overflow-x-auto">
          <table className="admin-responsive-table w-full text-left text-xs">
            <thead>
              <tr className={`${tableHeaderBg} uppercase text-[10px] tracking-wider border-b border-slate-700/20`}>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Nombre del Elemento / Opción</th>
                <th className="py-3 px-4 text-right pr-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/10">
              {filteredList.length === 0 ? (
                <tr>
                  <td data-label="" colSpan={3} className={`py-8 text-center ${subText} italic`}>
                    No se encontraron elementos registrados en esta categoría.
                  </td>
                </tr>
              ) : (
                filteredList.map(({ item, idx }, position) => (
                  <tr
                    key={`${item}-${idx}`}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-slate-800/50' : 'hover:bg-[#F4F1EA]/60'
                    }`}
                  >
                    {/* # Posición */}
                    <td data-label="#" className={`py-3.5 px-4 text-center font-extrabold ${subText}`}>
                      {position + 1}
                    </td>

                    {/* Nombre del Elemento */}
                    <td data-label="Nombre" className="py-3.5 px-4">
                      <span className={`font-extrabold text-sm ${textPrimary} flex items-center gap-2`}>
                        {activeSubTab === 'hilos' && '🧵'}
                        {activeSubTab === 'colores' && '🎨'}
                        {activeSubTab === 'tallas' && '📏'}
                        <span>{item}</span>
                      </span>
                    </td>

                    {/* Acciones Editar y Eliminar */}
                    <td data-label="Acciones" className="py-3.5 px-4 text-right pr-6">
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingIndex(idx);
                            setEditingText(item);
                          }}
                          className="px-3 py-1.5 bg-[#437579]/15 hover:bg-[#437579] text-[#214347] hover:text-white dark:text-[#6BB3B8] font-bold rounded-xl transition-all inline-flex items-center space-x-1"
                          title="Editar elemento"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(idx)}
                          className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-600 text-rose-700 hover:text-white dark:text-rose-400 font-bold rounded-xl transition-all inline-flex items-center space-x-1"
                          title="Eliminar elemento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 3. MINI VENTANA (MODAL POPUP) AGREGAR ELEMENTO (ESTILO FACEBOOK FLOATING LABEL) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`${cardBg} w-full max-w-md max-h-[94dvh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border relative animate-in zoom-in-95 duration-200`}>
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              aria-label="Cerrar ventana para crear atributo"
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-700/20">
              <div className="w-9 h-9 rounded-xl bg-[#437579]/15 text-[#437579] flex items-center justify-center shrink-0">
                <currentTabConfig.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-serif text-base font-bold ${textPrimary}`}>
                  Crear Nuevo {currentTabConfig.singular}
                </h3>
                <p className={`text-xs ${subText}`}>
                  Se agregará inmediatamente a todos los productos.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              
              {/* Campo Estilo Facebook Floating Label */}
              <div className="relative">
                <input
                  type="text"
                  id="addModalInput"
                  required
                  autoFocus
                  value={newItemInput}
                  onChange={(e) => setNewItemInput(e.target.value)}
                  placeholder=" "
                  className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all`}
                />
                <label
                  htmlFor="addModalInput"
                  className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                >
                  {currentTabConfig.labelName}
                </label>
              </div>

              <div className="flex flex-col-reverse min-[420px]:flex-row items-stretch min-[420px]:items-center min-[420px]:justify-end gap-2 pt-2 border-t border-slate-700/20">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs text-center font-extrabold text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#437579] hover:bg-[#335C60] text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all inline-flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Guardar {currentTabConfig.singular}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 4. MINI VENTANA (MODAL POPUP) EDITAR ELEMENTO (ESTILO FACEBOOK FLOATING LABEL) */}
      {editingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`${cardBg} w-full max-w-md max-h-[94dvh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border relative animate-in zoom-in-95 duration-200`}>
            
            <button
              onClick={() => setEditingIndex(null)}
              aria-label="Cerrar ventana para editar atributo"
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-700/20">
              <div className="w-9 h-9 rounded-xl bg-[#437579]/15 text-[#437579] flex items-center justify-center shrink-0">
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-serif text-base font-bold ${textPrimary}`}>
                  Editar {currentTabConfig.singular}
                </h3>
                <p className={`text-xs ${subText}`}>
                  Modifica el nombre oficial del elemento.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              
              {/* Campo Estilo Facebook Floating Label */}
              <div className="relative">
                <input
                  type="text"
                  id="editModalInput"
                  required
                  autoFocus
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  placeholder=" "
                  className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all`}
                />
                <label
                  htmlFor="editModalInput"
                  className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                >
                  {currentTabConfig.labelName}
                </label>
              </div>

              <div className="flex flex-col-reverse min-[420px]:flex-row items-stretch min-[420px]:items-center min-[420px]:justify-end gap-2 pt-2 border-t border-slate-700/20">
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  className="px-4 py-2.5 rounded-2xl text-xs text-center font-extrabold text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#437579] hover:bg-[#335C60] text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all inline-flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Actualizar Nombre</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
