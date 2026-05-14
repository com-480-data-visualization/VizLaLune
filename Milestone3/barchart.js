// ─── BARCHART.JS — Figure 2.1 : Athletes per discipline ───────────────────

const bcWidth = 700;
const bcHeight = 420;
const bcMargin = { top: 30, right: 30, bottom: 130, left: 70 };
const bcInner = {
    w: bcWidth - bcMargin.left - bcMargin.right,
    h: bcHeight - bcMargin.top - bcMargin.bottom
};

const bcSvg = d3.select("#figure2_1")
    .attr("width", bcWidth)
    .attr("height", bcHeight)
    .style("display", "block")
    .style("margin", "0 auto")
    .style("background", "#0a1628");

const bcG = bcSvg.append("g")
    .attr("transform", `translate(${bcMargin.left},${bcMargin.top})`);

// Axes
const xScale = d3.scaleBand().range([0, bcInner.w]).padding(0.3);
const yScale = d3.scaleLinear().range([bcInner.h, 0]);

const xAxisG = bcG.append("g")
    .attr("transform", `translate(0,${bcInner.h})`);

const yAxisG = bcG.append("g");

// Label Y
bcG.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -55)
    .attr("x", -bcInner.h / 2)
    .attr("text-anchor", "middle")
    .style("fill", "#a0b4c8")
    .style("font-size", "12px")
    .text("Number of athletes");

// Titre dynamique
const bcTitle = bcSvg.append("text")
    .attr("x", bcWidth / 2)
    .attr("y", 18)
    .attr("text-anchor", "middle")
    .style("fill", "#e8eaf0")
    .style("font-size", "14px")
    .style("font-weight", "bold");

// Helper : extrait la discipline depuis le champ events (string JSON)
window.getDiscipline = function getDiscipline(d) {
    try {
        const eventsStr = d.events.replace(/'/g, '"').replace(/\\"/g, '"');
        const events = JSON.parse(eventsStr);
        return events[0]?.discipline || "Unknown";
    } catch {
        return "Unknown";
    }
}

// Fonction principale : dessine/met à jour le bar chart
function updateBarChart(athletesData, countryCode) {

    // Titre
    bcTitle.text(countryCode
        ? `Athletes per discipline — ${countryCode}`
        : "Athletes per discipline — All countries"
    );

    // Filtre par pays si sélectionné
    const filtered = countryCode
        ? athletesData.filter(d => d.country_code === countryCode)
        : athletesData;

    // Agrège par discipline
    const disciplineCounts = d3.rollup(
        filtered,
        v => v.length,
        d => getDiscipline(d)
    );

    const data = Array.from(disciplineCounts, ([discipline, count]) => ({
        discipline, count
    }))
    .filter(d => d.discipline !== "Unknown")
    .sort((a, b) => b.count - a.count);

    // Met à jour les échelles
    xScale.domain(data.map(d => d.discipline));
    yScale.domain([0, d3.max(data, d => d.count)]).nice();

    // Axe X
    xAxisG.transition().duration(500)
        .call(d3.axisBottom(xScale).tickSize(0))
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .attr("text-anchor", "end")
        .attr("dx", "-0.4em")
        .attr("dy", "0.6em")
        .style("fill", "#a0b4c8")
        .style("font-size", "10px");

    xAxisG.select(".domain").style("stroke", "#2a4a6a");

    // Axe Y
    yAxisG.transition().duration(500)
        .call(d3.axisLeft(yScale).ticks(5).tickSize(-bcInner.w))
        .selectAll("text")
        .style("fill", "#a0b4c8")
        .style("font-size", "10px");

    yAxisG.selectAll(".tick line")
        .style("stroke", "#1a2e4a")
        .style("stroke-dasharray", "3,3");

    yAxisG.select(".domain").remove();

    // Barres
    bcG.selectAll(".bar")
        .data(data, d => d.discipline)
        .join(
            enter => enter.append("rect")
                .attr("class", "bar")
                .attr("x", d => xScale(d.discipline))
                .attr("y", bcInner.h)
                .attr("width", xScale.bandwidth())
                .attr("height", 0)
                .attr("fill", "#4a9eff")
                .attr("rx", 3)
                .transition().duration(600)
                .attr("y", d => yScale(d.count))
                .attr("height", d => bcInner.h - yScale(d.count)),

            update => update
                .transition().duration(600)
                .attr("x", d => xScale(d.discipline))
                .attr("width", xScale.bandwidth())
                .attr("y", d => yScale(d.count))
                .attr("height", d => bcInner.h - yScale(d.count))
                .attr("fill", "#4a9eff"),

            exit => exit
                .transition().duration(300)
                .attr("height", 0)
                .attr("y", bcInner.h)
                .remove()
        );
}

