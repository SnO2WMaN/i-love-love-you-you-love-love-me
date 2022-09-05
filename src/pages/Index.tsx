import { css } from "@emotion/css";
import { ControlsContainer, SigmaContainer, useLoadGraph, useSigma, ZoomControl } from "@react-sigma/core";
import { useLayoutCircular } from "@react-sigma/layout-circular";
import Graph from "graphology";
import { useEffect, useState } from "react";
import { animateNodes } from "sigma/utils/animate";

export type AnimeGraph = {
  animes: { id: string; title: string }[];
  users: { id: string; name: string }[];
  status: { userId: string; animeId: string }[];
};

export const LoadGraph: React.FC<{ graph: AnimeGraph }> = ({ graph }) => {
  const sigma = useSigma();
  const loadGraph = useLoadGraph();
  const layoutCircular = useLayoutCircular({});

  useEffect(() => {
    const g = new Graph();
    graph.animes.forEach(({ id, title }) => {
      g.addNode(id, { x: Math.random(), y: Math.random(), size: 5, label: title, color: "red" });
    });
    graph.users.forEach(({ id, name }) => {
      g.addNode(id, { x: Math.random(), y: Math.random(), size: 15, label: name, color: "blue" });
    });
    graph.status.forEach(({ animeId, userId }) => {
      g.addEdge(userId, animeId, {});
    });
    loadGraph(g);

    animateNodes(sigma.getGraph(), layoutCircular.positions(), { duration: 500 });
  }, [
    graph,
    layoutCircular,
    loadGraph,
    sigma,
  ]);

  return null;
};

export const Page: React.FC = (props) => {
  const [graph, setGraph] = useState<AnimeGraph>({
    animes: Array.from(new Array(100)).map((_, i) => ({ id: `a${i}`, title: `Anime ${i}` })),
    users: Array.from(new Array(10)).map((_, i) => ({ id: `u${i}`, name: `User ${i}` })),
    status: Array.from(new Array(200))
      .map((_) => ({
        userId: `u${Math.floor(Math.random() * 10)}`,
        animeId: `a${Math.floor(Math.random() * 40)}`,
      }))
      .filter(
        (t, i, a) => a.findIndex((f) => f.animeId === t.animeId && f.userId === t.userId) === i,
      ),
  });

  return (
    <>
      <div className={css({ padding: "16px 24px", width: "640px", height: "480px" })}>
        <SigmaContainer>
          <LoadGraph graph={graph} />
          <ControlsContainer position={"bottom-right"}>
            <ZoomControl />
          </ControlsContainer>
        </SigmaContainer>
      </div>
    </>
  );
};
