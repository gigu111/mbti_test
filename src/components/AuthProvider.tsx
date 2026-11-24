"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

/** 앱 전체에서 공유할 로그인 상태와 로그아웃 함수 타입 */
interface AuthContextValue {
  /** 현재 로그인한 사용자 정보 (비로그인 시 null) */
  user: User | null;
  /** 현재 인증 세션 정보 (비로그인 시 null) */
  session: Session | null;
  /** 처음 브라우저에서 로그인 여부를 확인하는 중인지 여부 */
  isLoading: boolean;
  /** 로그아웃을 실행하는 함수 */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * 앱 전체 레이아웃을 감싸 로그인 상태(user, session, isLoading)를 공유하는 컴포넌트입니다.
 * - 로그인·회원가입·로그아웃이 일어나면 onAuthStateChange 가 감지해 모든 화면을 즉시 갱신합니다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. 로그인·로그아웃 등 인증 상태 변화를 실시간으로 구독합니다.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
    });

    // 2. 첫 화면 진입 시 현재 저장된 세션을 한 번 읽어 초기 상태를 확정합니다.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setSession(null);
        setUser(null);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /** 현재 브라우저에서 로그아웃을 처리합니다. */
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      // 네트워크 문제 등으로 서버 로그아웃에 실패하더라도 현재 브라우저 세션은 비워 줍니다.
      await supabase.auth.signOut({ scope: "local" });
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 컴포넌트 안에서 현재 로그인 상태를 꺼내 쓸 때 사용하는 훅입니다.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth 는 AuthProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
