'use client';

import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { removeFromCart, updateQuantity, getCartSubtotal } from '@/lib/cart';

export function CartToggleButton() {
  const { cart, toggleCart } = useCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label="Toggle cart"
      className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.9-4.706 2.316-7.184a1.125 1.125 0 00-1.11-1.316H5.394m2.106 8.5L5.106 5.272M7.5 14.25L5.106 5.272M9.75 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

export default function Cart() {
  const { cart, refreshCart, isCartOpen, closeCart } = useCart();
  const subtotal = getCartSubtotal(cart);

  const handleIncrement = (id: number, quantity: number) => {
    updateQuantity(id, quantity + 1);
    refreshCart();
  };

  const handleDecrement = (id: number, quantity: number) => {
    updateQuantity(id, quantity - 1);
    refreshCart();
  };

  const handleRemove = (id: number) => {
    removeFromCart(id);
    refreshCart();
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={closeCart}
          aria-hidden="true"
          data-testid="cart-overlay"
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping cart"
        data-testid="cart-sidebar"
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.id} className="flex flex-col border-b pb-3" data-testid="cart-item">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="text-gray-400 hover:text-red-600"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecrement(item.id, item.quantity)}
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="h-7 w-7 rounded border text-sm disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        -
                      </button>
                      <span data-testid="item-quantity">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleIncrement(item.id, item.quantity)}
                        disabled={item.quantity >= 10}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="h-7 w-7 rounded border text-sm disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold" data-testid="line-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t p-4">
          <div className="mb-3 flex items-center justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span data-testid="cart-subtotal">${subtotal.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={closeCart}
            className={`block w-full rounded-md bg-blue-600 py-2 text-center font-medium text-white hover:bg-blue-700 ${
              cart.length === 0 ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            Proceed to Checkout
          </Link>
        </div>
      </aside>
    </>
  );
}
