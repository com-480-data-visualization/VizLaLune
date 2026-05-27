# VizLaLune

## Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Thomas Lenges | 325245 |
| Léontine Lefranc | 345240 |
| Manon Darnaud | 361028 |

[Milestone 1](#milestone-1-20th-march-5pm) • [Milestone 2](#milestone-2-17th-april-5pm) • [Milestone 3](#milestone-3-29th-may-5pm)

---

## Dataset

The main dataset used in this project is the [Milano-Cortina 2026 Olympic Winter Games](https://www.kaggle.com/datasets/piterfm/milano-cortina-2026-winter-olympics) dataset.

It covers the complete results of the 2026 Winter Olympics held in Milan and Cortina d'Ampezzo (February 4–22, 2026), and is composed of 7 files: `athletes.csv`, `coaches.csv`, `medallists.csv`, `medals.csv`, `schedules.csv`, `teams.csv`, and `venues.csv`.

**Key figures:**
- **2916 athletes** from **93 countries**
- **16 disciplines**, **116 events**
- **348 medals** awarded to **534 unique athletes** from **29 countries**

The full data exploration is available in [`DataExploration/`](./DataExploration/), and the preprocessing scripts in [`DataPreprocessing/`](./DataPreprocessing/) where the cleaned dataset can also be found.

---

## Repository structure

```
VizLaLune/
├── README.md
├── DataExploration/            # Initial data exploration notebooks
├── DataPreprocessing/          # Python scripts + cleaned CSVs
├── ExtraResources/             # Images used in the website
├── Milestone2/                 # M2 skeleton website + report pdf
└── Milestone3/                 # Final website (M3)
    ├── index.html              # Main page
    ├── styles.css              # Global styles
    ├── skeleton.js             # Global filter & shared state
    ├── intro_bubbles.js        # Animated intro statistics
    ├── grid.js                 # Discipline grid with pictograms
    ├── podium.js               # Podium + events table
    ├── map.js                  # Venue map (Leaflet)
    ├── treemap.js              # Events treemap (D3)
    ├── medalrace.js            # Animated medal race
    ├── worldmap.js             # World map of athletes
    ├── barchart.js             # Athletes per discipline
    ├── symmetrical_gender.js   # Gender comparison
    ├── conclusion_bubbles.js   # Closing floating insights
    └── continents_and_countries.js  # Country/continent mappings
```

---

## Milestone 3 (29th May, 5pm)

**80% of the final grade**

### Live website
**[VizLaLune — explore the 2026 Winter Olympics](https://com-480-data-visualization.github.io/VizLaLune/Milestone3/)**

### Process book
The full process book documenting our journey from M1 sketches to the final website is available here:
[process_book.pdf](./Milestone3/process_book.pdf)

### Screencast
A 2-minute video walkthrough of the website: [LIEN À AJOUTER]

###  Running the website locally

The website is built with vanilla HTML/CSS/JS and a few external libraries (D3.js v7, Leaflet, TopoJSON), no build step required.

```bash
git clone https://github.com/com-480-data-visualization/VizLaLune.git
cd VizLaLune/
python -m http.server 8000
# Then open http://localhost:8000/Milestone3/index.html in your browser
```

> A local server is required because the project loads CSV files via `fetch()`, which doesn't work with `file://` URLs.

### Built with

- [D3.js v7](https://d3js.org/) — custom visualizations
- [Leaflet](https://leafletjs.com/) — interactive venue map
- [TopoJSON](https://github.com/topojson/topojson) — world map geometry
- Vanilla HTML / CSS / JavaScript

###  Project overview

VizLaLune is an interactive scrollytelling website exploring the **Milano-Cortina 2026 Winter Olympic Games** through three connected lenses:

1. **Global Overview** — disciplines, venues, events, and the medal race. The user can explore the 16 disciplines through an interactive pictogram grid, locate every Olympic venue on a Leaflet map of the Milan–Cortina region, dive into a hierarchical treemap of all 116 events, and watch an animated race chart revealing how the medal tally unfolds across competing nations.

2. **Gender Representation** — a deeper dive into how participation breaks down by gender across countries and disciplines. This section combines three linked visualizations: an interactive world map showing each country's delegation as a cluster of dots (with an optional gender colouring revealing the male/female split as a first glance), a horizontal bar chart ranking disciplines by number of athletes for the selected country, and a symmetrical "back-to-back" bar chart comparing male and female participation discipline by discipline (and event by event when a discipline is selected). Together, they let the user uncover striking patterns: which countries send the most balanced delegations, which disciplines remain heavily male-dominated (ski jumping, Nordic combined), and which have achieved near-parity (alpine skiing, biathlon, snowboard).

3. **Conclusion** — key insights surfaced as floating animated bubbles, each highlighting a noteworthy fact from the data (the largest delegation, the most gender-balanced team, the dominant nation per discipline...).

All visualizations are linked through a global filter system: selecting a country or discipline anywhere on the site updates every chart simultaneously, so the user can build a coherent story as they scroll.

---

## Milestone 1 (20th March, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas. Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset
> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> *Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)).*

**Answer:**

The main dataset that will be used is the following:
- [Milano-Cortina 2026 Olympic Winter Games](https://www.kaggle.com/datasets/piterfm/milano-cortina-2026-winter-olympics)

It covers the complete results of the 2026 Winter Olympics held in Milan and Cortina d'Ampezzo (February 4–22, 2026), and is composed of 7 files: `athletes.csv`, `coaches.csv`, `medallists.csv`, `medals.csv`, `schedules.csv`, `teams.csv`, and `venues.csv`.

The initial exploration to assess the quality of the data and how much preprocessing/data-cleaning it will require can be found under:
- [`DataExploration/PickedDataset/EXPLORATION_Milano_Cortina_2026_Olympic_Winter_Games.ipynb`](./DataExploration/PickedDataset/EXPLORATION_Milano_Cortina_2026_Olympic_Winter_Games.ipynb)

It covers per-file shape inspection, duplicate checks, missing value analysis, and key aggregate statistics. The main findings are:
- **2916 athletes** from **93 countries**, **16 disciplines**, **116 events**
- **348 medals** awarded to **534 unique athletes** from **29 countries**
- Norway led the medal tally (41 medals), followed by the USA (33) and Italy (30)
- 63 athletes (~2.2%) have missing event data due to injury or alternate status

The dataset is overall clean and well-structured. The core files (`athletes`, `medallists`, `medals` and `venues`) are complete and reliable. The `coaches.csv` file is only partially populated (Curling and Ice Hockey only) and will not be used. The `teams.csv` file is incomplete and will be used with care.

### Problematic
> Frame the general topic of your visualization and the main axis that you want to develop.
>
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

**Answer:**

**How is participation in the Milano-Cortina 2026 Winter Olympics structured across countries, sports, and gender, and what patterns or imbalances can be observed in this distribution?**

The Olympic Games bring together athletes from all over the world. However, participation is not evenly distributed. Certain disciplines are dominated by specific countries, some sports attract more athletes than others, and gender representation varies across disciplines.

After exploring the official Milano-Cortina 2026 Olympic Games website, we observed that the available data is mainly presented as basic lists with filters, which makes it difficult to explore and understand global patterns. The information is not very interactive and does not provide an intuitive overview of participation across countries, sports, and gender.

The goal of this project is therefore to provide a more interactive and visual way to explore this data. Our visualization will allow users to gain a global overview of the Games while also exploring specific aspects in more detail.

The target audience includes sports fans, data journalists, and anyone interested in global representation in international competitions.

### Exploratory Data Analysis
> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

**Answer:**

For basic statistics and insights about the data:
- [`DataExploration/PickedDataset/EXPLORATION_Milano_Cortina_2026_Olympic_Winter_Games.ipynb`](./DataExploration/PickedDataset/EXPLORATION_Milano_Cortina_2026_Olympic_Winter_Games.ipynb)

For pre-processing (based on exploration):
- [`DataPreprocessing/PREPROCESSING_Milano_Cortina_2026_Olympic_Winter_Games.ipynb`](./DataPreprocessing/PREPROCESSING_Milano_Cortina_2026_Olympic_Winter_Games.ipynb)

Some examples of pre-processing are the following:
- Fixing event name inconsistencies in `schedules.csv`
- Completing the gender field in `teams.csv`
- Enriching `venues.csv` with an events column cross-referenced from the schedule

### Related work
> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project…), you are required to share the report of that work to outline the differences with the submission for this class.

**Answer:**

Several visualizations have already explored Olympic datasets, most of them focusing on medal counts, country rankings, or historical performance across different Olympic Games. For example, media outlets such as [The Guardian](https://www.theguardian.com/sport/datablog) have published visualizations analyzing Olympic participation and medal distributions across countries. However, these projects mainly focus on results and performance, rather than on **how participation itself is structured**.

Our approach is a bit different, since we focus on the **structure of participation** in the Milano-Cortina 2026 Winter Olympics (very recent event). Instead of looking at medals or rankings, we want to explore how athletes are distributed across sports, countries, and gender. This allows us to highlight patterns and possible imbalances in participation. For inspiration, we also looked at visualizations from other domains. One example is the [Wind Map](https://hint.fm/wind/) visualization by Fernanda Viégas and Martin Wattenberg.

Even though it shows meteorological data, it's a good example of how global patterns can be visualized in a clear and engaging way on a map. This inspired us to use a geographic visualization to show how athletes are distributed across countries, for example using color or markers. We also looked at examples from the D3 and Observable galleries, which include many interactive visualizations such as treemaps, hierarchical charts, and linked views.

Based on this, we plan to combine different types of visualizations, such as a geographic map (for countries), a bar chart (for sports), and a stacked bar chart (for gender distribution). These visualizations will be **connected**, so that interacting with one (for example selecting a country or a sport) updates the others. This should make the data easier to explore and more intuitive to understand.

---

## Milestone 2 (17th April, 5pm)

The milestone 2 document can be visualized inside its related folder: [link](./Milestone2/). The first live skeleton of the website can be visualized [here](https://com-480-data-visualization.github.io/VizLaLune/Milestone2/), whilst its code can be found in its related folder: [link](./Milestone2/).

The skeleton serves as the structural foundation for the final website. Placeholders are placed in the skeleton to better anticipate the layout and interactions of the final product. An additional notebook containing the preprocessing code used to generate the data can be found [here](./DataPreprocessing/PREPROCESSING_Milano_Cortina_2026_Olympic_Winter_Games.ipynb).

---

## Milestone 3 — Late policy
- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone
