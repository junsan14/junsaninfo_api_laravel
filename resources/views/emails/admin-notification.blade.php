@component('mail::message')
# 新しいお問い合わせがありました

**お名前**: {{ $data['name'] }}  
**メールアドレス**: {{ $data['email'] }}  
**件名**: {{ $data['subject'] }}  
**メッセージ**:

{{ $data['message'] }}

@endcomponent
