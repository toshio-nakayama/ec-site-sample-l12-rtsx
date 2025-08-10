import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react'

interface CartItem {
    name: string;
    price: number;
    code: string;
    img: string;
    quantity: number;
}
interface User {
    id: number;
    name: string;
    email: string;
    zipcode: string;
    address: string;
}
interface Step1Props {
    user: User; // ログインユーザー情報
    cartInfo?: { [id: string]: CartItem }; // id をキーとした CartItem のオブジェクト
    totalPrice?: number; // 合計金額
}

export default function Step1({ user, cartInfo, totalPrice }: Step1Props) {

    const handlePaymentMethod = (method: 'cash_on_delivery' | 'stripe') => {
        console.log(method);//ただしくmethod取得できている
        router.post('/checkout/confirm', { method });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">決済方法選択</h2>}
        >
            <Head title="決済方法選択" />

            <div className="py-3">

                <div className="m-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2 overflow-hidden bg-white shadow-sm sm:rounded-lg">

                        <div className="grid grid-cols-1 gap-3 px-10 py-2">
                            <p className="text-lg">
                                {user.name}さん　決済方法を選択してください。
                            </p>
                            <button
                                onClick={() => handlePaymentMethod('cash_on_delivery')}
                                className="w-64 p-3 font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-400"
                            >
                                代引き決済
                            </button>
                            <button
                                onClick={() => handlePaymentMethod('stripe')}
                                className="w-64 p-3 font-semibold text-white bg-green-500 rounded-md hover:bg-green-400"
                            >
                                Stripe決済
                            </button>
                            <p className="text-lg">
                                配送先　〒{user.zipcode}　{user.address}
                            </p>
                            <p className="text-lg">
                                合計金額: ￥{totalPrice?.toLocaleString()}
                            </p>
                            <p className="text-lg">
                                ご注文商品
                            </p>
                            {cartInfo && Object.keys(cartInfo).length > 0 ? (
                                <div className="">
                                    <ul>
                                        {Object.entries(cartInfo).map(([id, item]) => (
                                            <li key={id} className="p-2 border-b">
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
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            <button
                                onClick={() => window.location.href = '/products'}
                                className="w-64 p-3 mt-4 font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-400"
                            >
                                商品一覧に戻る
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
