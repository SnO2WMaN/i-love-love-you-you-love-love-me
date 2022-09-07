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
        "w-full",
        "h-screen",
      )}
    >
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
