<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;

class StripeController extends Controller
{
    public function createSession(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $user = Auth::user();
        $cart = session()->get('cart', []);
        $totalPrice = array_reduce($cart, function ($sum, $item) {
            return $sum + ($item['price'] * $item['quantity']);
        }, 0);

        $lineItems = [];
        foreach ($cart as $id => $item) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'jpy',
                    'product_data' => [
                        'name' => $item['name'],
                    ],
                    'unit_amount' => $item['price'],
                ],
                'quantity' => $item['quantity'],
            ];
        }

        $session = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems, // 商品の配列
            'mode' => 'payment', // 一括支払い（定期課金なら 'subscription'）
            'success_url' => route('stripe.success'), // 決済成功後のリダイレクト
            'cancel_url' => route('stripe.cancel'),   // キャンセル時のリダイレクト
            'customer_email' => $user->email, // ユーザーのメール
        ]);

        return redirect()->away($session->url);
    }

    public function success(Request $request)
    {
        try {
            // トランザクション開始
            DB::beginTransaction();

            // カート情報とユーザー情報を取得
            $cart = session()->get('cart', []);
            $user = Auth::user();

            if (empty($cart)) {
                return redirect()->back();
            }

            // 合計金額を計算
            $totalPrice = array_reduce($cart, function ($sum, $item) {
                return $sum + ($item['price'] * $item['quantity']);
            }, 0);

            // 注文情報を保存
            $order = Order::create([
                'user_id' => $user->id,
                'payment_method' => 'stripe', // Stripe決済であることを明示
                'total_price' => $totalPrice,
            ]);

            // 注文詳細を保存
            foreach ($cart as $productId => $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $productId,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            // 管理者とユーザーにメールを送信
            Mail::to($user->email)->send(new \App\Mail\OrderConfirmationMail($user, $cart, $totalPrice));
            Mail::to('admin@web.work')->send(new \App\Mail\AdminOrderNotificationMail($user, $cart, $totalPrice));

            // カートをクリア
            session()->forget('cart');

            // トランザクションをコミット
            DB::commit();

            // 注文完了画面にリダイレクト
            return Inertia::render('Checkout/OrderComplete');
        } catch (\Exception $e) {
            // トランザクションをロールバック
            DB::rollBack();

            // エラーログを記録
            Log::error('Stripe注文処理エラー: ' . $e->getMessage());

            return Inertia::render('Checkout/OrderComplete', [
                'error' => '注文処理中にエラーが発生しました。',
            ]);
        }
    }

    public function cancel()
    {
        return redirect()->route('/products.index')->with('error', '決済がキャンセルされました。');
    }
}
