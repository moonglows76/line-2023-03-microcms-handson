import "../styles/global.css";
import { useEffect, useState, createContext } from "react";

// liff.init で LIFF アプリの初期化を行い、各ページで利用できるようにしています。今回のハンズオンでは、プロフィール情報を試します。
export const LiffContext = createContext({});

export default function App({ Component, pageProps }) {
  // [liffObject, profile]
  const [[liffObject, profile], setLiffState] = useState([null, null]);
  useEffect(() => {
  if (!pageProps.liffId) return;
    import("@line/liff").then((liff) => {
      liff
        .init({ liffId: pageProps.liffId })
        .then(() => {
          if (liff.isLoggedIn()) {
            // ログインしている場合は、liff.init の情報と プロフィールを、liffState を更新します。
            // プロフィール情報の取得は liff.profile の API を利用しています。
            // プロフィール情報の取得をする
            liff
              .getProfile()
              .then((profile) => {
                setLiffState([liff, profile])
              })
              .catch((err) => {
                console.warn({ err })
              })
          } else {
            // ログインしていない場合は、liff.init の情報のみを liffState に更新しています。
            setLiffState([liff, null]);
          }
        })
        .catch((err) => {
          console.warn({ err });
        });
    });
  }, []);
  return (
    <LiffContext.Provider
      value={{
        liffObject: liffObject,
        profile: profile,
        setLiffState: setLiffState,
      }}
    >
      <Component {...pageProps} />
    </LiffContext.Provider>
  );
}
