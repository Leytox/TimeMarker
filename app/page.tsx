"use client";

import { Button } from "@/components/ui/button";
import { Hourglass, MapPin, MoveRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="fullscreen-centered">
      <div className="flex flex-col gap-16">
        <div className="relative">
          <Hourglass className="size-10 md:size-12 absolute left-0 -translate-x-1.5 -translate-y-6 md:-translate-x-2 md:-translate-y-10" />
          <h1 className="text-5xl md:text-6xl font-semibold leading-normal">
            {t("common.title")}
          </h1>
          <MapPin className="size-10 md:size-12 absolute right-0 translate-x-2.5 -translate-y-4 md:translate-x-3 md:-translate-y-2" />
        </div>
        <div className="flex items-center justify-center">
          <Link href={"/story"}>
            <Button size={"lg"}>
              {t("common.getStarted")} <MoveRight />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
