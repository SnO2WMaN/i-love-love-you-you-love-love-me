import { ControlsContainer, FullScreenControl, SigmaContainer, ZoomControl } from "@react-sigma/core";
import clsx from "clsx";
import React, { Suspense, useMemo, useState } from "react";
import useSWR from "swr";

import { useURLParams } from "~/hooks/useURLParams";

import { GraphDataController } from "./GraphDataController";
import { GraphEventsController } from "./GraphEventsController";
import { GraphSettingsController } from "./GraphSettingsController";
import { DataSet } from "./types";

export const mkUrl = ({ anilist, annict }: { anilist: string[]; annict: string[] }): string => {
  const url = new URL("/graph", import.meta.env.VITE_API_ENDPOINT);
  if (0 < anilist.length) url.searchParams.set("anilist", anilist.join(","));
  if (0 < annict.length) url.searchParams.set("annict", annict.join(","));
  return url.toString();
};

export const Fetcher: React.FC<
  {
    style?: React.CSSProperties;
    className?: string;
    anilist: string[];
    annict: string[];
  }
> = ({ anilist, annict, style, className }) => {
  const { data } = useSWR<DataSet>(mkUrl({ anilist, annict }), {
    suspense: true,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div style={style} className={clsx(className)}>
      <SigmaContainer>
        <GraphSettingsController hoveredNode={hoveredNode} />
        <GraphEventsController setHoveredNode={(node) => setHoveredNode(node)} />
        <GraphDataController
          dataset={
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            data!
          }
        />

        <ControlsContainer position={"bottom-right"}>
          <ZoomControl />
          <FullScreenControl />
        </ControlsContainer>
      </SigmaContainer>
    </div>
  );
};

export const Page: React.FC = () => {
  const rawParamAnnict = useURLParams("annict");
  const rawParamAnilist = useURLParams("anilist");

  const paramAnilist = useMemo(() => rawParamAnilist?.split(",") || [], [rawParamAnilist]);
  const paramAnnict = useMemo(() => rawParamAnnict?.split(",") || [], [rawParamAnnict]);

  return (
    <div
      className={clsx(
        "relative",
        "w-full",
        "h-screen",
      )}
    >
      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/SnO2WMaN/i-love-love-you-you-love-love-me"
        className={clsx(
          ["absolute", ["left-2", "bottom-2"], ["z-50"]],
          ["px-4", "py-2"],
          ["text-md", "text-white"],
          ["rounded-md"],
          ["bg-slate-600", "hover:bg-slate-700", "bg-opacity-75", "backdrop-blur-sm"],
        )}
      >
        GitHub
      </a>
      <Suspense fallback={<span>Loading</span>}>
        <Fetcher
          style={{ width: "100%", height: "100%" }}
          annict={paramAnnict}
          anilist={paramAnilist}
        />
      </Suspense>
    </div>
  );
};
