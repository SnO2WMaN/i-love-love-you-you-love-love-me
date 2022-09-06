import { useRegisterEvents } from "@react-sigma/core";
import React, { useEffect } from "react";

export const GraphEventsController: React.FC<{
  setHoveredNode: (node: string | null) => void;
}> = ({ setHoveredNode }) => {
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    registerEvents({
      enterNode({ node }) {
        setHoveredNode(node);
      },
      leaveNode() {
        setHoveredNode(null);
      },
    });
  }, [registerEvents, setHoveredNode]);

  return null;
};
