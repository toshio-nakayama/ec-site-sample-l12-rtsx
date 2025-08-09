import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren, ReactNode } from "react";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex items-center shrink-0">
                                <Link href="/">
                                    <ApplicationLogo className="block w-auto text-gray-800 fill-current h-9" />
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <Link
                                    href={route("login")}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="px-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 pb-3 space-y-1"></div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
