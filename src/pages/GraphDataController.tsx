import { useLoadGraph, useSigma } from "@react-sigma/core";
import { useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import chroma from "chroma-js";
import Graph from "graphology";
import React, { useEffect } from "react";
import { animateNodes } from "sigma/utils/animate";

import { DataSet } from "./types";

export const GraphDataController: React.FC<{ dataset: DataSet }> = ({ dataset }) => {
  const sigma = useSigma();
  const loadGraph = useLoadGraph();
  const layoutCircular = useLayoutForceAtlas2({
    iterations: 1000,
  });

  useEffect(() => {
    if (!dataset) return;

    const g = new Graph();

    const usercolors = chroma
      .scale([
        chroma(326, 0.42, 0.62, "hsl"),
        chroma(426, 0.42, 0.62, "hsl"),
      ])
      .mode("hsl")
      .colors(dataset.users.length);
    const animecolors = chroma
      .scale([
        chroma(206, 0.45, 0.40, "hsl"),
        chroma(226, 0.60, 0.75, "hsl"),
      ])
      .mode("hsl")
      .colors(dataset.users.length);
    dataset.users.forEach(({ id, name, size }, i) => {
      g.addNode(id, {
        label: name,
        x: Math.random(),
        y: Math.random(),
        size: 15 + (20 * ((size / dataset.animes.length) ** 0.5)),
        color: usercolors[i],
      });
    });
    dataset.animes.forEach(({ id, title, size }) => {
      g.addNode(id, {
        label: title,
        x: Math.random(),
        y: Math.random(),
        size: 5 + (40 * ((size / dataset.users.length) ** 3)),
        color: animecolors[size - 1],
      });
    });
    dataset.statuses.forEach(({ animeId, userId, status }) => {
      g.addEdge(userId, animeId, {
        label: status,
        size: status === "WATCHED" ? 1 : 2,
      });
    });
    loadGraph(g);

    animateNodes(sigma.getGraph(), layoutCircular.positions(), { duration: 5000 });
  }, [sigma]);

  return null;
};
