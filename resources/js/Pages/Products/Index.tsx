import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout2";
import { Head, usePage } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    code: string;
    price: number;
    img: string;
    active: number;
}

interface CartItem {
    name: string;
    price: number;
    code: string;
    img: string;
    quantity: number;
}

interface ProductsProps {
    products: Product[];
    successMessage?: string;
    cartInfo?: { [id: string]: CartItem }; // idをキーとしたCartItemのオブジェクト
    totalPrice?: number; // カートの合計金額
}

export default function Products({ products, successMessage, cartInfo, totalPrice }: ProductsProps) {
    const { auth } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    }

    console.log("Auth Information:", auth);
    console.log(
        "Authenticated User:",
        auth.user ? auth.user : "No user authenticated"
    );
    console.log("Cart Information:", cartInfo);
    console.log("Total Price:", totalPrice);
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    const form = useForm<{ id: number }>({
        id: 0,
    });

    const addToCart = (id: number) => {
        form.post(route('products.add', id), {
            // onSuccess: () => alert("商品がカートに追加されました!"),
            onError: () => alert("カートへの追加に失敗しました。"),
        });
    };

    const addCartPlus = (id: number) => {
        form.post(route('products.plus', id), {
            onError: () => alert("数量の追加に失敗しました。"),
        });
    };

    const cartMinus = (id: number) => {
        form.post(route('products.minus', id), {
            onError: () => alert("数量の減少に失敗しました。"),
        });
    };

    const removeCart = (id: number) => {
        form.post(route('products.remove', id), {
            onError: () => alert("カートからの削除に失敗しました。"),
        });
    };

    const checkout = () => {
        if (auth?.user) {
            router.visit('/checkout/step1')
        } else {
            router.visit('/register')
        }
    };

    return (
        <Layout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Products
                </h2>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {/* メッセージの表示 */}
                        {successMessage && (
                            <div className="px-4 py-3 m-3 text-green-700 bg-green-100 border border-green-400 rounded">
                                {successMessage}
                            </div>
                        )}
                        <div className="flex p-6 text-gray-900">
                            <span className="flex-auto">商品一覧</span>
                            <DangerButton onClick={openModal}>
                                カートの中身を見る
                            </DangerButton>
                        </div>
                    </div>
                </div>

                <div className="m-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="grid grid-cols-3">
                            {products.map((product) => {
                                return (
                                    <div
                                        key={product.id}
                                        className="grid items-center justify-center grid-cols-2 p-3 shadow-md"
                                    >
                                        <div>
                                            <img
                                                src={`/storage/img/${product.img}`}
                                                alt={product.name}
                                                className="object-cover w-32 h-32 mx-auto"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-2xl text-indigo-600">
                                                {product.name}
                                            </div>
                                            <div className="text-teal-600">
                                                {product.code}
                                            </div>
                                            <div className="text-3xl">
                                                ￥{product.price}
                                            </div>
                                            {product.active == 0 ? (
                                                <button
                                                    onClick={() =>
                                                        addToCart(product.id)
                                                    }
                                                    className="pointer-events-auto rounded-md bg-indigo-500 px-2 py-2 my-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-400 w-2/3 text-center"
                                                >
                                                    カートに入れる
                                                </button>
                                            ) : (
                                                <div className="my-2 text-sm font-semibold text-red-500">在庫なし</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">カートの中身</h2>

                    <p className="text-lg">
                        合計金額: ￥{totalPrice?.toLocaleString()}
                    </p>
                    <p className="text-lg">
                        ご注文商品
                    </p>

                    {cartInfo && Object.keys(cartInfo).length > 0 ? (
                        <div className="mt-4">
                            <ul>
                                {Object.entries(cartInfo).map(([id, item]) => (
                                    <li key={id} className="p-3 border-b">
                                        <div className="flex items-center">
                                            <img
                                                src={`/storage/img/${item.img}`}
                                                alt={item.name}
                                                className="object-cover w-16 h-16 mr-4"
                                            />
                                            <div>
                                                <p className="font-bold">{item.name}</p>
                                                <p>コード: {item.code}</p>
                                                <p>価格: ￥{item.price}</p>
                                                <p>
                                                    数量: {item.quantity}個
                                                    <button onClick={() => addCartPlus(Number(id))} className="
                                                pointer-events-auto rounded-md bg-indigo-500 px-1 py-1 ml-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-400 text-center">
                                                        ＋
                                                    </button>
                                                    {item.quantity > 1 && (
                                                        <button onClick={() => cartMinus(Number(id))} className="
                                                pointer-events-auto rounded-md bg-indigo-500 px-1 py-1 ml-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-400 text-center">
                                                            －
                                                        </button>
                                                    )}
                                                    <button onClick={() => removeCart(Number(id))} className="
                                                pointer-events-auto rounded-md bg-red-500 px-1 py-1 ml-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-red-400 text-center">
                                                        削除
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className='text-center'>
                                <button onClick={() => checkout()} className="w-2/3 px-2 py-2 my-2 font-semibold text-center text-white bg-indigo-500 rounded-md pointer-events-auto hover:bg-indigo-400">
                                    精算に進む
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-4 text-gray-600">カートは空です。</p>
                    )}

                    <div className="flex justify-end mt-6">
                        <SecondaryButton onClick={closeModal}>閉じる</SecondaryButton>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
}
