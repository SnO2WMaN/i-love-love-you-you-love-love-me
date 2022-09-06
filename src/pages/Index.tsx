import {
  ControlsContainer,
  FullScreenControl,
  SigmaContainer,
  useLoadGraph,
  useSigma,
  ZoomControl,
} from "@react-sigma/core";
import { useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import chroma from "chroma-js";
import clsx from "clsx";
import Graph from "graphology";
import React, { Suspense, useEffect, useMemo } from "react";
import { animateNodes } from "sigma/utils/animate";
import useSWR from "swr";

import { useURLParams } from "~/hooks/useURLParams";

export const mkUrl = ({ anilist, annict }: { anilist: string[]; annict: string[] }): string => {
  const url = new URL("/graph", import.meta.env.VITE_API_ENDPOINT);
  if (0 < anilist.length) url.searchParams.set("anilist", anilist.join(","));
  if (0 < annict.length) url.searchParams.set("annict", annict.join(","));
  return url.toString();
};

export type AnimeGraph = {
  users: { id: string; name: string; size: number }[];
  animes: { id: string; title: string; size: number }[];
  statuses: { userId: string; animeId: string }[];
};

export const LoadGraph: React.FC<{ graph: AnimeGraph }> = ({ graph }) => {
  const sigma = useSigma();
  const loadGraph = useLoadGraph();
  const layoutCircular = useLayoutForceAtlas2({ iterations: 500 });

  useEffect(() => {
    if (!graph) return;

    const g = new Graph();
    graph.users.forEach(({ id, name, size }) => {
      g.addNode(id, {
        label: name,
        x: Math.random(),
        y: Math.random(),
        size: Math.max(15, 30 * ((size / graph.animes.length) ** 0.5)),
        color: chroma.mix(
          chroma(200, 0.37, 0.75, "hsl"),
          chroma(146, 0.75, 0.75, "hsl"),
          size / graph.users.reduce((p, { size }) => Math.max(p, size), 0),
          "hsl",
        ).hex(),
      });
    });
    graph.animes.forEach(({ id, title, size }) => {
      g.addNode(id, {
        label: title,
        x: Math.random(),
        y: Math.random(),
        size: Math.max(1, 30 * ((size / graph.users.length) ** 1.5)),
        color: chroma.mix(
          chroma(170, 0.25, 0.34, "hsl"),
          chroma(348, 0.80, 0.75, "hsl"),
          size / graph.users.length,
          "hsl",
        ).hex(),
      });
    });
    graph.statuses.forEach(({ animeId, userId }) => {
      g.addEdge(userId, animeId, { label: "watched", size: 1 });
    });
    loadGraph(g);

    animateNodes(sigma.getGraph(), layoutCircular.positions(), { duration: 2000 });
  }, [graph, layoutCircular, loadGraph, sigma]);

  return null;
};

export const Fetcher: React.FC<
  {
    style?: React.CSSProperties;
    className?: string;
    anilist: string[];
    annict: string[];
  }
> = ({ anilist, annict, style, className }) => {
  const { data } = useSWR<AnimeGraph>(mkUrl({ anilist, annict }), {
    suspense: true,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  });

  return (
    <div style={style} className={clsx(className)}>
      <SigmaContainer>
        <LoadGraph
          graph={
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
