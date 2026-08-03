'use client';

import React, { useState } from 'react';
import { Scissors, Send, CheckCircle2, Phone, AlertCircle } from 'lucide-react';
import { CustomOrderRequest, YARN_OPTIONS, COLOR_OPTIONS } from '@/lib/types';
import { generateWhatsAppCustomOrderLink, isValidPeruPhone, isValidFullName, normalizePeruPhone } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export function CustomOrderSection() {
  const [formData, setFormData] = useState<CustomOrderRequest>({
    fullName: '',
    phone: '',
    serviceType: 'prenda_medida',
    garmentType: 'Blusa / Tapete a Crochet',
    city: 'Jaén',
    measurements: '',
    selectedYarn: 'Algodón',
    selectedColor: 'Turquesa Imidi (Original)',
    details: '',
  });

  const [honeypot, setHoneypot] = useState('');
  const [acceptDataPolicy, setAcceptDataPolicy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Protección Anti-Spam (Honeypot)
    if (honeypot) return;

    if (!isValidFullName(formData.fullName)) {
      setErrorMsg('Por favor ingresa tu nombre y apellido completos (ej. María Carrasco).');
      return;
    }

    if (!isValidPeruPhone(formData.phone)) {
      setErrorMsg('El número de celular debe tener 9 dígitos y empezar con 9 (ej. 935240485).');
      return;
    }

    if (formData.serviceType === 'prenda_medida' && (!formData.measurements || formData.measurements.trim().length < 2)) {
      setErrorMsg('Por favor indica tus medidas o talla para la confección a pedido (ej. Busto 90cm, largo 55cm).');
      return;
    }

    if (!formData.details || formData.details.trim().length < 10) {
      setErrorMsg('Por favor proporciona una descripción más detallada del pedido o arreglo (mínimo 10 caracteres).');
      return;
    }

    if (!acceptDataPolicy) {
      setErrorMsg('Debes aceptar el uso de tus datos para la coordinación de la cotización por WhatsApp.');
      return;
    }

    const cleanData: CustomOrderRequest = {
      ...formData,
      fullName: formData.fullName.trim(),
      phone: normalizePeruPhone(formData.phone),
      details: formData.details.trim().substring(0, 500),
      measurements: formData.measurements ? formData.measurements.trim().substring(0, 200) : '',
    };

    try {
      const supabase = createClient();
      await supabase.from('custom_requests').insert({
        full_name: cleanData.fullName,
        phone: cleanData.phone,
        service_type: cleanData.serviceType,
        garment_type: cleanData.garmentType,
        city: cleanData.city || 'Jaén',
        measurements: cleanData.measurements,
        details: `${cleanData.details} (Hilo: ${cleanData.selectedYarn}, Color: ${cleanData.selectedColor})`,
      });
    } catch (err) {
      console.warn('Could not store request in Supabase:', err);
    }

    const link = generateWhatsAppCustomOrderLink(cleanData);
    window.open(link, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="pedidos-a-medida" className="py-12 sm:py-20 bg-white border-t border-b border-[#C4D8D9] text-[#213B3E] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Columna Izquierda */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#E2ECEC] border border-[#437579]/30 text-[#437579] px-3.5 py-1.5 rounded-full text-xs font-bold">
              <Scissors className="w-4 h-4 text-[#D89B53]" />
              <span>Costura & Arreglos a Medida</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-[#213B3E]">
              ¿Tienes una prenda en mente o necesitas un <span className="text-[#437579]">ajuste a tu medida</span>?
            </h2>

            <p className="text-[#597477] text-sm leading-relaxed font-normal">
              En <strong className="text-[#437579]">Confecciones Imidi</strong> trabajamos con todo tipo de hilos de calidad: <em>Algodón, Silvia, Tren, Fino Cable, Quesito, Pavino en Cono y Nylon</em>. Confeccionamos blusas, vestidos, tapetes, diademas, gorros y arreglamos tu ropa favorita.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3 text-xs text-[#3E5C60]">
                <CheckCircle2 className="w-5 h-5 text-[#437579] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#213B3E] block">Confección a Medida:</strong>
                  Tejemos en el hilo y color exacto que elijas.
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs text-[#3E5C60]">
                <CheckCircle2 className="w-5 h-5 text-[#D97B84] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#213B3E] block">Arreglos y Entalles de Costura:</strong>
                  Bastas, entalles de cintura, cambio de cierres, retoque de cuellos y zurcidos finos.
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs text-[#3E5C60]">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#213B3E] block">Asesoría Directa por WhatsApp:</strong>
                  Te ayudamos a elegir el mejor tipo de hilo para tu diseño.
                </div>
              </div>
            </div>

          </div>

          {/* Columna Derecha */}
          <div className="lg:col-span-7">
            <div className="bg-[#F8F5EF] p-4 sm:p-8 rounded-3xl border border-[#C4D8D9] shadow-lg relative">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#C4D8D9]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#213B3E]">
                    Formulario de Cotización a Medida
                  </h3>
                  <p className="text-xs text-[#597477] mt-0.5">
                    Completa los datos y te responderemos inmediatamente por WhatsApp
                  </p>
                </div>
                <Scissors className="w-6 h-6 text-[#D89B53] hidden sm:block" />
              </div>

              {errorMsg && (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#213B3E]">
                    ¡Solicitud lista para enviar!
                  </h4>
                  <p className="text-[#597477] text-xs max-w-sm mx-auto">
                    Se ha abierto WhatsApp con el resumen de tu solicitud. Si no se abrió automáticamente, haz clic abajo:
                  </p>
                  <a
                    href={generateWhatsAppCustomOrderLink(formData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3 rounded-full transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Abrir Chat de WhatsApp</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  
                  {/* Honeypot Invisible Anti-Spam */}
                  <input
                    type="text"
                    name="website_url_hp"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="relative">
                      <input
                        type="text"
                        id="formFullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder=" "
                        className="peer w-full bg-white border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs text-[#213B3E] font-bold focus:outline-none focus:border-[#437579] transition-all shadow-sm"
                      />
                      <label
                        htmlFor="formFullName"
                        className="absolute left-4 top-2 text-[10px] font-extrabold text-[#214347] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#38595D] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#214347] pointer-events-none"
                      >
                        Nombre completo (Nombre y Apellido)
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="tel"
                        id="formPhone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder=" "
                        className="peer w-full bg-white border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs text-[#213B3E] font-bold focus:outline-none focus:border-[#437579] transition-all shadow-sm"
                      />
                      <label
                        htmlFor="formPhone"
                        className="absolute left-4 top-2 text-[10px] font-extrabold text-[#214347] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#38595D] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#214347] pointer-events-none"
                      >
                        Celular WhatsApp (9 dígitos)
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#213B3E] mb-1">
                        Servicio
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as CustomOrderRequest['serviceType'] })}
                        className="w-full bg-white border border-[#C4D8D9] rounded-2xl px-3 py-2.5 text-xs text-[#213B3E] focus:outline-none focus:border-[#437579] shadow-sm font-bold"
                      >
                        <option value="prenda_medida">🧶 Prenda a Medida</option>
                        <option value="arreglo_costura">✂️ Servicio de Costura $</option>
                        <option value="diseno_personalizado">✨ Diseño Exclusivo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#213B3E] mb-1">
                        Tipo de Hilo
                      </label>
                      <select
                        value={formData.selectedYarn}
                        onChange={(e) => setFormData({ ...formData, selectedYarn: e.target.value })}
                        className="w-full bg-white border border-[#C4D8D9] rounded-2xl px-3 py-2.5 text-xs text-[#213B3E] focus:outline-none focus:border-[#437579] shadow-sm font-bold"
                      >
                        {YARN_OPTIONS.map((yarn) => (
                          <option key={yarn} value={yarn}>
                            🧵 {yarn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#213B3E] mb-1">
                        Color de Hilo
                      </label>
                      <select
                        value={formData.selectedColor}
                        onChange={(e) => setFormData({ ...formData, selectedColor: e.target.value })}
                        className="w-full bg-white border border-[#C4D8D9] rounded-2xl px-3 py-2.5 text-xs text-[#213B3E] focus:outline-none focus:border-[#437579] shadow-sm font-bold"
                      >
                        {COLOR_OPTIONS.map((col) => (
                          <option key={col} value={col}>
                            🎨 {col}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="relative">
                      <input
                        type="text"
                        id="formCity"
                        value={formData.city || 'Jaén'}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder=" "
                        className="peer w-full bg-white border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs text-[#213B3E] font-bold focus:outline-none focus:border-[#437579] transition-all shadow-sm"
                      />
                      <label
                        htmlFor="formCity"
                        className="absolute left-4 top-2 text-[10px] font-extrabold text-[#214347] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#38595D] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#214347] pointer-events-none"
                      >
                        📍 Ciudad / Distrito (ej. Jaén, Cajamarca, Lima)
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        id="formMeasurements"
                        value={formData.measurements}
                        onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
                        placeholder=" "
                        className="peer w-full bg-white border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs text-[#213B3E] font-bold focus:outline-none focus:border-[#437579] transition-all shadow-sm"
                      />
                      <label
                        htmlFor="formMeasurements"
                        className="absolute left-4 top-2 text-[10px] font-extrabold text-[#214347] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#38595D] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#214347] pointer-events-none"
                      >
                        Medidas (ej. Busto 90 cm, Cintura 75 cm)
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      id="formDetails"
                      required
                      rows={3}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder=" "
                      className="peer w-full bg-white border border-[#C4D8D9] rounded-2xl px-4 pt-6 pb-2 text-xs text-[#213B3E] font-bold focus:outline-none focus:border-[#437579] transition-all shadow-sm resize-none"
                    />
                    <label
                      htmlFor="formDetails"
                      className="absolute left-4 top-2 text-[10px] font-extrabold text-[#214347] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#38595D] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#214347] pointer-events-none"
                    >
                      Detalles de la prenda o arreglo a realizar
                    </label>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start space-x-2 text-[11px] text-[#2D4D51] font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptDataPolicy}
                        onChange={(e) => setAcceptDataPolicy(e.target.checked)}
                        className="mt-0.5 rounded text-[#437579]"
                      />
                      <span>Acepto que mi nombre y celular se usen únicamente para coordinar este pedido por WhatsApp.</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center space-x-2 bg-[#437579] hover:bg-[#335C60] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-xs uppercase tracking-wider"
                  >
                    <Send className="w-4 h-4" />
                    <span>Solicitar Cotización por WhatsApp</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
