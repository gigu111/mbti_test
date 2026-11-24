-- 모든 회원의 검사 결과를 유형별로 집계하는 get_type_stats() 함수를 만드는 SQL 입니다.
-- 개별 기록이나 회원 정보는 내보내지 않고, 유형 코드(mbti_type)와 개수(count)만 돌려줍니다.
-- 같은 SQL 을 두 번 이상 실행해도 오류가 나지 않도록 작성했습니다.

-- 1. 유형별 개수를 집계하는 DB 함수 생성 (이미 같은 함수가 있으면 안전하게 교체합니다)
create or replace function public.get_type_stats()
returns table (
  mbti_type text, -- MBTI 4글자 유형 코드 (예: 'ENFP')
  count bigint -- 해당 유형이 저장된 총 개수
)
language sql -- SQL 문장만으로 동작하는 가벼운 함수입니다
stable -- 데이터를 바꾸지 않고 읽기만 하므로 stable 로 표시합니다
security definer -- 테이블의 RLS를 우회해 전체 통계를 계산하되, 아래에서 반환 값을 개수만으로 제한합니다
set search_path = '' -- 보안 규칙: 스키마 검색 경로를 비워 의도하지 않은 객체 참조를 막습니다
as $$
  select
    r.mbti_type, -- 유형 코드만 선택합니다 (user_id 나 개별 행 정보는 내보내지 않습니다)
    count(*)::bigint as count -- 같은 유형끼리 묶어 개수를 셉니다
  from public.test_results as r -- search_path 가 비어 있으므로 public. 을 꼭 붙여 테이블을 찾습니다
  group by r.mbti_type -- 유형 코드별로 그룹을 나눕니다
  order by count desc, r.mbti_type asc; -- 많이 나온 순서(내림차순), 같으면 유형 코드 오름차순으로 정렬합니다
$$;

-- 2. 함수 실행 권한(GRANT) 설정
-- PostgreSQL 은 새 함수를 만들면 기본적으로 누구나(public) 실행할 수 있게 되어 있으므로,
-- 먼저 기본(public) 권한을 회수한 뒤 필요한 역할에게만 실행 권한을 직접 부여합니다.
revoke all on function public.get_type_stats() from public; -- 기본(public) 실행 권한을 회수합니다
grant execute on function public.get_type_stats() to anon, authenticated; -- 로그인하지 않은 방문자(anon)와 로그인한 회원(authenticated) 모두 실행할 수 있게 허용합니다
