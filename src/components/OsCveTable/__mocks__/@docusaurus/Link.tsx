import React from "react";

export default function MockLink({ to, children }: { to: string; children: React.ReactNode }) {
  return <a href={to}>{children}</a>;
}
