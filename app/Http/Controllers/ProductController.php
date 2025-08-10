<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all();
        $cart = session()->get('cart', []);
        $totalPrice = array_reduce($cart, fn($sum, $item) => $sum + ($item['price'] * $item['quantity']), 0);
        return Inertia::render('Products/Index', [
            'products' => $products,
            'totalPrice' => $totalPrice,
        ]);
    }

    public function addToCart($id)
    {
        $product = Product::find($id);
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $cart[$id]['quantity']++;
        } else {
            $cart[$id] = [
                'name' => $product->name,
                'price' => $product->price,
                'code' => $product->code,
                'img' => $product->img,
                'quantity' => 1,
            ];
        }

        session()->put('cart', $cart);
        // return response()->json([
        //     'message' => '商品をカートに追加しました。',
        //     'cart' => $cart,
        // ]);
        return redirect()->route('products.index')->with('success', '商品をカートに追加しました');
    }

    public function addCartPlus($id)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $cart[$id]['quantity']++;
        }
        session()->put('cart', $cart);
        return redirect()->route('products.index');
    }

    public function cartMinus($id)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            if ($cart[$id]['quantity'] > 1) {
                $cart[$id]['quantity']--;
            }
        }
        session()->put('cart', $cart);
        return redirect()->route('products.index');
    }

    public function removeCart($id)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            unset($cart[$id]);
        }
        session()->put('cart', $cart);
        return redirect()->route('products.index');
    }

    public function step1()
    {
        // ユーザーがログインしているか確認
        $user = Auth::user();
        $cart = session()->get('cart', []);
        $totalPrice = array_reduce($cart, fn($sum, $item) => $sum + ($item['price'] * $item['quantity']), 0);
        // Inertiaを使用してビューをレンダリング
        return Inertia::render('Checkout/Step1', [
            'user' => $user,
            'totalPrice' => $totalPrice,
        ]);
    }

    public function confirm(Request $request)
    {
        // dd($request->all());
        $method = $request->input('method');
        session()->put('selectedPaymentMethod', $method);
        //dd($method);
        if ($method === 'cash_on_delivery') {
            return redirect('/checkout/cash-on-delivery');
        } elseif ($method === 'stripe') {
            // return redirect('/checkout/stripe');
            return Inertia::location('/checkout/stripe');
        }

        return back();
    }

    public function cashOnDelivery()
    {
        $user = Auth::user();
        $cart = session()->get('cart', []);
        $totalPrice = array_reduce($cart, fn($sum, $item) => $sum + ($item['price'] * $item['quantity']), 0);
        //dd($method);
        return Inertia::render('Checkout/CashOnDelivery', [
            'user' => $user,
            'totalPrice' => $totalPrice,
        ]);
    }

    public function orderDone(Request $request)
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
                'payment_method' => $request->input('payment_method', 'cash_on_delivery'), // 支払い方法
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
            Log::error('注文処理エラー: ' . $e->getMessage());

            return Inertia::render('Checkout/OrderComplete', [
                'error' => '注文処理中にエラーが発生しました。',
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
