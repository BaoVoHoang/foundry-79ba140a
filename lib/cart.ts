import { CartItem, Product } from './types';

const CART_KEY = 'cart';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Reads and JSON-parses the `cart` key from localStorage.
 * Returns [] if absent, invalid, or not running in a browser.
 */
export function getCart(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

/**
 * JSON-stringifies and writes the given items to localStorage under `cart`.
 * Also dispatches a `cart-updated` custom event so listeners in the same tab
 * (where the native `storage` event does not fire) can react immediately.
 */
export function saveCart(items: CartItem[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: items }));
}

/**
 * Adds a product to the cart. If the product already exists in the cart,
 * increments its quantity (clamped to a max of 10). Otherwise adds a new
 * line item with quantity 1.
 */
export function addToCart(product: Product | CartItem): CartItem[] {
  const items = getCart();
  const existing = items.find((item) => item.id === product.id);

  let next: CartItem[];
  if (existing) {
    const quantity = Math.min(10, existing.quantity + 1);
    next = items.map((item) => (item.id === product.id ? { ...item, quantity } : item));
  } else {
    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: 1,
    };
    next = [...items, newItem];
  }

  saveCart(next);
  return next;
}

/**
 * Removes the item with the given id from the cart.
 */
export function removeFromCart(id: number): CartItem[] {
  const items = getCart();
  const next = items.filter((item) => item.id !== id);
  saveCart(next);
  return next;
}

/**
 * Updates the quantity of the item with the given id, clamped between 1 and 10.
 */
export function updateQuantity(id: number, qty: number): CartItem[] {
  const items = getCart();
  const clamped = Math.max(1, Math.min(10, qty));
  const next = items.map((item) => (item.id === id ? { ...item, quantity: clamped } : item));
  saveCart(next);
  return next;
}

/**
 * Removes all items from the cart.
 */
export function clearCart(): CartItem[] {
  saveCart([]);
  return [];
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
