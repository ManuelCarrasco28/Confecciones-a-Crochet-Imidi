import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CustomOrderRequest, Product } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STORE_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_STORE_WHATSAPP || '51935240485';

export const STORE_FACEBOOK_URL =
  'https://www.facebook.com/profile.php?id=100054925651425';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Normaliza cualquier número de teléfono ingresado en Perú a 9 dígitos limpios (ej. 935240485)
 * Soporta formatos: '+51 935240485', '51 935 240 485', '935-240-485', '935.240.485'
 */
export function normalizePeruPhone(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.trim().replace(/[\s\-\.\(\)\+]/g, '');
  if (cleaned.startsWith('51') && cleaned.length === 11) {
    cleaned = cleaned.substring(2);
  }
  return cleaned;
}

/**
 * Valida estrictamente un número de celular de Perú (9 dígitos, comenzando con 9, sin letras ni caracteres raros)
 */
export function isValidPeruPhone(phone: string): boolean {
  const cleaned = normalizePeruPhone(phone);
  return /^9\d{8}$/.test(cleaned);
}

/**
 * Valida un nombre completo en Perú (mínimo 2 palabras, solo letras y espacios)
 */
export function isValidFullName(name: string): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  const words = trimmed.split(/\s+/);
  if (words.length < 2) return false;
  // Permite letras (con tildes/ñ), espacios, apóstrofes y guiones en apellidos válidos
  return /^[a-zA-ZáéíóúñÁÉÍÓÚÑ'\-\s]{3,80}$/.test(trimmed);
}

/**
 * Normaliza y valida un correo electrónico
 */
export function normalizeEmail(email: string): string {
  return email ? email.trim().toLowerCase() : '';
}

export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

/**
 * Valida contraseña segura en registro (mínimo 8 caracteres, al menos 1 letra y 1 número)
 */
export function isValidPassword(password: string): boolean {
  if (!password || password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}

export function generateWhatsAppProductLink(product: Product): string {
  let text = `¡Hola Confecciones a Crochet Imidi! 🧶\nQuisiera consultar disponibilidad y hacer un pedido de:\n\n`;
  text += `*Prenda:* ${product.name}\n`;
  text += `*Precio Referencial:* S/ ${product.price.toFixed(2)}\n`;
  text += `*Categoría:* ${product.category}\n\n`;
  text += `¿Tienen disponibilidad o cuál es el tiempo estimado de confección a mano? ¡Gracias!`;

  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function generateWhatsAppCartLink(cart: { product: Product; quantity: number; selectedSize?: string; selectedColor?: string; selectedYarn?: string; customNotes?: string }[]): string {
  if (!cart || cart.length === 0) return `https://wa.me/${STORE_WHATSAPP_NUMBER}`;

  let text = '¡Hola Confecciones a Crochet Imidi! 🧶\nQuisiera solicitar el siguiente pedido de prendas a mano:\n\n';
  
  let total = 0;
  cart.forEach((item, index) => {
    const subtotal = item.product.price * item.quantity;
    total += subtotal;
    text += `*${index + 1}. ${item.product.name}*\n`;
    text += `   • Cantidad: ${item.quantity}\n`;
    text += `   • Precio c/u: S/ ${item.product.price.toFixed(2)}\n`;
    if (item.selectedYarn) text += `   • Tipo de Hilo: ${item.selectedYarn}\n`;
    if (item.selectedColor) text += `   • Color: ${item.selectedColor}\n`;
    if (item.selectedSize) text += `   • Talla: ${item.selectedSize}\n`;
    if (item.customNotes) text += `   • Indicaciones: ${item.customNotes}\n`;
    text += `   • Subtotal: S/ ${subtotal.toFixed(2)}\n\n`;
  });

  text += `---------------------------------\n`;
  text += `*TOTAL ESTIMADO (REFERENCIAL): S/ ${total.toFixed(2)}*\n\n`;
  text += `Quedo a la espera de su confirmación para coordinar el tiempo de tejido y la entrega. ¡Muchas gracias!`;

  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function generateWhatsAppCustomOrderLink(formData: CustomOrderRequest): string {
  let text = '¡Hola Confecciones a Crochet Imidi! ✂️\n';
  text += 'Quisiera solicitar una cotización para un pedido a medida:\n\n';
  text += `• *Cliente:* ${formData.fullName}\n`;
  text += `• *Teléfono:* ${normalizePeruPhone(formData.phone)}\n`;
  text += `• *Servicio:* ${formData.serviceType === 'prenda_medida' ? 'Prenda a Medida' : formData.serviceType === 'arreglo_costura' ? 'Servicio de Costura / Arreglo $' : 'Diseño Exclusivo'}\n`;
  text += `• *Tipo de Hilo:* ${formData.selectedYarn || 'Algodón'}\n`;
  text += `• *Color:* ${formData.selectedColor || 'A elección'}\n`;
  if (formData.city) text += `• *Ciudad/Distrito:* ${formData.city}\n`;
  if (formData.measurements) text += `• *Medidas:* ${formData.measurements}\n`;
  text += `• *Detalles:* ${formData.details}\n\n`;
  text += 'Espero su pronta respuesta. ¡Muchas gracias!';

  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
