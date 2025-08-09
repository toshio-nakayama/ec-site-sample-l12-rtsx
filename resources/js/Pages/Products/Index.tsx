import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

interface Product {
    id: number;
    name: string;
    code: string;
    price: number;
    img: string;
    active: number;
}

interface ProductsProps {
    products: Product[];
}

export default function Products({ products }: ProductsProps) {
    return (
        <AuthenticatedLayout
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
                        <div className="p-6 text-gray-900">商品一覧</div>
                    </div>
                </div>

                <div className="m-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="w-10/12 m-3 border border-gray-400 table-auto">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="w-12 px-4 py-2">ID</th>
                                    <th className="w-48 px-4 py-2">商品</th>
                                    <th className="px-4 py-2 w-28">コード</th>
                                    <th className="px-4 py-2 text-center w-28">
                                        価格
                                    </th>
                                    <th className="px-4 py-2 text-center w-28">
                                        画像
                                    </th>
                                    <th className="px-4 py-2 text-center w-28">
                                        アクティブ
                                    </th>
                                    <th className="px-4 py-2"></th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    return (
                                        <tr key={product.id}>
                                            <td className="px-4 py-2 text-center border border-gray-400">
                                                {product.id}
                                            </td>
                                            <td className="px-4 py-2 border border-gray-400">
                                                {product.name}
                                            </td>
                                            <td className="px-4 py-2 text-center border border-gray-400">
                                                {product.code}
                                            </td>
                                            <td className="px-4 py-2 text-right border border-gray-400">
                                                {product.price}
                                            </td>
                                            <td className="px-4 py-2 text-right border border-gray-400">
                                                <img
                                                    src={`/storage/img/${product.img}`}
                                                    alt={product.name}
                                                    className="object-cover w-16 h-16 mx-auto"
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-right border border-gray-400">
                                                {product.active == 1
                                                    ? "在庫がありません"
                                                    : "在庫あり"}
                                            </td>
                                            <td className="px-4 py-2 text-center border border-gray-400"></td>
                                            <td className="px-4 py-2 text-center border border-gray-400"></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
