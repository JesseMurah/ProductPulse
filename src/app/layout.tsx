import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { ReactNode } from "react";
import { headers } from "next/headers";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Company Data Visualizer",
  description: "Visualize and manage company data",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function ThemeProvider(props: {
  attribute: string;
  defaultTheme: string;
  enableSystem: boolean;
  disableTransitionOnChange: boolean;
  children: ReactNode;
}) {
  return null;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        <TRPCReactProvider headers={headers()}>
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <SessionProvider>{children}</SessionProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
