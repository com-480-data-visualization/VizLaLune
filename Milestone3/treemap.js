(() => {

  // === Abbreviations map ===
  const ABBR = {
    "Alpine Skiing":                "ALP",
    "Biathlon":                     "BTH",
    "Bobsleigh":                    "BOB",
    "Cross-Country Skiing":         "XCS",
    "Curling":                      "CRL",
    "Figure Skating":               "FIG",
    "Freestyle Skiing":             "FRS",
    "Ice Hockey":                   "IHK",
    "Luge":                         "LGE",
    "Nordic Combined":              "NRC",
    "Short Track Speed Skating":    "STS",
    "Skeleton":                     "SKL",
    "Ski Jumping":                  "SKJ",
    "Ski Mountaineering":           "SKM",
    "Snowboard":                    "SNB",
    "Speed Skating":                "SPD",
  };

  // === Dimensions ===
  const containerEl = document.getElementById("treemap");
  const width = containerEl.getBoundingClientRect().width;
  const height = Math.round(width * 0.6);

  // === Create SVG ===
  const container = d3.select("#treemap");
  container.selectAll("*").remove();

  const svg = container
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%")
    .attr("height", height)
    .style("border-radius", "14px")
    .style("overflow", "hidden");

  // === Tooltip ===
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "treemap-tooltip")
    .style("position", "absolute")
    .style("background", "rgba(20,20,20,0.92)")
    .style("color", "white")
    .style("padding", "10px 14px")
    .style("border-radius", "8px")
    .style("font-size", "13px")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("box-shadow", "0 4px 12px rgba(0,0,0,0.3)")
    .style("line-height", "1.6");

  // === Load athletes.csv ===
  d3.csv("../DataPreprocessing/athletes.csv").then(data => {

    const disciplineMap = new Map();

    data.forEach(athlete => {
      try {
        const participations = Function('return (' + athlete.events + ')')();
        const uniqueEvents = [
          ...new Set(participations.map(p => p.discipline + "||" + p.event))
        ];
        uniqueEvents.forEach(entry => {
          const [discipline, event] = entry.split("||");
          if (!event || event.trim() === "") return;
          if (!disciplineMap.has(discipline)) disciplineMap.set(discipline, new Map());
          const eventMap = disciplineMap.get(discipline);
          if (!eventMap.has(event)) eventMap.set(event, 0);
          eventMap.set(event, eventMap.get(event) + 1);
        });
      } catch { return; }
    });

    // === Hierarchy with sqrt scale ===
    const hierarchyData = {
      name: "Olympics",
      children: Array.from(disciplineMap, ([discipline, events]) => ({
        name: discipline,
        children: Array.from(events, ([event, count]) => ({
          name: event,
          rawValue: count,
          value: Math.sqrt(count)
        }))
      }))
    };

    const root = d3.hierarchy(hierarchyData)
      .sum(d => d.value || 0)
      .sort((a, b) => b.value - a.value);

    d3.treemap()
      .size([width, height])
      .paddingOuter(10)
      .paddingTop(42)
      .paddingInner(3)
      .round(true)(root);

    // === Color palette ===
    const palette = [
      "#4e79a7","#f28e2b","#e15759","#76b7b2",
      "#59a14f","#edc948","#b07aa1","#ff9da7",
      "#9c755f","#bab0ac","#d37295","#a0cbe8",
      "#ffbe7d","#8cd17d","#b6992d","#499894"
    ];
    const disciplines = root.children.map(d => d.data.name);
    const color = d3.scaleOrdinal().domain(disciplines).range(palette);

    // === Discipline background ===
    svg.selectAll(".discipline-bg")
      .data(root.children)
      .join("rect")
      .attr("class", "discipline-bg")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.data.name))
      .attr("opacity", 0.10)
      .attr("rx", 6);

    // === Leaf groups ===
    const leaves = svg.selectAll(".leaf")
      .data(root.leaves())
      .join("g")
      .attr("class", "leaf")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    // === Leaf rectangles ===
    leaves.append("rect")
      .attr("width", d => Math.max(0, d.x1 - d.x0))
      .attr("height", d => Math.max(0, d.y1 - d.y0))
      .attr("fill", d => color(d.parent.data.name))
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .attr("rx", 4)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.75);
        tooltip
          .style("opacity", 1)
          .html(`
            <strong style="font-size:14px">${d.data.name}</strong><br>
            <span style="opacity:0.7">Discipline:</span> ${d.parent.data.name}<br>
            <span style="opacity:0.7">Athletes:</span> <strong>${d.data.rawValue}</strong>
          `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", `${event.pageX + 14}px`)
          .style("top", `${event.pageY - 10}px`);
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
      });

    // === Leaf labels ===
    leaves.each(function(d) {
      const g = d3.select(this);
      const w = d.x1 - d.x0;
      const h = d.y1 - d.y0;

      if (w < 12 || h < 10) return;

      let label = d.data.name
        .replace("Men's ", "M ")
        .replace("Women's ", "W ")
        .replace("Mixed Team ", "Mix ");

      const fontSize = w > 90 ? 11 : w > 55 ? 10 : w > 35 ? 9 : w > 20 ? 8 : 7;
      const lineHeight = fontSize + 3;
      const maxLines = Math.max(1, Math.floor((h - 6) / lineHeight));
      const padding = 4;
      const words = label.split(/\s+/);

      const text = g.append("text")
        .attr("x", padding)
        .attr("y", fontSize + padding)
        .attr("fill", "white")
        .attr("font-size", `${fontSize}px`)
        .attr("font-weight", "600")
        .style("text-shadow", "0 1px 3px rgba(0,0,0,0.7)");

      let line = [], lineNumber = 0;
      let tspan = text.append("tspan")
        .attr("x", padding)
        .attr("y", fontSize + padding);

      for (const word of words) {
        line.push(word);
        tspan.text(line.join(" "));

        if (tspan.node().getComputedTextLength() > w - padding * 2) {
          line.pop();
          if (line.length === 0) {
            tspan.text(word);
            while (
              tspan.node().getComputedTextLength() > w - padding * 2
              && tspan.text().length > 1
            ) {
              tspan.text(tspan.text().slice(0, -1));
            }
            if (tspan.text().length < word.length) {
              tspan.text(tspan.text() + "…");
            }
            lineNumber++;
            if (lineNumber >= maxLines) break;
            line = [];
            tspan = text.append("tspan")
              .attr("x", padding)
              .attr("y", fontSize + padding + lineNumber * lineHeight);
          } else {
            tspan.text(line.join(" "));
            line = [word];
            lineNumber++;
            if (lineNumber >= maxLines) {
              const lastTspan = text.selectAll("tspan").filter((_, i, nodes) => i === nodes.length - 1);
              lastTspan.text(lastTspan.text() + "…");
              break;
            }
            tspan = text.append("tspan")
              .attr("x", padding)
              .attr("y", fontSize + padding + lineNumber * lineHeight)
              .text(word);
          }
        }
      }

      const rendered = text.selectAll("tspan").nodes()
        .some(n => n.textContent.trim().length > 0);
      if (!rendered) text.remove();
    });

    // === Discipline labels: full name → 2-line wrap → abbreviation ===
    const abbreviatedDisciplines = [];

    svg.selectAll(".discipline-label")
      .data(root.children)
      .join("text")
      .attr("class", "discipline-label")
      .attr("fill", "#111")
      .attr("font-weight", "800")
      .each(function(d) {
        const el = d3.select(this);
        const boxW = d.x1 - d.x0;
        const fullName = d.data.name;
        const abbr = ABBR[fullName] || fullName;

        // 1) Try single-line with decreasing font sizes
        const fontSizes = [14, 12, 11, 10];
        let usedSize = 10;
        let wasAbbreviated = true;

        for (const fs of fontSizes) {
          el.attr("font-size", `${fs}px`).text(fullName);
          if (this.getComputedTextLength() <= boxW - 14) {
            el.attr("x", d.x0 + 8).attr("y", d.y0 + fs + 6).text(fullName);
            usedSize = fs;
            wasAbbreviated = false;
            break;
          }
        }

        // 2) Try 2-line wrap
        if (wasAbbreviated) {
          const words = fullName.split(" ");
          const mid = Math.ceil(words.length / 2);
          const line1 = words.slice(0, mid).join(" ");
          const line2 = words.slice(mid).join(" ");

          el.attr("font-size", "10px").text(line1);
          if (this.getComputedTextLength() <= boxW - 14) {
            el.text("");
            el.append("tspan")
              .attr("x", d.x0 + 8)
              .attr("y", d.y0 + 16)
              .text(line1);
            if (line2) {
              el.append("tspan")
                .attr("x", d.x0 + 8)
                .attr("y", d.y0 + 28)
                .text(line2);
            }
            wasAbbreviated = false;
          }
        }

        // 3) Fall back to abbreviation
        if (wasAbbreviated) {
          el.attr("font-size", "11px")
            .attr("x", d.x0 + 8)
            .attr("y", d.y0 + 17)
            .text(abbr);
          abbreviatedDisciplines.push({ name: fullName, abbr, color: color(fullName) });
        }
      });

    // === Scale note ===
    d3.select("#treemap")
      .append("div")
      .style("text-align", "center")
      .style("font-size", "10px")
      .style("color", "#aaa")
      .style("margin-top", "4px")
      .style("padding-left", "8px")
      .text("* Area ∝ √athletes");

    // === LEGEND — only abbreviated disciplines ===
    if (abbreviatedDisciplines.length > 0) {
      const legendContainer = d3.select("#treemap")
        .append("div")
        .style("display", "flex")
        .style("flex-wrap", "wrap")
        .style("gap", "6px 24px")
        .style("margin-top", "12px")
        .style("padding", "10px 16px")
        .style("background", "#f9f9f9")
        .style("border-radius", "10px")
        .style("border", "1px solid #e0e0e0")
        .style("font-size", "13px")
        .style("font-family", "sans-serif");

      legendContainer.append("div")
        .style("width", "100%")
        .style("font-weight", "700")
        .style("color", "#555")
        .style("margin-bottom", "4px")
        .style("font-size", "11px")
        .style("text-transform", "uppercase")
        .style("letter-spacing", "0.5px")
        .text("Abbreviations");

      abbreviatedDisciplines.forEach(({ name, abbr, color }) => {
        const item = legendContainer.append("div")
          .style("display", "flex")
          .style("align-items", "center")
          .style("gap", "6px");

        item.append("div")
          .style("width", "12px")
          .style("height", "12px")
          .style("border-radius", "3px")
          .style("background", color)
          .style("flex-shrink", "0");

        item.append("span")
          .style("font-weight", "700")
          .style("color", "#333")
          .text(abbr);

        item.append("span")
          .style("color", "#888")
          .text(" — " + name);
      });
    }

  });

})();