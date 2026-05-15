// ─── BARCHART.JS — Figure 2.1 : Athletes per discipline ───────────────────

const bcWidth = 380;
const bcHeight = 420;
const bcMargin = { top: 30, right: 30, bottom: 20, left: 150 };
const bcInner = {
    w: bcWidth - bcMargin.left - bcMargin.right,
    h: bcHeight - bcMargin.top - bcMargin.bottom
};

const bcSvg = d3.select("#figure2_1")
    .attr("width", bcWidth)
    .attr("height", bcHeight)
    .style("display", "block")
    .style("background", "#0a1628");

const bcG = bcSvg.append("g")
    .attr("transform", `translate(${bcMargin.left},${bcMargin.top})`);

const xScale = d3.scaleLinear().range([0, bcInner.w]);
const yScale = d3.scaleBand().range([0, bcInner.h]).padding(0.25);

const xAxisG = bcG.append("g").attr("transform", `translate(0,${bcInner.h})`);
const yAxisG = bcG.append("g");

const bcTitle = bcSvg.append("text")
    .attr("x", bcWidth / 2)
    .attr("y", 18)
    .attr("text-anchor", "middle")
    .style("fill", "#e8eaf0")
    .style("font-size", "13px")
    .style("font-weight", "bold");

// Tooltip bar chart
const bcTooltip = d3.select("body")
    .append("div")
    .attr("class", "bc-tooltip")
    .style("position", "fixed")
    .style("background", "rgba(9, 31, 54, 0.95)")
    .style("color", "#e8eaf0")
    .style("padding", "6px 12px")
    .style("border-radius", "6px")
    .style("font-size", "13px")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("border", "1px solid #1295af");

function parseDisciplineBC(d) {
    try {
        const match = d.events.match(/'discipline':\s*'([^']+)'/);
        return match ? match[1] : "Unknown";
    } catch {
        return "Unknown";
    }
}

function updateBarChart(athletesData, countryCode) {
    bcTitle.text(countryCode ? `${countryNames[countryCode] || countryCode}` : "All countries");

    const filtered = countryCode
        ? athletesData.filter(d => d.country_code === countryCode)
        : athletesData;

    const disciplineCounts = d3.rollup(
        filtered,
        v => v.length,
        d => parseDisciplineBC(d)
    );

    const data = Array.from(disciplineCounts, ([discipline, count]) => ({
        discipline, count
    }))
    .filter(d => d.discipline !== "Unknown")
    .sort((a, b) => a.count - b.count);

    xScale.domain([0, d3.max(data, d => d.count)]).nice();
    yScale.domain(data.map(d => d.discipline));

    // Axe X
    xAxisG.transition().duration(500)
        .call(d3.axisBottom(xScale).ticks(4).tickSize(-bcInner.h))
        .selectAll("text")
        .style("fill", "#a0b4c8")
        .style("font-size", "10px");

    xAxisG.selectAll(".tick line")
        .style("stroke", "#1a2e4a")
        .style("stroke-dasharray", "3,3");

    xAxisG.select(".domain").style("stroke", "#2a4a6a");

    // Axe Y
    yAxisG.transition().duration(500)
        .call(d3.axisLeft(yScale).tickSize(0))
        .selectAll("text")
        .style("fill", "#a0b4c8")
        .style("font-size", "10px");

    yAxisG.select(".domain").remove();

    // Barres
    bcG.selectAll(".bar")
        .data(data, d => d.discipline)
        .join(
            enter => enter.append("rect")
                .attr("class", "bar")
                .attr("x", 0)
                .attr("y", d => yScale(d.discipline))
                .attr("width", 0)
                .attr("height", yScale.bandwidth())
                .attr("fill", "#4a9eff")
                .attr("rx", 3)
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("fill", "#7ac4ff");
                    bcTooltip.style("opacity", 1)
                        .html(`<strong>${d.discipline}</strong><br>${d.count} athletes`);
                })
                .on("mousemove", function(event) {
                    bcTooltip
                        .style("left", (event.clientX + 14) + "px")
                        .style("top", (event.clientY - 10) + "px");
                })
                .on("mouseout", function() {
                    d3.select(this).attr("fill", "#4a9eff");
                    bcTooltip.style("opacity", 0);
                })
                .transition().duration(600)
                .attr("width", d => xScale(d.count)),

            update => update
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("fill", "#7ac4ff");
                    bcTooltip.style("opacity", 1)
                        .html(`<strong>${d.discipline}</strong><br>${d.count} athletes`);
                })
                .on("mousemove", function(event) {
                    bcTooltip
                        .style("left", (event.clientX + 14) + "px")
                        .style("top", (event.clientY - 10) + "px");
                })
                .on("mouseout", function() {
                    d3.select(this).attr("fill", "#4a9eff");
                    bcTooltip.style("opacity", 0);
                })
                .transition().duration(600)
                .attr("y", d => yScale(d.discipline))
                .attr("height", yScale.bandwidth())
                .attr("width", d => xScale(d.count)),

            exit => exit
                .transition().duration(300)
                .attr("width", 0)
                .remove()
        );
}