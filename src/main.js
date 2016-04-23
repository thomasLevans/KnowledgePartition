import d3 from 'd3';
import KnowledgePartition from './knowledge-partition';

const width = 500;
const height = 500;

const tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

const svg = d3.select('#vis')
  .append('svg')
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', `translate(${width/2},${height/2})`);

d3.json('../dat/sample.json', (err, root) => {
  if (err) {
    console.error(`Error loading data: ${err.message}`);
  } else {
    const kt = new KnowledgePartition(svg, root);
    kt.render();
  }
});
