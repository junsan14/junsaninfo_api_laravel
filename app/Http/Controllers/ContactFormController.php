<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactFormMail;
use App\Mail\AdminNotificationMail;
use Illuminate\Support\Facades\Mail;

class ContactFormController extends Controller
{
    //
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // ユーザー宛に確認メールを送る
        Mail::to($request->email)->send(new ContactFormMail($data));
         // 管理者宛に通知メールを送る
        Mail::to(config('mail.from.address'))->send(new AdminNotificationMail($data));

        return response()->json(['message' => 'お問い合わせが送信されました。']);

    }
}
