import React, { useEffect, useRef, useState } from 'react';
import ConversationModal from './ConversationModal';
import * as d3 from 'd3';

const ProgressionPathTree = ({ data }) => {
  const svgRef = useRef();
  const gRef = useRef();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth * 0.8);
  const [height, setHeight] = useState(window.innerHeight * 0.8);
  const [zoomState, setZoomState] = useState(d3.zoomIdentity);

  // Define the zoom behavior
  const zoom = d3.zoom()
                 .scaleExtent([0.20, 2])
                 .on("zoom", (event) => {
                    setZoomState(event.transform);
                    d3.select(gRef.current).attr("transform", event.transform);
                 });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth * 0.8);
      setHeight(window.innerHeight * 0.8);
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize zoom behavior only once
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.call(zoom);
  }, []); // Empty dependency array to ensure this runs only once

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
                  .attr("width", width)
                  .attr("height", height);

    const g = svg.append("g").attr("ref", gRef).attr("transform", zoomState);

    // Create a tree layout
    const tree = d3.tree().size([height, width]);
    const root = d3.hierarchy(data);
    tree(root);

    // Create curved links
    const links = g.selectAll(".link")
                   .data(root.descendants().slice(1))
                   .enter().append("path")
                   .attr("class", "link")
                   .attr("d", d => {
                       return "M" + d.y + "," + d.x
                           + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                           + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                           + " " + d.parent.y + "," + d.parent.x;
                   })
                   .attr("fill", "none")
                   .attr("stroke", "#ccc")
                   .attr("stroke-width", 5); 

    // Create nodes
    const nodes = g.selectAll(".node")
                   .data(root.descendants())
                   .enter().append("g")
                   .attr("class", "node")
                   .attr("transform", d => `translate(${d.y},${d.x})`)
                   .style("cursor", "pointer");

    // Add circles for nodes
    nodes.append("circle")
         .attr("r", 130)
         .attr("fill", "blue")
         .on("click", (event, d) => {
              setSelectedTopic(d.data.name); // Assuming the topic is in 'name'
              setModalOpen(true);
         });

    // Add labels to nodes
    nodes.append("text")
         .attr("dy", ".35em")
         .style("text-anchor", "middle")
         .style("fill", "white") // Set text color to white
         .style("font-weight", "bold") // Make text bold
         .style("font-size", "42px")
         .text(d => d.data.name)
         .on("click", (event, d) => {
              setSelectedTopic(d.data.name); // Assuming the topic is in 'name'
              setModalOpen(true);
          });

    // Calculate the initial zoom level and translation to center on the root node
    if (zoomState === d3.zoomIdentity) {
        const initialScale = 0.45;
        const xCenterOffset = (width - initialScale * root.y) / 2;
        const yCenterOffset = (height - initialScale * (root.x)) / 2;
        svg.call(zoom.transform, d3.zoomIdentity.translate(xCenterOffset, yCenterOffset).scale(initialScale));
    } else {
        svg.call(zoom.transform, zoomState);
    }

  }, [data, width, height, zoom, zoomState]);

  return (
    <>
      <svg ref={svgRef} style={{ border: "1px solid black", cursor: "grab" }}>
        <g ref={gRef}></g>
      </svg>
      <ConversationModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        topic={selectedTopic} 
      />
    </>
  );
};

export default ProgressionPathTree;