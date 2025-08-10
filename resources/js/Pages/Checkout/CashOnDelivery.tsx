import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

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
    selectedPaymentMethodInfo: string; // 選択された決済方法
}

export default function CashOnDelivery({ user, cartInfo, totalPrice, selectedPaymentMethodInfo }: Step1Props) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">ご注文の確認</h2>}
        >
            <Head title="決済方法選択" />
            <div className="py-3">

                <div className="m-3 mx-auto max-w-7xl sm:px-6 lg:px-10">
                    <div className="px-10 py-4 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="mb-6">内容をご確認の上、「注文を確定する」ボタンをクリックしてください。</div>
                        <button
                            onClick={() => OrderDone('cash_on_delivery')}
                            className="w-64 p-3 font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-400"
                        >
                            注文を確定する
                        </button>
                        <p className="mt-4 mb-4 text-lg">
                            決済方法：
                            {selectedPaymentMethodInfo === 'cash_on_delivery'
                                ? '代引き決済'
                                : 'Stripe決済'}
                        </p>
                        <p className="text-lg">
                            配送先　〒{user.zipcode}　{user.address}
                        </p>
                        <p className="mb-2 text-lg border-b">
                            {user.name}　様
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
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
