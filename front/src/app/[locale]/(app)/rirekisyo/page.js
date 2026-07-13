// src/app/[locale]/(app)/rirekisyo/page.js

import RegimeAuthGate from "../regime/RegimeAuthGate";

export default function RirekisyoPage() {
  return (
    <RegimeAuthGate>
      <main
        style={{
          minHeight: "100vh",
          padding: "24px",
        }}
      >
        <iframe
          src="/api/regime/pdf"
          title="履歴書"
          style={{
            width: "100%",
            height: "calc(100vh - 48px)",
            border: "none",
          }}
        />
      </main>
    </RegimeAuthGate>
  );
}