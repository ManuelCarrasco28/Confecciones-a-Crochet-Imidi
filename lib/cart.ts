import { CartItem, Product } from './types';

export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('imidi_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('imidi_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('imidi_cart_updated'));
  } catch {
    // Ignorar
  }
}

export function addToStoredCart(
  product: Product,
  selectedSize?: string,
  selectedColor?: string,
  customNotes?: string,
  selectedYarn?: string
): CartItem[] {
  const currentCart = getStoredCart();
  const size = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'A Medida');
  const color = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Palo Rosa');
  const yarn = selectedYarn || 'Algodón';
  const notes = customNotes ? customNotes.trim() : '';

  const existingIndex = currentCart.findIndex(
    (item) =>
      item.product.id === product.id &&
      item.selectedSize === size &&
      item.selectedColor === color &&
      item.selectedYarn === yarn &&
      (item.customNotes || '') === notes
  );

  let updatedCart: CartItem[];
  if (existingIndex > -1) {
    updatedCart = [...currentCart];
    updatedCart[existingIndex].quantity = Math.min(50, updatedCart[existingIndex].quantity + 1);
  } else {
    updatedCart = [
      ...currentCart,
      {
        product,
        quantity: 1,
        selectedSize: size,
        selectedColor: color,
        selectedYarn: yarn,
        customNotes: notes,
      },
    ];
  }

  saveStoredCart(updatedCart);
  return updatedCart;
}
