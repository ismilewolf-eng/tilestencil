"use client";

import { useEffect } from "react";
import { rememberFirstTouch } from "@/lib/attribution";

/** Keeps the visitor's first referrer in localStorage; read only when they buy. */
export function FirstTouch() {
  useEffect(() => rememberFirstTouch(), []);
  return null;
}
