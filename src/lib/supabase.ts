import { createClient } from "@supabase/supabase-js";

// .env.local 에 넣어 둔 Supabase 접속 주소와 공개(Publishable) 키를 읽어 옵니다.
// NEXT_PUBLIC_ 접두사가 붙어 있어야 브라우저 코드에서도 안전하게 사용할 수 있습니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// 환경 변수가 비어 있으면 실수를 바로 알 수 있도록 안내 오류를 띄웁니다.
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    ".env.local 파일에 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 가 설정되어 있는지 확인해 주세요.",
  );
}

/**
 * 앱 전체에서 단 하나만 만들어 함께 쓰는 공용 Supabase 클라이언트입니다.
 * - 브라우저에서 직접 Supabase 데이터베이스와 로그인 기능에 연결할 때 이 객체만 가져다 씁니다.
 */
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
