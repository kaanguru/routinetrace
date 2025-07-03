import React, { useEffect } from "react";
import { configurePersistence } from "~/data/legendStateConfig";

export default function DataSyncProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    configurePersistence();
  }, []);

  return <>{children}</>;
}
