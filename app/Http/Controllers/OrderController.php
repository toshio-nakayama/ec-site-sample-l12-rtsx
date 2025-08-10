<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function history()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login')->withErrors(['error' => 'ログインしてください。']);
        }
        //dd($user, $user->orders()->with('items')->get());

        // ログインユーザーの注文履歴を取得
        $orders = Auth::user()->orders()->with('items.product')->latest()->get();
        // ビューにデータを渡す
        return Inertia::render('Orders/History', [
            'orders' => $orders,
        ]);
    }
}
