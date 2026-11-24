-- 돌고래 MBTI 검사 결과를 저장할 test_results 테이블을 만드는 SQL 입니다.
-- 같은 SQL 을 두 번 이상 실행해도 오류가 나지 않도록 작성했습니다.

-- 1. 검사 결과를 담을 test_results 테이블 생성 (이미 있으면 새로 만들지 않고 건너뜁니다)
create table if not exists public.test_results (
  id bigint generated always as identity primary key, -- id: 1부터 자동으로 1씩 늘어나는 고유 번호(기본 키)
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade, -- user_id: auth.users(id) 참조(회원 탈퇴 시 결과도 삭제), 기본값은 현재 로그인 회원 ID(auth.uid())
  mbti_type text not null check (mbti_type ~ '^[EI][SN][TF][JP]$'), -- mbti_type: E/I, S/N, T/F, J/P 조합의 4글자 유형 코드만 허용
  created_at timestamptz not null default now() -- created_at: 결과가 저장된 날짜와 시각 (기본값은 현재 시각 now())
);

-- 2. 내 검사 기록을 최신순으로 빠르게 찾기 위한 (user_id, created_at) 인덱스 생성
create index if not exists idx_test_results_user_created -- 이미 같은 이름의 인덱스가 있으면 건너뜁니다
  on public.test_results (user_id, created_at desc); -- 회원(user_id)별로 최신 시각(created_at desc) 순서 정렬에 사용

-- 3. 역할별 테이블 권한(GRANT) 설정: 새 테이블을 API에서 안전하게 다루기 위한 권한 제어
revoke all on public.test_results from public, anon; -- 로그인하지 않은 방문자(anon)와 기본(public) 권한을 모두 회수합니다
grant select, insert, delete on public.test_results to authenticated; -- 로그인한 회원(authenticated)에게만 조회·저장·삭제 권한을 부여합니다

-- 4. 행 수준 보안(RLS) 활성화: 아래 정책에 맞는 데이터만 읽고 쓸 수 있게 잠급니다
alter table public.test_results enable row level security; -- test_results 테이블에 RLS(행 수준 보안)를 켭니다

-- 5. RLS 정책 1 — 조회(SELECT): 로그인한 회원은 자기 결과만 볼 수 있습니다
drop policy if exists "본인 결과만 조회" on public.test_results; -- 두 번 실행해도 오류가 나지 않게 기존 같은 이름 정책을 먼저 지웁니다
create policy "본인 결과만 조회" -- '본인 결과만 조회'라는 이름의 보안 정책을 만듭니다
  on public.test_results -- 적용할 대상 테이블
  for select -- 조회(SELECT) 요청일 때만 적용
  to authenticated -- 로그인한 회원(authenticated 역할)에게만 적용
  using ((select auth.uid()) = user_id); -- 로그인한 내 ID(auth.uid())와 행의 user_id가 같을 때만 조회 허용

-- 6. RLS 정책 2 — 저장(INSERT): 로그인한 회원은 자기 user_id 로만 저장할 수 있습니다
drop policy if exists "본인 이름으로만 저장" on public.test_results; -- 두 번 실행해도 오류가 나지 않게 기존 같은 이름 정책을 먼저 지웁니다
create policy "본인 이름으로만 저장" -- '본인 이름으로만 저장'이라는 이름의 보안 정책을 만듭니다
  on public.test_results -- 적용할 대상 테이블
  for insert -- 새 행 추가(INSERT) 요청일 때만 적용
  to authenticated -- 로그인한 회원(authenticated 역할)에게만 적용
  with check ((select auth.uid()) = user_id); -- 저장하려는 행의 user_id가 현재 로그인한 내 ID와 같을 때만 저장 허용

-- 7. RLS 정책 3 — 삭제(DELETE): 로그인한 회원은 자기 결과만 삭제할 수 있습니다
drop policy if exists "본인 결과만 삭제" on public.test_results; -- 두 번 실행해도 오류가 나지 않게 기존 같은 이름 정책을 먼저 지웁니다
create policy "본인 결과만 삭제" -- '본인 결과만 삭제'이라는 이름의 보안 정책을 만듭니다
  on public.test_results -- 적용할 대상 테이블
  for delete -- 삭제(DELETE) 요청일 때만 적용
  to authenticated -- 로그인한 회원(authenticated 역할)에게만 적용
  using ((select auth.uid()) = user_id); -- 로그인한 내 ID(auth.uid())와 행의 user_id가 같을 때만 삭제 허용
