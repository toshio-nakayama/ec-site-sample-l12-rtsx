import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout2";
import { Head, usePage } from "@inertiajs/react";

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
    const { auth } = usePage().props;
    console.log("Auth Information:", auth);
    console.log(
        "Authenticated User:",
        auth.user ? auth.user : "No user authenticated"
    );
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;
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
                        <div className="p-6 text-gray-900">商品一覧</div>
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
                                            <button
                                                onClick={() =>
                                                    addToCart(product.id)
                                                }
                                                className="pointer-events-auto rounded-md bg-indigo-500 px-2 py-2 my-2 text-[0.8125rem]/5 font-semibold text-white hover:bg-indigo-400 w-2/3 text-center"
                                            >
                                                カートに入れる
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
