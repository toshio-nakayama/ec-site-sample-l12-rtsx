// resources/js/Pages/Auth/Register.tsx
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import axios from "axios";
import React, { FormEventHandler } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        zipcode: "", // ADD
        address: "", // ADD
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            /* onFinishだとバリデーションエラー時にパスワードフィールドの値がリセットされてしまうため、
               onSuccessを使用して、DBに登録されてからパスワードフィールドのみリセットする */
            // onFinish: () => reset("password", "password_confirmation"),
            onSuccess: () => reset("password", "password_confirmation"),
        });
    };

    const handleZipcodeChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const zipcode = e.target.value;
        if (/^\d{7}$/.test(zipcode)) {
            try {
                const response = await axios.get("/api/zipcode/search", {
                    params: { zipcode },
                });
                if (response.data.results?.length > 0) {
                    const result = response.data.results[0];
                    setData(
                        "address",
                        `${result.address1}${result.address2}${result.address3}`
                    );
                } else {
                    console.error("住所が見つかりませんでした");
                }
            } catch (error) {
                console.error("郵便番号の検索に失敗しました", error);
            }
        }
    };

    const handleCombinedChage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData("zipcode", e.target.value);
        handleZipcodeChange(e);
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="block w-full mt-1"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full mt-1"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full mt-1"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block w-full mt-1"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* ADD: New fields for zipcode */}
                <div className="mt-4">
                    <InputLabel htmlFor="zipcode" value="Zipcode" />

                    <TextInput
                        id="zipcode"
                        name="zipcode"
                        value={data.zipcode}
                        className="block w-full mt-1"
                        autoComplete="zipcode"
                        onChange={(e) => handleCombinedChage(e)}
                        required
                    />

                    <InputError message={errors.zipcode} className="mt-2" />
                </div>

                {/* ADD: New fields for address */}
                <div className="mt-4">
                    <InputLabel htmlFor="address" value="Address" />

                    <TextInput
                        id="address"
                        name="address"
                        value={data.address}
                        className="block w-full mt-1"
                        autoComplete="address"
                        onChange={(e) => setData("address", e.target.value)}
                        required
                    />

                    <InputError message={errors.address} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route("login")}
                        className="text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
