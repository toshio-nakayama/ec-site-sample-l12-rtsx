import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Props {
    error?: string; // エラーメッセージを受け取る
}

export default function OrderComplete({ error }: Props) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">注文完了</h2>}
        >
            <div className="py-3">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {/* エラーメッセージがある場合に表示 */}
                        {error ? (
                            <div className="p-4 mb-4 text-red-600 bg-red-100 rounded alert alert-danger">
                                <strong>エラー:</strong> {error}
                            </div>
                        ) : (
                            <>
                                <h1 className="mb-6 text-2xl font-bold">注文が完了しました！</h1>
                                <p>このたびはご注文いただき誠にありがとうございます。</p>
                                <p>確認のためメールをお送りしましたのでご確認ください。</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
