// ─── WORLDMAP.JS — Figure 2.2 ─────────────────────────────────────────────

const mapContainer = document.getElementById('map-container');
const mapWidth = mapContainer.clientWidth || 750;
const mapHeight = Math.round(mapWidth * 0.56);

const mapSvg = d3.select("#figure2_2")
    .attr("width", mapWidth)
    .attr("height", mapHeight)
    .attr("viewBox", `0 0 ${mapWidth} ${mapHeight}`)
    .style("background", "#0a1628")
    .style("display", "block");

// Groupe zoomable (carte + dots + Milan)
const zoomG = mapSvg.append("g").attr("class", "zoom-group");

// Groupe fixe (légende uniquement)
const fixedG = mapSvg.append("g").attr("class", "fixed-group");

const projection = d3.geoNaturalEarth1()
  .scale(mapWidth / 6.3)
  .translate([mapWidth / 2, mapHeight / 2]);

const path = d3.geoPath().projection(projection);

const isoAlpha3ToNumeric = {
  "AFG":"004","ALB":"008","DZA":"012","AND":"020","AGO":"024","ARG":"032",
  "ARM":"051","AUS":"036","AUT":"040","AZE":"031","BEL":"056","BEN":"204",
  "BIH":"070","BOL":"068","BRA":"076","BGR":"100","BUL":"100","CAN":"124",
  "CHI":"152","CHL":"152","CHN":"156","COL":"170","CRI":"188","CRO":"191",
  "HRV":"191","CYP":"196","CZE":"203","DEN":"208","DNK":"208","ECU":"218",
  "EGY":"818","EST":"233","ETH":"231","FIN":"246","FRA":"250","GEO":"268",
  "GER":"276","DEU":"276","GBR":"826","GRE":"300","GRL":"304","GTM":"320",
  "HAI":"332","HKG":"344","HUN":"348","ISL":"352","IND":"356","IRI":"364",
  "IRN":"364","IRL":"372","ISR":"376","ITA":"380","JAM":"388","JPN":"392",
  "KAZ":"398","KEN":"404","KGZ":"417","KOR":"410","KOS":"926","KSA":"682",
  "SAU":"682","LAT":"428","LBN":"422","LIE":"438","LTU":"440","LUX":"442",
  "MAD":"450","MAR":"504","MAS":"458","MDA":"498","MEX":"484","MGL":"496",
  "MKD":"807","MLT":"470","MNE":"499","MON":"492","MCO":"492",
  "NED":"528","NLD":"528","NGR":"566","NGA":"566","NOR":"578","NZL":"554",
  "PAK":"586","PHI":"608","POL":"616","POR":"620","PRT":"620","PUR":"630",
  "ROU":"642","RSA":"710","ZAF":"710","RUS":"643","SGP":"702","SVK":"703",
  "SLO":"705","SVN":"705","SMR":"674","SRB":"688","SUI":"756","CHE":"756",
  "SWE":"752","SWK":"752","THA":"764","TTO":"780","TPE":"158","TWN":"158",
  "TUR":"792","UAE":"784","UKR":"804","URU":"858","USA":"840","UZB":"860",
  "VEN":"862","AIN":"000"
};

const countryNames = {
  "AFG":"Afghanistan","ALB":"Albania","DZA":"Algeria","AND":"Andorra",
  "AGO":"Angola","ARG":"Argentina","ARM":"Armenia","AUS":"Australia",
  "AUT":"Austria","AZE":"Azerbaijan","BEL":"Belgium","BEN":"Benin",
  "BIH":"Bosnia & Herzegovina","BOL":"Bolivia","BRA":"Brazil",
  "BGR":"Bulgaria","BUL":"Bulgaria","CAN":"Canada","CHI":"Chile",
  "CHL":"Chile","CHN":"China","COL":"Colombia","CRO":"Croatia",
  "HRV":"Croatia","CYP":"Cyprus","CZE":"Czech Republic","DEN":"Denmark",
  "DNK":"Denmark","ECU":"Ecuador","EST":"Estonia","FIN":"Finland",
  "FRA":"France","GEO":"Georgia","GER":"Germany","DEU":"Germany",
  "GBR":"Great Britain","GRE":"Greece","HAI":"Haiti","HKG":"Hong Kong",
  "HUN":"Hungary","ISL":"Iceland","IND":"India","IRI":"Iran",
  "IRN":"Iran","IRL":"Ireland","ISR":"Israel","ITA":"Italy",
  "JAM":"Jamaica","JPN":"Japan","KAZ":"Kazakhstan","KEN":"Kenya",
  "KGZ":"Kyrgyzstan","KOR":"South Korea","KOS":"Kosovo","KSA":"Saudi Arabia",
  "SAU":"Saudi Arabia","LAT":"Latvia","LBN":"Lebanon","LIE":"Liechtenstein",
  "LTU":"Lithuania","LUX":"Luxembourg","MAD":"Madagascar","MAR":"Morocco",
  "MAS":"Malaysia","MDA":"Moldova","MEX":"Mexico","MGL":"Mongolia",
  "MKD":"North Macedonia","MLT":"Malta","MNE":"Montenegro","MON":"Monaco",
  "MCO":"Monaco","NED":"Netherlands","NLD":"Netherlands","NGR":"Nigeria",
  "NGA":"Nigeria","NOR":"Norway","NZL":"New Zealand","PAK":"Pakistan",
  "PHI":"Philippines","POL":"Poland","POR":"Portugal","PRT":"Portugal",
  "PUR":"Puerto Rico","ROU":"Romania","RSA":"South Africa","ZAF":"South Africa",
  "SGP":"Singapore","SVK":"Slovakia","SLO":"Slovenia","SVN":"Slovenia",
  "SMR":"San Marino","SRB":"Serbia","SUI":"Switzerland","CHE":"Switzerland",
  "SWE":"Sweden","THA":"Thailand","TTO":"Trinidad & Tobago","TPE":"Chinese Taipei",
  "TWN":"Chinese Taipei","TUR":"Turkey","UAE":"UAE","UKR":"Ukraine",
  "URU":"Uruguay","USA":"United States","UZB":"Uzbekistan","VEN":"Venezuela",
  "AIN":"AIN"
};

const tooltip = d3.select("body")
  .append("div")
  .style("position", "fixed")
  .style("background", "rgba(10, 22, 40, 0.92)")
  .style("color", "#e8eaf0")
  .style("padding", "8px 12px")
  .style("border-radius", "6px")
  .style("font-size", "13px")
  .style("pointer-events", "none")
  .style("opacity", 0)
  .style("border", "1px solid rgba(255,255,255,0.1)");

function parseDiscipline(d) {
  try {
    const match = d.events.match(/'discipline':\s*'([^']+)'/);
    return match ? match[1] : "Unknown";
  } catch {
    return "Unknown";
  }
}

Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
  d3.csv("../DataPreprocessing/athletes.csv")
]).then(([world, athletes]) => {

  const coords = countriesCoords;

  window.mapCoords = coords;
  window.athletesData = athletes;
  updateBarChart(athletes, null);

  const athletesByCountry = d3.rollup(
    athletes, v => v.length, d => d.country_code
  );

  const maxAthletes = d3.max([...athletesByCountry.values()]);

  // Scale
  const colorScale = d3.scaleSequential()
    .domain([maxAthletes, 0])    
    .interpolator(d3.interpolateBlues);

  const countries = topojson.feature(world, world.objects.countries);

  // ── MAP ──────────────────────────────────────────────────────────────
  const countryPaths = zoomG.append("g")
    .selectAll("path")
    .data(countries.features)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const numId = String(+d.id).padStart(3, "0");
      const alpha3 = Object.keys(isoAlpha3ToNumeric)
        .find(k => isoAlpha3ToNumeric[k] === numId);
      const count = alpha3 ? (athletesByCountry.get(alpha3) || 0) : 0;
      return count > 0 ? colorScale(count) : "#1a2e4a";
    })
    .attr("stroke", "#2a4a6a")
    .attr("stroke-width", 0.5);

  // ── TOOLTIP + HOVER + CLICK ────────────────────────────────────────────
  countryPaths
    .on("mouseover", function(event, d) {
      const numId = String(+d.id).padStart(3, "0");
      const alpha3 = Object.keys(isoAlpha3ToNumeric)
        .find(k => isoAlpha3ToNumeric[k] === numId);
      const count = alpha3 ? (athletesByCountry.get(alpha3) || 0) : 0;
      if (count === 0) return;
      d3.select(this).attr("stroke", "white").attr("stroke-width", 1.5);

      const countryAthletes = athletes.filter(a => a.country_code === alpha3);
      const disciplineCount = d3.rollup(
        countryAthletes, v => v.length, a => parseDiscipline(a)
      );
      const topDiscipline = [...disciplineCount.entries()]
        .sort((a, b) => b[1] - a[1])[0];

      const men = countryAthletes.filter(a => a.gender === "M").length;
      const women = countryAthletes.filter(a => a.gender === "F").length;
      const pctMen = Math.round(men / count * 100);
      const pctWomen = Math.round(women / count * 100);

      tooltip.style("opacity", 1).html(`
        <div style="font-weight:bold;font-size:14px;margin-bottom:6px;color:#4a9eff">
          ${countryNames[alpha3] || alpha3}
        </div>
        <div><strong>${count}</strong> athletes</div>
        <div>Top sport: <strong>${topDiscipline ? topDiscipline[0] : "—"}</strong></div>
        <div>Men: <strong>${men}</strong> (${pctMen}%)</div>
        <div>Women: <strong>${women}</strong> (${pctWomen}%)</div>
      `);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", (event.clientX + 14) + "px")
        .style("top", (event.clientY - 10) + "px");
    })
    .on("mouseout", function() {
      if (!d3.select(this).classed("selected")) {
        d3.select(this).attr("stroke", "#2a4a6a").attr("stroke-width", 0.5);
      }
      tooltip.style("opacity", 0);
    })
    .on("click", function(event, d) {
      const numId = String(+d.id).padStart(3, "0");
      const alpha3 = Object.keys(isoAlpha3ToNumeric)
        .find(k => isoAlpha3ToNumeric[k] === numId);
      const count = alpha3 ? (athletesByCountry.get(alpha3) || 0) : 0;
      if (count === 0) return;

      const isSame = d3.select(this).classed("selected");
      countryPaths.classed("selected", false)
        .attr("stroke", "#2a4a6a").attr("stroke-width", 0.5);

      if (!isSame) {
        d3.select(this).classed("selected", true)
          .attr("stroke", "white").attr("stroke-width", 2);
        updateBarChart(athletes, alpha3);
      } else {
        updateBarChart(athletes, null);
      }
    });

  // ── DOTS (in zoomG) ──────────────────────────────────────────────────
  const milanXY = projection([9.19, 45.46]);
  const dotsGroup = zoomG.append("g").attr("class", "dots");

  const allDots = [];
  athletesByCountry.forEach((count, code) => {
    const latLng = coords[code];
    if (!latLng) return;
    const xy = projection([latLng[1], latLng[0]]);
    if (!xy) return;

    const countryAthletes = athletes.filter(a => a.country_code === code);
    countryAthletes.forEach(athlete => {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * Math.min(4, Math.sqrt(count) * 0.4);
      const ox = xy[0] + Math.cos(angle) * radius;
      const oy = xy[1] + Math.sin(angle) * radius;
      allDots.push({ code, count, gender: athlete.gender, x: ox, y: oy, originX: ox, originY: oy });
    });
  });

  dotsGroup.selectAll("circle")
    .data(allDots)
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 2)
    .attr("fill", "rgba(255, 200, 50, 0.7)")
    .attr("stroke", "none");

  // ── MARKER MILAN (in zoomG) ────────────────────────────────────────
  const milanG = zoomG.append("g")
    .attr("transform", `translate(${milanXY[0]}, ${milanXY[1]})`);

  milanG.append("circle")
    .attr("r", 8)
    .attr("fill", "rgba(255, 80, 80, 0.3)")
    .attr("stroke", "#ff5050")
    .attr("stroke-width", 1.5);

  milanG.append("text")
    .attr("text-anchor", "middle").attr("dy", "4px")
    .style("font-size", "10px").text("★");

  milanG.append("text")
    .attr("text-anchor", "middle").attr("dy", "-12px")
    .style("fill", "white").style("font-size", "10px")
    .style("font-weight", "bold").text("Milano");

  // ── LEGEND ──────────────────────────────────────────────
  const legend = fixedG.append("g")
    .attr("transform", `translate(20, ${mapHeight - 100})`);

  legend.append("text")
    .attr("x", 0).attr("y", 0)
    .style("fill", "#e8eaf0").style("font-size", "11px")
    .style("font-weight", "bold").text("Athletes per country");

  const defs = mapSvg.append("defs");
  const linearGradient = defs.append("linearGradient")
    .attr("id", "legend-gradient");

  // Legend
  linearGradient.selectAll("stop")
    .data([
      { offset: "0%", color: colorScale(maxAthletes) },   
      { offset: "50%", color: colorScale(maxAthletes / 2) },
      { offset: "100%", color: colorScale(0) }            
    ])
    .join("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

  legend.append("rect")
    .attr("x", 0).attr("y", 8)
    .attr("width", 150).attr("height", 10)
    .style("fill", "url(#legend-gradient)").attr("rx", 2);

    legend.append("text").attr("x", 0).attr("y", 30)
    .style("fill", "#a0b4c8").style("font-size", "10px").text(`${maxAthletes} athletes`);  

    legend.append("text").attr("x", 150).attr("y", 30)
    .attr("text-anchor", "end")
    .style("fill", "#a0b4c8").style("font-size", "10px")
    .text("0");

  legend.append("circle")
    .attr("cx", 0).attr("cy", 55).attr("r", 5)
    .attr("fill", "rgba(255, 200, 50, 0.7)").attr("stroke", "none");

  legend.append("text").attr("x", 12).attr("y", 59)
    .style("fill", "#a0b4c8").style("font-size", "10px")
    .text("1 dot = 1 athlete");

  // ── ZOOM ───────────────────────────────────────────────────────────────
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", function(event) {
      zoomG.attr("transform", event.transform);
      countryPaths.attr("stroke-width", 0.5 / event.transform.k);
      dotsGroup.selectAll("circle").attr("r", 2 / event.transform.k);
      milanG.select("circle").attr("r", 8 / event.transform.k);
      milanG.selectAll("text").style("font-size", `${10 / event.transform.k}px`);
    });

  mapSvg.call(zoom);

  d3.select("#btn-reset-zoom").on("click", function() {
    mapSvg.transition().duration(750)
      .call(zoom.transform, d3.zoomIdentity);
  });

  // ── BOUTONS SEND / RESET ───────────────────────────────────────────────
  d3.select("#btn-send").on("click", function() {
    dotsGroup.selectAll("circle")
      .transition().duration(2000)
      .delay(() => Math.random() * 1500)
      .ease(d3.easeCubicInOut)
      .attr("cx", milanXY[0]).attr("cy", milanXY[1])
      .attr("r", 1.5).attr("fill", "rgba(255, 200, 50, 0.4)");
  });

  d3.select("#btn-reset").on("click", function() {
    dotsGroup.selectAll("circle")
      .transition().duration(1000)
      .attr("cx", d => d.originX).attr("cy", d => d.originY)
      .attr("r", 2).attr("fill", "rgba(255, 200, 50, 0.7)");
    genderMode = false;
    d3.select("#btn-gender").classed("active", false).text("Show gender");
    mapSvg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
  });

  // ── BOUTON GENRE ───────────────────────────────────────────────────────
  let genderMode = false;

  d3.select("#btn-gender").on("click", function() {
    genderMode = !genderMode;
    d3.select(this)
      .classed("active", genderMode)
      .text(genderMode ? "Hide gender" : "Show gender");

    dotsGroup.selectAll("circle")
      .transition().duration(600)
      .attr("fill", d => {
        if (!genderMode) return "rgba(255, 200, 50, 0.7)";
        if (d.gender === "M") return "rgba(74, 158, 255, 0.8)";
        if (d.gender === "F") return "rgba(255, 100, 180, 0.8)";
        return "rgba(200, 200, 200, 0.5)";
      });
  });

  // ── FILTER PER RÉGION ──────────────────────────────────────────────────
  const countryToRegion = countryToContinent;

  function filterByRegion(region) {
    d3.selectAll(".region-btn").classed("active", false);
    d3.select(region ? `#btn-${region.toLowerCase()}` : "#btn-all")
      .classed("active", true);

    dotsGroup.selectAll("circle")
      .transition().duration(400)
      .attr("opacity", d => {
        if (!region) return 0.7;
        return countryToRegion[d.code] === region ? 1 : 0.05;
      });

    countryPaths.transition().duration(400)
      .attr("opacity", d => {
        if (!region) return 1;
        const numId = String(+d.id).padStart(3, "0");
        const alpha3 = Object.keys(isoAlpha3ToNumeric)
          .find(k => isoAlpha3ToNumeric[k] === numId);
        return alpha3 && countryToRegion[alpha3] === region ? 1 : 0.25;
      });
  }

  d3.select("#btn-all").on("click", () => filterByRegion(null));
  d3.select("#btn-europe").on("click", () => filterByRegion("Europe"));
  d3.select("#btn-americas").on("click", () => filterByRegion("Americas"));
  d3.select("#btn-asia").on("click", () => filterByRegion("Asia"));
  d3.select("#btn-africa").on("click", () => filterByRegion("Africa"));
  d3.select("#btn-oceania").on("click", () => filterByRegion("Oceania"));

  // console.log("Athlètes:", athletes.length, "| Dots:", allDots.length);

  // ── FILTRE GLOBAL PER COUNTRY ─────────────────────────────────────────────
  window.highlightCountryOnMap = function(countryName) {
    if (!countryName) {
      countryPaths
        .transition().duration(400)
        .attr("opacity", 1)
        .attr("stroke", "#2a4a6a")
        .attr("stroke-width", 0.5);
      dotsGroup.selectAll("circle")
        .transition().duration(400)
        .attr("opacity", 0.7);
      mapSvg.transition().duration(750)
        .call(zoom.transform, d3.zoomIdentity);
      return;
    }

    const code = Object.keys(countryNames).find(k => countryNames[k] === countryName);
    if (!code) return;

    const latLng = window.mapCoords[code];
    if (latLng) {
      const xy = projection([latLng[1], latLng[0]]);
      if (xy) {
        const scale = 4;
        const tx = mapWidth / 2 - scale * xy[0];
        const ty = mapHeight / 2 - scale * xy[1];
        mapSvg.transition().duration(750)
          .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
      }
    }

    countryPaths
      .transition().duration(400)
      .attr("opacity", d => {
        const numId = String(+d.id).padStart(3, "0");
        const alpha3 = Object.keys(isoAlpha3ToNumeric)
          .find(k => isoAlpha3ToNumeric[k] === numId);
        return alpha3 === code ? 1 : 0.2;
      })
      .attr("stroke", d => {
        const numId = String(+d.id).padStart(3, "0");
        const alpha3 = Object.keys(isoAlpha3ToNumeric)
          .find(k => isoAlpha3ToNumeric[k] === numId);
        return alpha3 === code ? "white" : "#2a4a6a";
      })
      .attr("stroke-width", d => {
        const numId = String(+d.id).padStart(3, "0");
        const alpha3 = Object.keys(isoAlpha3ToNumeric)
          .find(k => isoAlpha3ToNumeric[k] === numId);
        return alpha3 === code ? 2 : 0.5;
      });

    dotsGroup.selectAll("circle")
      .transition().duration(400)
      .attr("opacity", d => d.code === code ? 1 : 0.05);
  };

  // ── FILTER GLOBAL PER DISCIPLINE ───────────────────────────────────────
  window.filterMapByDiscipline = function(discipline) {
    if (!discipline) {
      countryPaths
        .transition().duration(400)
        .attr("opacity", 1);
      dotsGroup.selectAll("circle")
        .transition().duration(400)
        .attr("opacity", 0.7)
        .attr("fill", d => genderMode
          ? (d.gender === "M" ? "rgba(74, 158, 255, 0.8)" : "rgba(255, 100, 180, 0.8)")
          : "rgba(255, 200, 50, 0.7)");
      return;
    }

    const countriesWithDiscipline = new Set(
      window.athletesData
        .filter(a => parseDiscipline(a) === discipline)
        .map(a => a.country_code)
    );

    countryPaths
      .transition().duration(400)
      .attr("opacity", d => {
        const numId = String(+d.id).padStart(3, "0");
        const alpha3 = Object.keys(isoAlpha3ToNumeric)
          .find(k => isoAlpha3ToNumeric[k] === numId);
        return alpha3 && countriesWithDiscipline.has(alpha3) ? 1 : 0.15;
      });

    dotsGroup.selectAll("circle")
      .transition().duration(400)
      .attr("opacity", d => countriesWithDiscipline.has(d.code) ? 1 : 0.03)
      .attr("fill", d => {
        if (!countriesWithDiscipline.has(d.code)) return "rgba(255, 200, 50, 0.3)";
        return genderMode
          ? (d.gender === "M" ? "rgba(74, 158, 255, 0.8)" : "rgba(255, 100, 180, 0.8)")
          : "rgba(255, 200, 50, 0.7)";
      });
  };

  // ==== FADE-IN ON SCROLL ====
const geoSectionEl = document.getElementById('geo-section');
const geoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            geoSectionEl.classList.add('visible');
        } else {
            geoSectionEl.classList.remove('visible'); // Re-fade if scrolled away
        }
    });
}, { threshold: 0.1 });

geoObserver.observe(geoSectionEl);

}).catch(err => console.error("Erreur:", err));