"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TEXT_MUTED } from "@/lib/helpers";

export default function BackButton({ fallbackHref = "/wines", fallbackLabel = "Alle wijnen" }) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        // Ga terug in de geschiedenis als die er is (bv. vanaf Sommeliers' favorieten
        // of een restaurantpagina); anders terug naar een zinnige standaardpagina
        // (bv. wanneer iemand rechtstreeks op een gedeelde link is geland).
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className="flex items-center gap-1.5 text-sm pt-8 pb-6"
      style={{ color: TEXT_MUTED }}
    >
      <ArrowLeft size={14} /> Terug
    </button>
  );
}
