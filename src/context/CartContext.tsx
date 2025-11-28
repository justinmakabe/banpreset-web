'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image_url: string;
    quantity?: number;
}

interface CartContextType {
    cart: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    total: number;
    discount: number;
    couponCode: string;
    finalTotal: number;
    applyCoupon: (code: string, percent: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [discount, setDiscount] = useState(0); // Percent
    const [couponCode, setCouponCode] = useState('');

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addItem = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === item.id);
            if (existingItem) {
                return prevCart.map((i) =>
                    i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (id: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
        setDiscount(0);
        setCouponCode('');
    };

    const applyCoupon = (code: string, percent: number) => {
        setDiscount(percent);
        setCouponCode(code);
    };

    const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const finalTotal = total * (1 - discount / 100);

    return (
        <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, total, discount, couponCode, finalTotal, applyCoupon }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
