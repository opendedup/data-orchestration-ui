import "./globals.css";
import { ReactNode } from "react";
import { CopilotKit } from "@copilotkit/react-core";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-gray-900">
      <body className="bg-gray-900 text-gray-100 antialiased">
        {/* This points to the runtime we setup in the previous step */}
        <CopilotKit runtimeUrl="/api/copilotkit" agent="data_orchestration_agent">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}