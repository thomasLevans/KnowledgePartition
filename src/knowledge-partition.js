import d3 from 'd3';

export default class KnowledgePartition {

  /**
  * Initialization for d3 mechanisms to render the
  * partition layout
  *
  * @constructor
  */
  constructor(svg, data) {
    this.props = {
      width: 500,
      height: 500,
      legendSize: 10,
      radius: 225,
      legendLabels: {
        type: ['project','group','library','methodology','database','language'],
        proficiency: [
          { label: 'It\'s a Thing', value: 0},
          { label: 'Reasonably', value : 3},
          { label: 'I Got This', value: 6},
          { label: 'Ninja', value: 9},
          { label: 'Jedi', value: 12}
        ]
      }
    };
    this.data = data;
    this.svg = svg;
    const color = this.color = d3.scale.category20();
    const heat = d3.scale.linear()
      .domain([1,12])
      .range(['rgb(255, 255, 255)','rgb(255, 0, 0)']);


    const typeLegend = this.svg.selectAll('g.legend.type')
      .data(this.props.legendLabels.type)
      .enter()
      .append('g')
        .attr('class', 'legend.type')
        .attr('transform', (d, i) => {
          return `translate(-30,${-35+(i*1.5)*this.props.legendSize})`;
        });

    typeLegend.append('rect')
        .attr('width', this.props.legendSize)
        .attr('height', this.props.legendSize)
        .style('fill', color)
        .style('stroke', color);

    typeLegend.append('text')
        .attr('x', this.props.legendSize+4)
        .attr('y', this.props.legendSize-1)
        .text((d) => { return d; });

    const heatLegend = this.svg.selectAll('g.legend.proficiency')
        .data(this.props.legendLabels.proficiency)
        .enter()
        .append('g')
          .attr('class', 'legend.proficiency')
          .attr('transform', (d, i) => {
            return `translate(-20,${-30+(i*1.5)*this.props.legendSize})`;
          })
          .style('opacity', 0);

    heatLegend.append('rect')
        .attr('width', this.props.legendSize)
        .attr('height', this.props.legendSize)
        .style('fill', (d) => { return heat(d.value); })
        .style('stroke', 'rgb(153, 149, 149)');

    heatLegend.append('text')
        .attr('x', this.props.legendSize+4)
        .attr('y', this.props.legendSize-1)
        .text((d) => { return d.label; });

    this.partition = d3.layout.partition()
      .sort(null)
      .size([Math.PI * 2, Math.pow(this.props.radius, 2)])
      .value((d) => { return 1; });

    this.arc = d3.svg.arc()
      .startAngle((d) => { return d.x; })
      .endAngle((d) => { return d.x + d.dx; })
      .innerRadius((d) => { return Math.sqrt(d.y); })
      .outerRadius((d) => { return Math.sqrt(d.y + d.dy); });

    d3.selectAll('input')
      .on('change', function() {
        const val = this.value;

        d3.selectAll('path')
          .transition()
          .duration(400)
          .style('opacity', (d) => {
            return (val==='proficiency'&&(d.type==='group'||d.type==='project')) ? 0.4 : 1;
          })
          .style('fill', (d) => {
            return (val==='proficiency'&&d.type!=='project'&&d.type!=='group') ? heat(d.proficiency) : color(d.type);
          });

        heatLegend.transition()
          .duration(400)
          .style('opacity', (d) => { return val!=='type' ? 1 : 0; });

        typeLegend.transition()
          .duration(400)
          .style('opacity', (d) => { return val==='type' ? 1 : 0; });

      });
  }

  /**
  * Triggers the Enter, Update, Exit/Delete pattern
  *
  * @method*/
  render() {
    const tooltip = d3.select('.tooltip');

    this.svg.datum(this.data).selectAll('path')
      .data(this.partition.nodes)
      .enter()
      .append('path')
      .attr('display', (d) => { return d.depth ? null : 'none'; })
      .attr('d', this.arc)
      .on('mouseover', (d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.8);

        tooltip.html(`<h3>${d.name}</h3>`)
          .attr('width', (d.name.length + 20)+'px')
          .style('left', d3.event.pageX + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', (d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      })
      .style('stroke', 'white')
      .style('fill', (d) => {
        return this.color(d.type);
      })
      .style('fill-rule', 'evenodd');
  }
}
