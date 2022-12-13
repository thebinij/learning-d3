import "./style.css";
import { csv, select } from "d3";
import { scatterPlotAnimate } from "./scatterplotWithAnimiation";
import { menu } from "./menu";

const csvURL = [
  "https://gist.githubusercontent.com/",
  "curran/", //User
  "a08a1080b88344b0c8a7/", // Id of gist
  "raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534", //commit
  "/iris.csv", //file name
].join("");

const parseRow = (d, i) => {
  d.sepal_length = +d.sepal_length;
  d.sepal_width = +d.sepal_width;
  d.petal_length = +d.petal_length;
  d.petal_width = +d.petal_width;
  d.id = i;
  return d;
};

let width = window.innerWidth;
let height = window.innerHeight;

const svg = select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

//Pure Function
const main = async () => {
  const data = await csv(csvURL, parseRow);
  const plot = scatterPlotAnimate()
    .width(width)
    .height(height)
    .data(data)
    .xValue((d) => d.petal_width)
    .yValue((d) => d.petal_width)
    .margin({ top: 30, right: 30, bottom: 40, left: 80 })
    .radius(3);

  const options = [
    { value: "petal_width", text: "Petal Width", type: "quantitative" },
    { value: "sepal_width", text: "Sepal Width", type: "quantitative" },
    { value: "petal_length", text: "Petal Length", type: "quantitative" },
    { value: "sepal_length", text: "Sepal Length", type: "quantitative" },
    { value: "species", text: "Species", type: "categorical" },
  ];

  const menuContainer = select("body")
    .append("div")
    .attr("class", "menu-container");
  const xMenu = menuContainer.append("div");
  const yMenu = menuContainer.append("div");

  // Map Table or Hash Map
  const columnToType = new Map(options.map(({ value, type }) => [value, type]));

  const getType = column => columnToType.get(column);
  // options.find((d)=> d.value).type

  xMenu.call(
    menu()
      .id("x-menu")
      .labelText("X: ")
      .options(options)
      .on("change", (column) => {
        svg.call(plot.xValue((d) => d[column]).xType(getType(column)));

      })
  );
  yMenu.call(
    menu()
      .id("y-menu")
      .labelText("Y: ")
      .options(options)
      .on("change", (column) => {
        svg.call(plot.yValue((d) => d[column]).yType(getType(column)));

      })
  );

  svg.call(plot);

  // let i = 0;
  // setInterval(() => {
  //   i++;
  //   if (i == 4) i = 0
  //   const column = columns[i];
  //   console.log(column)
  //   plot.xValue((d) => d[column])
  //   svg.call(plot)
  // }, 2000)
};
main();
