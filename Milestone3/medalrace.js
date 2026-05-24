(() => {

  const width = 1200;
  const height = 750;
  
  const margin = {
    top: 100,
    right: 100,
    bottom: 50,
    left: 160
  };
  
  // =============================
  // SVG
  // =============================
  const container = d3.select("#medalrace");
  
  container.selectAll("*").remove();
  
  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  // =============================
  // TOOLTIP
  // =============================
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "medal-tooltip");
  
  // =============================
  // COLORS
  // =============================
  const colors = {
    GOLD: "#d4af37",
    SILVER: "#c0c0c0",
    BRONZE: "#cd7f32"
  };
  
  // =============================
  // HEADER — all vertically centered at y=55
  // =============================
  const HEADER_Y = 55;
  
  // Date label (left)
  const dateLabel = svg.append("text")
    .attr("x", margin.left)
    .attr("y", HEADER_Y)
    .attr("text-anchor", "start")
    .attr("dominant-baseline", "middle")
    .attr("font-size", "32px")
    .attr("font-weight", "700")
    .attr("fill", "#666");
  
  // Title (center)
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", HEADER_Y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", "24px")
    .attr("font-weight", "700")
    .text("Olympic Medal Race");
  
  // Legend (right)
  const LEGEND_X = width - 380;
  const medals = ["GOLD", "SILVER", "BRONZE"];
  
  medals.forEach((medal, i) => {
    const offsetX = i * 120;
  
    // Color square centered at HEADER_Y
    svg.append("rect")
      .attr("x", LEGEND_X + offsetX)
      .attr("y", HEADER_Y - 8)
      .attr("width", 16)
      .attr("height", 16)
      .attr("rx", 3)
      .attr("fill", colors[medal]);
  
    // Label
    svg.append("text")
      .attr("x", LEGEND_X + offsetX + 22)
      .attr("y", HEADER_Y)
      .attr("dominant-baseline", "middle")
      .attr("font-size", "13px")
      .attr("font-weight", "600")
      .text(medal);
  });
  
  // =============================
  // LOAD CSV
  // =============================
  d3.csv("../DataPreprocessing/medallists.csv").then(data => {
  
    data.forEach(d => {
      d.dateObj = new Date(d.date);
      d.country = (d.country_code || "").trim();
      d.medal = (d.medal || "").trim().toUpperCase();
    });
  
    data = data.filter(d =>
      d.country &&
      d.medal &&
      d.date &&
      !isNaN(d.dateObj)
    );
  
    data.sort((a, b) => a.dateObj - b.dateObj);
  
    const uniqueDates = Array.from(
      new Set(data.map(d => d.date))
    );
  
    const medalState = new Map();
  
    const x = d3.scaleLinear()
      .range([margin.left, width - margin.right]);
  
    const y = d3.scaleBand()
      .range([margin.top, height - margin.bottom])
      .padding(0.2);
  
    const grid = svg.append("g").attr("class", "grid");
    const xAxis = svg.append("g");
    const yAxis = svg.append("g");
    const chartGroup = svg.append("g");
  
    function updateChart(currentDate) {
      const todayRows = data.filter(d => d.date === currentDate);
  
      todayRows.forEach(d => {
        if (!medalState.has(d.country)) {
          medalState.set(d.country, { GOLD: 0, SILVER: 0, BRONZE: 0 });
        }
        const obj = medalState.get(d.country);
        if (d.medal === "GOLD") obj.GOLD++;
        else if (d.medal === "SILVER") obj.SILVER++;
        else if (d.medal === "BRONZE") obj.BRONZE++;
      });
  
      const chartData = Array.from(
        medalState,
        ([country, medals]) => ({
          country,
          GOLD: medals.GOLD,
          SILVER: medals.SILVER,
          BRONZE: medals.BRONZE,
          total: medals.GOLD + medals.SILVER + medals.BRONZE
        })
      )
      .sort((a, b) => b.total - a.total)
      .slice(0, 15);
  
      x.domain([0, (d3.max(chartData, d => d.total) || 1) * 1.12]).nice();
      y.domain(chartData.map(d => d.country));
  
      const stack = d3.stack().keys(["GOLD", "SILVER", "BRONZE"]);
      const stackedData = stack(chartData);
  
      grid
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .transition().duration(700)
        .call(d3.axisBottom(x).ticks(6).tickSize(-(height - margin.top - margin.bottom)).tickFormat(""));
  
      xAxis
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .transition().duration(700)
        .call(d3.axisBottom(x).ticks(6));
  
      yAxis
        .attr("transform", `translate(${margin.left},0)`)
        .transition().duration(700)
        .call(d3.axisLeft(y));
  
      const layers = chartGroup.selectAll(".layer").data(stackedData, d => d.key);
  
      layers.enter().append("g").attr("class", "layer").merge(layers).attr("fill", d => colors[d.key]);
      layers.exit().remove();
  
      chartGroup.selectAll(".layer").each(function(layerData) {
        const rects = d3.select(this).selectAll("rect").data(layerData, d => d.data.country);
  
        rects.enter()
          .append("rect")
          .attr("x", d => x(d[0]))
          .attr("y", d => y(d.data.country))
          .attr("height", y.bandwidth())
          .attr("width", 0)
          .attr("rx", 4)
          .merge(rects)
          .on("mouseover", function(event, d) {
            d3.select(this).attr("opacity", 0.8).attr("stroke", "black").attr("stroke-width", 2);
            tooltip.style("opacity", 1).html(`
              <strong>${d.data.country}</strong><br>
              🥇 Gold: ${d.data.GOLD}<br>
              🥈 Silver: ${d.data.SILVER}<br>
              🥉 Bronze: ${d.data.BRONZE}<br>
              <strong>Total: ${d.data.total}</strong>
            `);
          })
          .on("mousemove", function(event) {
            tooltip.style("left", `${event.pageX + 12}px`).style("top", `${event.pageY + 12}px`);
          })
          .on("mouseout", function() {
            d3.select(this).attr("opacity", 1).attr("stroke", "none");
            tooltip.style("opacity", 0);
          })
          .transition().duration(700)
          .attr("x", d => x(d[0]))
          .attr("y", d => y(d.data.country))
          .attr("height", y.bandwidth())
          .attr("width", d => x(d[1]) - x(d[0]));
  
        rects.exit().remove();
      });
  
      const labels = svg.selectAll(".total-label").data(chartData, d => d.country);
  
      labels.enter()
        .append("text")
        .attr("class", "total-label")
        .merge(labels)
        .transition().duration(700)
        .attr("x", d => x(d.total) + 10)
        .attr("y", d => y(d.country) + y.bandwidth() / 2 + 5)
        .attr("font-size", "13px")
        .attr("font-weight", "700")
        .text(d => d.total);
  
      labels.exit().remove();
    }
  
    // =============================
    // INTERVAL RUNNER
    // =============================
    let currentIndex = 0;
    let activeInterval = null;
  
    function startRace() {
      activeInterval = d3.interval(() => {
        if (currentIndex >= uniqueDates.length) {
          activeInterval.stop();
          return;
        }
        const currentDate = uniqueDates[currentIndex];
        dateLabel.text(new Date(currentDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }));
        updateChart(currentDate);
        currentIndex++;
      }, 1000);
    }
  
    // =============================
    // REPLAY BUTTON
    // =============================
    container
    .append("button")
    .text("▶ Replay")
    .style("display", "block")
    .style("margin", "16px auto 0")
    .style("padding", "8px 28px")
    .style("font-size", "14px")
    .style("cursor", "pointer")
    .style("border", "none")
    .style("border-radius", "8px")
    .style("background", "#4e79a7")
    .style("color", "white")
    .style("font-weight", "700")
    .style("letter-spacing", "0.5px")
    .on("click", () => {
      resetRace();
      startRace();
    });
  
    // =============================
  // AUTO-START / RESTART WHEN SCROLLED INTO VIEW
  // =============================
  const medalRaceEl = document.getElementById('medalrace');
  let isVisible = false;

  function resetRace() {
    if (activeInterval) activeInterval.stop();
    medalState.clear();
    currentIndex = 0;
    dateLabel.text("");
    chartGroup.selectAll("*").remove();
    svg.selectAll(".total-label").remove();
    xAxis.selectAll("*").remove();
    yAxis.selectAll("*").remove();
    grid.selectAll("*").remove();
  }

  const raceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isVisible) {
        // Entered the view → restart from scratch
        isVisible = true;
        resetRace();
        startRace();
      } else if (!entry.isIntersecting && isVisible) {
        // Left the view → stop and reset (so it's ready for next visit)
        isVisible = false;
        resetRace();
      }
    });
  }, { threshold: 0.3 }); // triggers when 30% of the medal race is visible

  raceObserver.observe(medalRaceEl);
  
  });
  
  })();