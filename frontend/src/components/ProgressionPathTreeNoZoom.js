import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const ProgressionPathTree = ({ data }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const width = 600; // Set your desired width
    const height = 600; // Set your desired height

    // Create a tree layout
    const tree = d3.tree().size([height, width]);
    const root = d3.hierarchy(data);
    tree(root);

    // Create an SVG container
    const svg = d3.select("#progression-tree")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", "translate(120,0)"); // Adjust as needed

// Create curved links
    const links = svg.selectAll(".link")
                  .data(root.descendants().slice(1))
                  .enter().append("path")
                  .attr("class", "link")
                  .attr("d", d => {
                      return "M" + d.y + "," + d.x
                          + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                          + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                          + " " + d.parent.y + "," + d.parent.x;
                  })
                  .attr("fill", "none") // Ensure no fill for the path
                  .attr("stroke", "#ccc") // Color of the line
                  .attr("stroke-width", 5); // Width of the line

    // Create nodes
    const nodes = svg.selectAll(".node")
                  .data(root.descendants())
                  .enter().append("g")
                  .attr("class", "node")
                  .attr("transform", d => `translate(${d.y},${d.x})`);

    // Add circles for nodes
    nodes.append("circle")
                  .attr("r", 50) // Radius of the circles
                  .attr("fill", "blue") // Fill color of the circles
                  .on("click", (event, d) => {
                      setSelectedTopic(d.data.name); // Assuming the topic is in 'name'
                      setModalOpen(true);
                  });

    // Add labels to nodes
    nodes.append("text")
                  .attr("dy", ".35em")
                  .style("text-anchor", "middle")
                  .style("fill", "white") // Set text color to white
                  .style("font-weight", "bold")
                  .text(d => d.data.name);
  }, [data]);

  return (
    <>
      <svg id="progression-tree"></svg>
      {/* Your Modal Component Here */}
    </>
  );
};

export default ProgressionPathTree;
