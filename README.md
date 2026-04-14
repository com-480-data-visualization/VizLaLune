# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Thomas Lenges  | 325245 |
| Léontine Lefranc | 345240 |
| Manon Darnaud | 361028 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (20th March, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)).


**Answer**:

The main dataset that will be used is the following: 

[Milano-Cortina 2026 Olympic Winter Games](https://www.kaggle.com/datasets/piterfm/milano-cortina-2026-olympic-winter-games/data?select=athletes.csv)

It covers the complete results of the 2026 Winter Olympics held in Milan and Cortina d'Ampezzo (February 4–22, 2026), and is composed of 7 files: athletes.csv, coaches.csv, medallists.csv, medals.csv, schedules.csv, teams.csv, and venues.csv.

The initial exploration to assess the quality of the data and how much preprocessing/data-cleaning it will require can be found under:

[DataExploration/PickedDataset/EXPLORATION_Milano_Cortina_2026_Olympic_Winter_Games.ipynb](https://github.com/com-480-data-visualization/VizLaLune/blob/master/DataExploration/PickedDataset/EXPLORATION_Milano_Cortina_2026_Olympic_Winter_Games.ipynb)

It covers per-file shape inspection, duplicate checks, missing value analysis, and key aggregate statistics. The main findings are:

* 2916 athletes from 93 countries, 16 disciplines, 116 events
* 348 medals awarded to 534 unique athletes from 29 countries
* Norway led the medal tally (41 medals), followed by the USA (33) and Italy (30)
* 63 athletes (~2.2%) have missing event data due to injury or alternate status

The dataset is overall clean and well-structured. The core files (athletes, medallists, medals and venues) are complete and reliable. The coaches.csv file is only partially populated (Curling and Ice Hockey only) and will not be used. The teams.csv file is incomplete and will be used with care.


### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

**Answer:**

How is participation in the Milano-Cortina 2026 Winter Olympics structured across countries, sports, and gender, and what patterns or imbalances can be observed in this distribution?

The Olympic Games bring together athletes from all over the world. However, participation is not evenly distributed. Certain disciplines are dominated by specific countries, some sports attract more athletes than others, and gender representation varies across disciplines.

After exploring the official [Milano-Cortina 2026 Olympic Games website](https://www.olympics.com/en/milano-cortina-2026), we observed that the available data is mainly presented as basic lists with filters, which makes it difficult to explore and understand global patterns. The information is not very interactive and does not provide an intuitive overview of participation across countries, sports, and gender.

The goal of this project is therefore to provide a more interactive and visual way to explore this data. Our visualization will allow users to gain a global overview of the Games while also exploring specific aspects in more detail.

The target audience includes sports fans, data journalists, and anyone interested in global representation in international competitions.


### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

**Answer:**

For basic statistics and insights about the data:

[DataExploration/PickedDataset/EXPLORATION_Milano_Cortina_2026_Olympic_Winter_Games.ipynb](https://github.com/com-480-data-visualization/VizLaLune/blob/master/DataExploration/PickedDataset/EXPLORATION_Milano_Cortina_2026_Olympic_Winter_Games.ipynb)

For pre-processing (based on exploration): 

[DataPreprocessing/PREPROCESSING_Milano_Cortina_2026_Olympic_Winter_Games.ipynb](https://github.com/com-480-data-visualization/VizLaLune/edit/master/DataPreprocessing/PREPROCESSING_Milan_Cortina_2026_Olympic_Winter_Games.ipynb)

Some examples of pre-processing are the following:

* Fixing event name inconsistencies in schedules.csv
* Completing the gender field in teams.csv
* Enriching venues.csv with an events column cross-referenced from the schedule.


### Related work


> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

**Answer:**

Several visualizations have already explored Olympic datasets, most of them focusing on medal counts, country rankings, or historical performance across different Olympic Games. For example, media outlets such as The Guardian have published visualizations analyzing Olympic participation and medal distributions across countries. However, these [projects](https://www.theguardian.com/sport/datablog/2012/jul/10/london-olympic-charts-medals-competitors) mainly focus on results and performance, rather than on how participation itself is structured.

Our approach is a bit different, since we focus on the structure of participation in the Milano-Cortina 2026 Winter Olympics (very recent event). Instead of looking at medals or rankings, we want to explore how athletes are distributed across sports, countries, and gender. This allows us to highlight patterns and possible imbalances in participation.
For inspiration, we also looked at visualizations from other domains. One example is the [Wind Map visualization](https://earth.nullschool.net) by Fernanda Viégas and Martin Wattenberg.

Even though it shows meteorological data, it’s a good example of how global patterns can be visualized in a clear and engaging way on a map. This inspired us to use a geographic visualization to show how athletes are distributed across countries, for example using color or markers.
We also looked at examples from the [D3 and Observable galleries](https://observablehq.com/@d3/gallery), which include many interactive visualizations such as treemaps, hierarchical charts, and linked views.

Based on this, we plan to combine different types of visualizations, such as a geographic map (for countries), a bar chart (for sports), and a stacked bar chart (for gender distribution). These visualizations will be connected, so that interacting with one (for example selecting a country or a sport) updates the others. This should make the data easier to explore and more intuitive to understand.


## Milestone 2 (17th April, 5pm)

The milestone 2 document can be visualized inside its related folder: [link](https://github.com/com-480-data-visualization/VizLaLune/blob/master/Milestone2/milestone_2.pdf).
The first live skeleton of the website can be visualized here: [link], whilst its code can be found in its related folder: [link](https://github.com/com-480-data-visualization/VizLaLune/blob/master/Milestone2/index.html).

The skeleton serves as the structural foundation for the final website. The figures were generated using real data from the dataset and inserted as placeholders in the website skeleton to better anticipate the layout and interactions of the final product. An additional notebook containing the preprocessing code used to generate the data can be found here: [link](https://github.com/com-480-data-visualization/VizLaLune/blob/master/DataPreprocessing/PREPROCESSING_Milan_Cortina_2026_Olympic_Winter_Games.ipynb).


## Milestone 3 (29th May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

