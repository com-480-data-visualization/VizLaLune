// ─── MAP.JS — Figure 2.2 ───────────────────────────────────────────────────

const mapWidth = 960;
const mapHeight = 500;

const mapSvg = d3.select("#figure2_2")
  .attr("width", mapWidth)
  .attr("height", mapHeight)
  .style("background", "#0a1628")
  .style("display", "block");

const projection = d3.geoNaturalEarth1()
  .scale(153)
  .translate([mapWidth / 2, mapHeight / 2]);

const path = d3.geoPath().projection(projection);

// Correspondance ISO alpha-3 (lettres) -> ISO numeric (chiffres du TopoJSON)
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
  "MKD":"807","MLT":"470","MNE":"499","MON":"492","MCO":"492","MNE":"499",
  "NED":"528","NLD":"528","NGR":"566","NGA":"566","NOR":"578","NZL":"554",
  "PAK":"586","PHI":"608","POL":"616","POR":"620","PRT":"620","PUR":"630",
  "ROU":"642","RSA":"710","ZAF":"710","RUS":"643","SGP":"702","SVK":"703",
  "SLO":"705","SVN":"705","SMR":"674","SRB":"688","SUI":"756","CHE":"756",
  "SWE":"752","SWK":"752","THA":"764","TTO":"780","TPE":"158","TWN":"158",
  "TUR":"792","UAE":"784","UKR":"804","URU":"858","USA":"840","UZB":"860",
  "VEN":"862","AIN":"000"
};

Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
  d3.csv("../DataPreprocessing/athletes.csv")
]).then(([world, athletes]) => {

  // Compte les athlètes par pays
  const athletesByCountry = d3.rollup(
    athletes,
    v => v.length,
    d => d.country_code
  );

  // Ensemble des IDs numériques des pays participants
  const participatingIds = new Set();
  athletesByCountry.forEach((count, code) => {
    const numId = isoAlpha3ToNumeric[code];
    if (numId) participatingIds.add(numId);
  });

  // Échelle de couleur : plus d'athlètes = plus clair
  const maxAthletes = d3.max([...athletesByCountry.values()]);
  const colorScale = d3.scaleSequential()
    .domain([0, maxAthletes])
    .interpolator(d3.interpolateBlues);

  const countries = topojson.feature(world, world.objects.countries);

  // Dessine les pays
  const countryPaths = mapSvg.append("g")
    .selectAll("path")
    .data(countries.features)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const numId = String(+d.id).padStart(3, "0");
      // Trouve le code alpha-3 correspondant
      const alpha3 = Object.keys(isoAlpha3ToNumeric)
        .find(k => isoAlpha3ToNumeric[k] === numId);
      const count = alpha3 ? (athletesByCountry.get(alpha3) || 0) : 0;
      return count > 0 ? colorScale(count) : "#1a2e4a";
    })
    .attr("stroke", "#2a4a6a")
    .attr("stroke-width", 0.5);

    // Tooltip
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

// Données pays (nom depuis TopoJSON)
const countryNames = new Map();
countries.features.forEach(d => countryNames.set(String(+d.id).padStart(3,"0"), d.properties?.name || ""));

countryPaths
  .on("mouseover", function(event, d) {
    const numId = String(+d.id).padStart(3, "0");
    const alpha3 = Object.keys(isoAlpha3ToNumeric).find(k => isoAlpha3ToNumeric[k] === numId);
    const count = alpha3 ? (athletesByCountry.get(alpha3) || 0) : 0;
    if (count === 0) return;

    d3.select(this).attr("stroke", "white").attr("stroke-width", 1.5);

    tooltip
      .style("opacity", 1)
      .html(`<strong>${alpha3}</strong><br>${count} athletes`);
  })
  .on("mousemove", function(event) {
    tooltip
      .style("left", (event.clientX + 14) + "px")
      .style("top", (event.clientY - 10) + "px");
  })
  .on("mouseout", function() {
    d3.select(this).attr("stroke", "#2a4a6a").attr("stroke-width", 0.5);
    tooltip.style("opacity", 0);
  });

  console.log("Pays participants:", participatingIds.size);
  console.log("Athlètes chargés:", athletes.length);


// Charge les coordonnées des pays
d3.json("countries_coords.json").then(coords => {

    // Point cible : Milan (centre des JO)
    const milanCoords = [45.46, 9.19];
    const milanXY = projection([milanCoords[1], milanCoords[0]]);
  
    // Groupe pour les dots
    const dotsGroup = mapSvg.append("g").attr("class", "dots");
  
    // Échelle pour la taille des dots
    const radiusScale = d3.scaleSqrt()
      .domain([0, maxAthletes])
      .range([3, 18]);
  
    // Crée un dot par pays participant
    const dots = [];
    athletesByCountry.forEach((count, code) => {
      const latLng = coords[code];
      if (!latLng) return;
      const xy = projection([latLng[1], latLng[0]]);
      if (!xy) return;
      dots.push({ code, count, x: xy[0], y: xy[1] });

   // Boutons définis dans le HTML
d3.select("#btn-send").on("click", function() {
    dotsGroup.selectAll("circle")
        .transition()
        .duration(2000)
        .delay((d, i) => i * 20)
        .ease(d3.easeCubicInOut)
        .attr("cx", milanXY[0])
        .attr("cy", milanXY[1])
        .attr("r", 3)
        .attr("fill", "rgba(255, 200, 50, 0.6)");
});

d3.select("#btn-reset").on("click", function() {
    dotsGroup.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => radiusScale(d.count))
        .attr("fill", "rgba(255, 200, 50, 0.7)");
});

// Filtre par région
d3.json("regions.json").then(regions => {

    // Crée un map code pays -> région
    const countryToRegion = {};
    Object.entries(regions).forEach(([region, codes]) => {
        codes.forEach(code => countryToRegion[code] = region);
    });

    let activeRegion = null;

    function filterByRegion(region) {
        activeRegion = region;

        // Met à jour les boutons actifs
        d3.selectAll(".region-btn").classed("active", false);
        d3.select(region ? `#btn-${region.toLowerCase()}` : "#btn-all")
            .classed("active", true);

        // Affiche/cache les dots
        dotsGroup.selectAll("circle")
            .transition()
            .duration(400)
            .attr("opacity", d => {
                if (!region) return 0.7;
                return countryToRegion[d.code] === region ? 1 : 0.05;
            });

        // Highlight les pays sur la carte
        countryPaths.transition()
            .duration(400)
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
});
    
    });
  
    // Dessine les dots
    dotsGroup.selectAll("circle")
      .data(dots)
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => radiusScale(d.count))
      .attr("fill", "rgba(255, 200, 50, 0.7)")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "rgba(255, 230, 100, 1)");
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.code}</strong><br>${d.count} athletes`);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.clientX + 14) + "px")
          .style("top", (event.clientY - 10) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("fill", "rgba(255, 200, 50, 0.7)");
        tooltip.style("opacity", 0);
      });
  
    console.log("Dots ajoutés:", dots.length);
  
  });

}).catch(err => console.error("Erreur:", err));