import { useSigma } from "@react-sigma/core";
import React, { useEffect } from "react";

export const GraphSettingsController: React.FC<{ hoveredNode: string | null }> = ({ hoveredNode }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  useEffect(() => {
    if (hoveredNode) {
      const hoveredNodeColor = sigma.getNodeDisplayData(hoveredNode)?.color;
      sigma.setSetting(
        "nodeReducer",
        (node, data) => {
          if (node === hoveredNode) return { ...data, zIndex: 1 };

          if (node.startsWith("user:")) { // user
            return graph.hasEdge(node, hoveredNode) || graph.hasEdge(hoveredNode, node)
              ? { ...data, zIndex: 1, forceLabel: true }
              : { ...data, zIndex: 0, color: undefined, forceLabel: true };
          } else { // anime
            return graph.hasEdge(node, hoveredNode) || graph.hasEdge(hoveredNode, node)
              ? { ...data, zIndex: 1 }
              : { ...data, zIndex: 0, label: "", color: undefined };
          }
        },
      );
      sigma.setSetting(
        "edgeReducer",
        (edge, data) =>
          graph.hasExtremity(edge, hoveredNode)
            ? { ...data, color: hoveredNodeColor, size: 2 }
            : { ...data, hidden: true },
      );
    } else {
      sigma.setSetting("nodeReducer", null);
      sigma.setSetting("edgeReducer", null);
    }
  });
  return null;
};
