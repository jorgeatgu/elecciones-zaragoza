const districtStack = (csvFile, district) => {
    const margin = { top: 24, right: 8, bottom: 24, left: 32 };
    let width = 0;
    let height = 0;
    const chart = d3.select(`.district-zgz-${district}`);
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const bisectDate = d3.bisector((d) => d.year).left;
    const tooltipStack = chart
        .append('div')
        .attr('class', 'tooltip tooltip-stack')
        .style('opacity', 0);

    const setupScales = () => {
        const countX = d3.scaleTime().domain(d3.extent(dataz, (d) => d.year));

        const countY = d3.scaleLinear().domain([0, 100]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select(`.district-zgz-${district}-container`);

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', `district-zgz-${district}-container-bis`);
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat(d3.format('d'))
            .tickPadding(7)
            .ticks(10);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat((d) => d + '%')
            .tickSizeInner(-width)
            .ticks(12);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 400;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select(`.district-zgz-${district}-container`);

        g.attr('transform', translate);

        g.append('rect').attr('class', 'overlay-dos');

        g.append('g')
            .attr('class', 'focus')
            .style('display', 'none')
            .append('line')
            .attr('class', 'x-hover-line hover-line')
            .attr('y1', 0);

        const keys = dataz.columns.slice(1);

        const area = d3
            .area()
            .x((d, i) => scales.count.x(d.data.year))
            .y0((d) => scales.count.y(d[0]))
            .y1((d) => scales.count.y(d[1]))
            .curve(d3.curveCardinal.tension(0.6));

        const stack = d3
            .stack()
            .keys(keys)
            .order(d3.stackOrderInsideOut);

        const stackedData = stack(dataz);

        const colors = d3
            .scaleOrdinal()
            .domain(keys)
            .range(['#00B6FE', '#E00F20']);

        updateScales(width, height);

        const container = chart.select(
            `.district-zgz-${district}-container-bis`
        );

        const layer = container.selectAll('.area-stack').data(stackedData);

        const newLayer = layer
            .enter()
            .append('path')
            .attr('class', 'area-stack');

        layer
            .merge(newLayer)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .style('fill', (d) => colors(d.key))
            .attr('d', area);

        const focus = g.select('.focus');

        const overlay = g.select('.overlay-dos');

        focus.select('.x-hover-line').attr('y2', height);

        overlay
            .attr('width', width + margin.left + margin.right)
            .attr('height', height)
            .on('mouseover', function() {
                focus.style('display', null);
            })
            .on('mouseout', function() {
                focus.style('display', 'none');
                tooltipStack.style('opacity', 0);
            })
            .on('mousemove', mousemove);

        function mousemove() {
            const w = chart.node().offsetWidth;
            var x0 = scales.count.x.invert(d3.mouse(this)[0]),
                i = bisectDate(dataz, x0, 1),
                d0 = dataz[i - 1],
                d1 = dataz[i],
                d = x0 - d0.year > d1.year - x0 ? d1 : d0;
            const positionX = scales.count.x(d.year);

            tooltipStack
                .style('opacity', 1)
                .html(
                    `
                          <span class="tooltip-stack-number tooltip-stack-text">${
                              d.year
                          }</span>
                          <span class="tooltip-stack-text">PP: <span class="tooltip-number">${
                              d.pp
                          }%</span></span>
                          <span class="tooltip-stack-text">PSOE: <span class="tooltip-number">${
                              d.psoe
                          }%</span></span>
                          `
                )
                .style('top', '25%')
                .style('left', positionX + 'px');

            focus
                .select('.x-hover-line')
                .attr('transform', `translate(${scales.count.x(d.year)},${0})`);
        }

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv(csvFile, (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;

                dataz.forEach((d) => {
                    d.year = d.year;
                    d.pp = d.pp;
                    d.psoe = d.psoe;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

const totalParties = [
    ['csv/total-actur.csv', 'actur'],
    ['csv/total-aljaferia.csv', 'aljaferia'],
    ['csv/total-casco.csv', 'casco'],
    ['csv/total-centro.csv', 'centro'],
    ['csv/total-delicias.csv', 'delicias'],
    ['csv/total-las-fuentes.csv', 'las-fuentes'],
    ['csv/total-san-jose.csv', 'san-jose'],
    ['csv/total-torrero.csv', 'torrero'],
    ['csv/total-universidad.csv', 'universidad'],
    ['csv/total-via-hispanidad.csv', 'via-hispanidad'],
    ['csv/total-zona-norte.csv', 'zona-norte'],
    ['csv/total-zona-oeste.csv', 'zona-oeste']
];

for (const args of totalParties) districtStack(...args);

function directionalDot() {
    const margin = {
        top: 48,
        right: 16,
        bottom: 32,
        left: 82
    };
    let width = 0;
    let height = 0;
    const chart = d3.select('.chart-diff');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    let symbolP = '%';
    const setupScales = () => {
        const countX = d3.scaleLinear().domain([0, 60]);

        const countY = d3.scaleBand().domain(dataz.map((d) => d.distrito));

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.chart-diff-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'chart-diff-container-bis');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([15, width]);
        scales.count.y.range([0, height - margin.bottom]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickPadding(15)
            .tickFormat((d) => d + symbolP)
            .ticks(12)
            .tickSizeInner(-height);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickPadding(5)
            .tickFormat((d) => d)
            .ticks(15)
            .tickSizeInner(-width);

        g.select('.axis-y')
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .call(axisY);
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.chart-diff-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.chart-diff-container-bis');

        const layerDos = container.selectAll('.circle-pp').data(dataz);

        layerDos.exit().remove();

        const layerTres = container.selectAll('.circle-psoe').data(dataz);

        layerTres.exit().remove();

        const layerCuatro = container.selectAll('.circle-up').data(dataz);

        layerCuatro.exit().remove();

        const layerCinco = container.selectAll('.circle-cs').data(dataz);

        layerCinco.exit().remove();

        const layerSeis = container.selectAll('.circle-vox').data(dataz);

        layerSeis.exit().remove();

        const newLayerDos = layerDos
            .enter()
            .append('circle')
            .attr('class', 'circle-PP');

        const newLayerTres = layerTres
            .enter()
            .append('circle')
            .attr('class', 'circle-PSOE');

        const newLayerCuatro = layerCuatro
            .enter()
            .append('circle')
            .attr('class', 'circle-UP');

        const newLayerCinco = layerCinco
            .enter()
            .append('circle')
            .attr('class', 'circle-CIUDADANOS');

        const newLayerSeis = layerSeis
            .enter()
            .append('circle')
            .attr('class', 'circle-VOX');

        layerDos
            .merge(newLayerDos)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('r', 6)
            .attr('cy', (d) => scales.count.y(d.distrito) + 20)
            .attr('cx', (d) => scales.count.x(d.pp));

        layerTres
            .merge(newLayerTres)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('r', 6)
            .attr('cy', (d) => scales.count.y(d.distrito) + 20)
            .attr('cx', (d) => scales.count.x(d.psoe));

        layerCuatro
            .merge(newLayerCuatro)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('r', 6)
            .attr('cy', (d) => scales.count.y(d.distrito) + 20)
            .attr('cx', (d) => scales.count.x(d.up));

        layerCinco
            .merge(newLayerCinco)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('r', 6)
            .attr('cy', (d) => scales.count.y(d.distrito) + 20)
            .attr('cx', (d) => scales.count.x(d.ciudadanos));

        layerSeis
            .merge(newLayerSeis)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('r', 6)
            .attr('cy', (d) => scales.count.y(d.distrito) + 20)
            .attr('cx', (d) => scales.count.x(d.vox));

        const legend = svg
            .selectAll('.label')
            .data(dataz)
            .enter()
            .append('g')
            .attr('class', (d) => d.labels + ' container-labels')
            .attr('transform', (d, i) => `translate(${i * 100},${-160})`);

        legend
            .append('rect')
            .attr('x', margin.left + 20)
            .attr('y', margin.left - 8)
            .attr('width', 16)
            .attr('height', 16)

            .attr('class', 'legend-rect');

        legend
            .append('text')
            .attr('class', 'legend-text')
            .attr('x', margin.left + 40)
            .attr('y', margin.left)
            .attr('dy', '.35em')
            .text((d) => d.labels);

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv('csv/cis.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.pp = +d.pp;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
}

directionalDot();

const araStack = (csvFile, district) => {
    const margin = { top: 24, right: 8, bottom: 24, left: 32 };
    let width = 0;
    let height = 0;
    const chart = d3.select(`.district-ara-${district}`);
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const bisectDate = d3.bisector((d) => d.year).left;
    const tooltipStack = chart
        .append('div')
        .attr('class', 'tooltip tooltip-stack')
        .style('opacity', 0);

    const setupScales = () => {
        const countX = d3.scaleTime().domain(d3.extent(dataz, (d) => d.year));

        const countY = d3.scaleLinear().domain([0, 100]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select(`.district-ara-${district}-container`);

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', `district-ara-${district}-container-bis`);
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat(d3.format('d'))
            .tickPadding(7)
            .ticks(10);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat((d) => d + '%')
            .tickSizeInner(-width)
            .ticks(12);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 300;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select(`.district-ara-${district}-container`);

        g.attr('transform', translate);

        g.append('rect').attr('class', 'overlay-dos');

        g.append('g')
            .attr('class', 'focus')
            .style('display', 'none')
            .append('line')
            .attr('class', 'x-hover-line hover-line')
            .attr('y1', 0);

        const keys = dataz.columns.slice(1);

        const area = d3
            .area()
            .x((d, i) => scales.count.x(d.data.year))
            .y0((d) => scales.count.y(d[0]))
            .y1((d) => scales.count.y(d[1]))
            .curve(d3.curveCardinal.tension(0.6));

        const stack = d3
            .stack()
            .keys(keys)
            .order(d3.stackOrderInsideOut);

        const stackedData = stack(dataz);

        const colors = d3
            .scaleOrdinal()
            .domain(keys)
            .range(['#BC0712', '#F7CE57']);

        updateScales(width, height);

        const container = chart.select(
            `.district-ara-${district}-container-bis`
        );

        const layer = container.selectAll('.area-stack').data(stackedData);

        const newLayer = layer
            .enter()
            .append('path')
            .attr('class', 'area-stack');

        layer
            .merge(newLayer)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .style('fill', (d) => colors(d.key))
            .attr('d', area);

        const focus = g.select('.focus');

        const overlay = g.select('.overlay-dos');

        focus.select('.x-hover-line').attr('y2', height);

        overlay
            .attr('width', width + margin.left + margin.right)
            .attr('height', height)
            .on('mouseover', function() {
                focus.style('display', null);
            })
            .on('mouseout', function() {
                focus.style('display', 'none');
                tooltipStack.style('opacity', 0);
            })
            .on('mousemove', mousemove);

        function mousemove() {
            const w = chart.node().offsetWidth;
            var x0 = scales.count.x.invert(d3.mouse(this)[0]),
                i = bisectDate(dataz, x0, 1),
                d0 = dataz[i - 1],
                d1 = dataz[i],
                d = x0 - d0.year > d1.year - x0 ? d1 : d0;
            const positionX = scales.count.x(d.year);

            tooltipStack
                .style('opacity', 1)
                .html(
                    `
                          <span class="tooltip-stack-number tooltip-stack-text">${
                              d.year
                          }</span>
                          <span class="tooltip-stack-text">PAR: <span class="tooltip-number">${
                              d.par
                          }%</span></span>
                          <span class="tooltip-stack-text">CHA: <span class="tooltip-number">${
                              d.cha
                          }%</span></span>
                          `
                )
                .style('top', '25%')
                .style('left', positionX + 'px');

            focus
                .select('.x-hover-line')
                .attr('transform', `translate(${scales.count.x(d.year)},${0})`);
        }

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv(csvFile, (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;

                dataz.forEach((d) => {
                    d.year = d.year;
                    d.par = d.par;
                    d.cha = d.cha;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

const totalAra = [
    ['csv/total-actur-ara.csv', 'actur'],
    ['csv/total-aljaferia-ara.csv', 'aljaferia'],
    ['csv/total-casco-ara.csv', 'casco'],
    ['csv/total-centro-ara.csv', 'centro'],
    ['csv/total-delicias-ara.csv', 'delicias'],
    ['csv/total-las-fuentes-ara.csv', 'las-fuentes'],
    ['csv/total-san-jose-ara.csv', 'san-jose'],
    ['csv/total-torrero-ara.csv', 'torrero'],
    ['csv/total-universidad-ara.csv', 'universidad'],
    ['csv/total-via-hispanidad-ara.csv', 'via-hispanidad'],
    ['csv/total-zona-norte-ara.csv', 'zona-norte'],
    ['csv/total-zona-oeste-ara.csv', 'zona-oeste']
];

for (const args of totalAra) araStack(...args);

const gaviotas = () => {
    // Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = {
        top: 0,
        right: 48,
        bottom: 24,
        left: 24
    };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.caida-pp');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    let symbol = '%';

    // Escala para los ejes X e Y
    const setupScales = () => {
        const countX = d3.scaleLinear().domain([-10, 8]);

        const countY = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.total),
                d3.max(dataz, (d) => d.total)
            ]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.caida-pp-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'caida-pp-container-bis');
    };

    const updateScales = (width) => {
        scales.count.x.range([0, width]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat((d) => d + symbol)
            .ticks(6)
            .tickPadding(30);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height / 2})`)
            .call(axisX);
    };

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 208;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.caida-pp-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.caida-pp-container-bis');

        const layer = container.selectAll('.circles-max').data(dataz);

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', 'circles-max');

        layer
            .merge(newLayer)
            .attr('cx', (d) => scales.count.x(d.diferencia))
            .attr('cy', height / 2)
            .attr('r', 0)
            .transition()
            .delay((d, i) => i * 10)
            .duration(500)
            .attr('r', (d) => d.total / 2)
            .attr('fill', '#1FB7FB')
            .attr('fill-opacity', 0.6);

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    // LOAD THE DATA
    const loadData = () => {
        d3.csv('csv/caida-pp.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.diferencia = d.diferencia;
                    d.total = +d.total;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };
    window.addEventListener('resize', resize);
    loadData();
};

gaviotas();

const up = () => {
    // Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = {
        top: 0,
        right: 48,
        bottom: 24,
        left: 24
    };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.caida-up');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    let symbol = '%';

    // Escala para los ejes X e Y
    const setupScales = () => {
        const countX = d3.scaleLinear().domain([-10, 8]);

        const countY = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.total),
                d3.max(dataz, (d) => d.total)
            ]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.caida-up-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'caida-up-container-bis');
    };

    const updateScales = (width) => {
        scales.count.x.range([0, width]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat((d) => d + symbol)
            .ticks(6)
            .tickPadding(30);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height / 2})`)
            .call(axisX);
    };

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 208;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.caida-up-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.caida-up-container-bis');

        const layer = container.selectAll('.circles-max').data(dataz);

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', 'circles-max');

        layer
            .merge(newLayer)
            .attr('cx', (d) => scales.count.x(d.diferencia))
            .attr('cy', height / 2)
            .attr('r', 0)
            .transition()
            .delay((d, i) => i * 10)
            .duration(500)
            .attr('r', (d) => d.total / 2)
            .attr('fill', '#BA0D1C')
            .attr('fill-opacity', 0.6);

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    // LOAD THE DATA
    const loadData = () => {
        d3.csv('csv/caida-up.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.diferencia = d.diferencia;
                    d.total = +d.total;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };
    window.addEventListener('resize', resize);
    loadData();
};

up();

const scatterUP = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 48, left: 72 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.scatter-up');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    let symbol = '%';

    //Escala para los ejes X e Y
    const setupScales = () => {
        const countX = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.order),
                d3.max(dataz, (d) => d.order)
            ]);

        const countY = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.up * 1.5),
                d3.max(dataz, (d) => d.up * 1.5)
            ]);

        scales.count = { x: countX, y: countY };
    };

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {
        const g = svg.select('.scatter-up-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'scatter-up-container-bis');
    };

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    //Dibujando ejes
    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat((d) => d + symbol)
            .ticks(0);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat((d) => d + symbol)
            .tickSize(-width)
            .tickPadding(10)
            .ticks(10);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.scatter-up-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.scatter-up-container-bis');

        const layer = container.selectAll('.circle-desert').data(dataz);

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', 'circle-desert');

        layer
            .merge(newLayer)
            .attr('cx', (d) => scales.count.x(d.order))
            .attr('cy', (d) => scales.count.y(d.up))
            .attr('r', 3)
            .attr('fill', '#3B173A')
            .attr('fill-opacity', 0.8);

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    // LOAD THE DATA
    const loadData = () => {
        d3.csv('csv/up.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.up = +d.up;
                    d.order = +d.order;
                    d.distrito = +d.distrito;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

scatterUP();

const scatterPP = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 48, left: 72 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.scatter-pp');
    const svg = chart.select('svg');
    const scales = {};
    let symbol = '%';
    let dataz;

    //Escala para los ejes X e Y
    const setupScales = () => {
        const countX = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.order),
                d3.max(dataz, (d) => d.order)
            ]);

        const countY = d3.scaleLinear().domain([-40, 10]);

        scales.count = { x: countX, y: countY };
    };

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {
        const g = svg.select('.scatter-pp-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'scatter-pp-container-bis');
    };

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    //Dibujando ejes
    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat((d) => d + symbol)
            .ticks(0);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat((d) => d + symbol)
            .tickSize(-width)
            .tickPadding(10)
            .ticks(10);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.scatter-pp-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.scatter-pp-container-bis');

        const layer = container.selectAll('.circle-desert').data(dataz);

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', 'circle-desert');

        layer
            .merge(newLayer)
            .attr('cx', (d) => scales.count.x(d.order))
            .attr('cy', (d) => scales.count.y(d.pp))
            .attr('r', 3)
            .attr('fill', '#1FB7FB');

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    // LOAD THE DATA
    const loadData = () => {
        d3.csv('csv/pp.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.pp = +d.pp;
                    d.order = +d.order;
                    d.distrito = +d.distrito;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

scatterPP();

const scatterPSOE = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 48, left: 72 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.scatter-psoe');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    let symbol = '%';

    //Escala para los ejes X e Y
    const setupScales = () => {
        const countX = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.order),
                d3.max(dataz, (d) => d.order)
            ]);

        const countY = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.psoe * 1.5),
                d3.max(dataz, (d) => d.psoe * 1.5)
            ]);

        scales.count = { x: countX, y: countY };
    };

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {
        const g = svg.select('.scatter-psoe-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'scatter-psoe-container-bis');
    };

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    //Dibujando ejes
    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat(d3.format('d'))
            .ticks(0);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat((d) => d + symbol)
            .tickSize(-width)
            .tickPadding(10)
            .ticks(10);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.scatter-psoe-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.scatter-psoe-container-bis');

        const layer = container.selectAll('.circle-desert').data(dataz);

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', 'circle-desert');

        layer
            .merge(newLayer)
            .attr('cx', (d) => scales.count.x(d.order))
            .attr('cy', (d) => scales.count.y(d.psoe))
            .attr('r', 3)
            .attr('fill', '#E00F20');

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    // LOAD THE DATA
    const loadData = () => {
        d3.csv('csv/psoe.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.psoe = +d.psoe;
                    d.order = +d.order;
                    d.distrito = +d.distrito;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

scatterPSOE();

const scatterCs = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 48, left: 72 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.scatter-cs');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    let symbol = '%';

    //Escala para los ejes X e Y
    const setupScales = () => {
        const countX = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.order),
                d3.max(dataz, (d) => d.order)
            ]);

        const countY = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.cs * 1.5),
                d3.max(dataz, (d) => d.cs * 1.5)
            ]);

        scales.count = { x: countX, y: countY };
    };

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {
        const g = svg.select('.scatter-cs-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'scatter-cs-container-bis');
    };

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    //Dibujando ejes
    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat((d) => d + symbol)
            .ticks(0);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat((d) => d + symbol)
            .tickSize(-width)
            .tickPadding(10)
            .ticks(10);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.scatter-cs-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.scatter-cs-container-bis');

        const layer = container.selectAll('.circle-desert').data(dataz);

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', 'circle-desert');

        layer
            .merge(newLayer)
            .attr('cx', (d) => scales.count.x(d.order))
            .attr('cy', (d) => scales.count.y(d.cs))
            .attr('r', 3)
            .attr('fill', '#EE7A3F');

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    // LOAD THE DATA
    const loadData = () => {
        d3.csv('csv/cs.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.cs = +d.cs;
                    d.order = +d.order;
                    d.distrito = +d.distrito;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

scatterCs();

const scatterVox = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 48, left: 72 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.scatter-vox');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    let symbol = '%';

    //Escala para los ejes X e Y
    const setupScales = () => {
        const countX = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.order),
                d3.max(dataz, (d) => d.order)
            ]);

        const countY = d3
            .scaleLinear()
            .domain([0, d3.max(dataz, (d) => d.vox * 1.25)]);

        scales.count = { x: countX, y: countY };
    };

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {
        const g = svg.select('.scatter-vox-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'scatter-vox-container-bis');

    };

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    //Dibujando ejes
    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat((d) => d + symbol)
            .ticks(0);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat((d) => d + symbol)
            .tickSize(-width)
            .tickPadding(10)
            .ticks(10);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.scatter-vox-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.scatter-vox-container-bis');

        const layer = container.selectAll('.circle-desert').data(dataz);

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', 'circle-desert');

        layer
            .merge(newLayer)
            .attr('cx', (d) => scales.count.x(d.order))
            .attr('cy', (d) => scales.count.y(d.vox))
            .attr('r', 3)
            .attr('fill', '#6CB83F');

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    // LOAD THE DATA
    const loadData = () => {
        d3.csv('csv/vox.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.vox = +d.vox;
                    d.order = +d.order;
                    d.distrito = +d.distrito;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

scatterVox();


const ultraDerecha = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 48, left: 72 };
    let width = 0;
    let height = 0;
    let w = 0;
    let h = 0;
    const chart = d3.select('.scatter-ultra-derecha');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    let symbol = '%';

    //Escala para los ejes X e Y
    const setupScales = () => {
        const countX = d3
            .scaleLinear()
            .domain([
                d3.min(dataz, (d) => d.order),
                d3.max(dataz, (d) => d.order)
            ]);

        const countY = d3
            .scaleLinear()
            .domain([-40, 30]);

        scales.count = { x: countX, y: countY };
    };

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {
        const g = svg.select('.scatter-ultra-derecha-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'scatter-ultra-derecha-container-bis');

    };

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    //Dibujando ejes
    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat((d) => d + symbol)
            .ticks(0);

        g.select('.axis-x')
            .attr('transform', `translate(0,${height})`)
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat((d) => d + symbol)
            .tickSize(-width)
            .tickPadding(10)
            .ticks(10);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = `translate(${margin.left},${margin.top})`;

        const g = svg.select('.scatter-ultra-derecha-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.scatter-ultra-derecha-container-bis');

        const layer = container.selectAll('.circle-desert').data(dataz);

        const newLayer = layer
            .enter()
            .append('circle')
            .attr('class', 'circle-desert');

        layer
            .merge(newLayer)
            .attr('cx', (d) => scales.count.x(d.order))
            .attr('cy', (d) => scales.count.y(d.vox))
            .attr('r', 3)
            .attr('fill', '#6CB83F');

        const layerPP = container.selectAll('.circle-pp').data(dataz);

        const newLayerPP = layerPP
            .enter()
            .append('circle')
            .attr('class', 'circle-pp');

        layerPP
            .merge(newLayerPP)
            .attr('cx', (d) => scales.count.x(d.order))
            .attr('cy', (d) => scales.count.y(d.pp))
            .attr('r', 3)
            .attr('fill', '#2DB8F8');

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    // LOAD THE DATA
    const loadData = () => {
        d3.csv('csv/pp.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.vox = +d.vox;
                    d.pp = +d.pp;
                    d.order = +d.order;
                    d.distrito = +d.distrito;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

ultraDerecha();
