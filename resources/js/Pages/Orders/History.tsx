import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';


interface Product {
    id: number;
    name: string;
    code: string;
}

interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    product?: Product;
}

interface Order {
    id: number;
    created_at: string;
    total_price: number;
    payment_method: string;
    items: OrderItem[];
}

interface HistoryProps {
    orders: Order[];
}

export default function History({ orders }: HistoryProps) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">注文履歴</h2>}
        >
            <Head title="注文履歴" />

            <div className="py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                    <h3 className="mb-4 text-xl font-bold">過去の注文履歴</h3>
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <div key={order.id} className="pb-4 mb-4 border-b">
                                <p className="text-lg font-semibold">注文日時: {new Date(order.created_at).toLocaleString()}</p>
                                <p className="text-lg">決済方法: {order.payment_method === 'cash_on_delivery' ? '代引き決済' : 'Stripe決済'}</p>
                                <p className="text-lg">合計金額: ￥{Math.round(order.total_price).toLocaleString()}</p>

                                <h4 className="mt-3 font-bold">注文商品:</h4>
                                <ul className="ml-5 list-disc">
                                    {order.items.map(item => (
                                        <li key={item.id}>
                                            商品ID: {item.product_id},
                                            商品名: {item.product?.name}（コード: {item.product?.code}）,
                                            数量: {item.quantity}個,
                                            単価: ￥{Math.round(item.price).toLocaleString()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">注文履歴がありません。</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
