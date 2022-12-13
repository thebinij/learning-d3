import {
    scaleLinear,
    max,
    extent,
    axisLeft,
    axisBottom,
    transition,
    scalePoint,
    color
} from "d3";

export const scatterPlotAnimate = () => {
    let width;
    let height;
    let data;
    let xValue;
    let yValue;
    let margin;
    let radius;
    let xType;
    let yType;

    const my = (selection) => {
        const x = (
            xType === "categorical"
                ? scalePoint().domain(data.map(xValue)).padding(0.2)
                : scaleLinear().domain([0, max(data, xValue)])
        ).range([margin.left, width - margin.right]);

        const y = (
            yType === "categorical"
                ? scalePoint().domain(data.map(yValue)).padding(0.2)
                : scaleLinear().domain(extent(data, yValue))
        ).range([height - margin.bottom, margin.top]);

        const marks = data.map((d) => ({
            x: x(xValue(d)),
            y: y(yValue(d)),
        }));

        const t = transition().duration(1000);

        const positionCircles = (circles) => {
            circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        };
        const initializeRadius = (circles) => {
            circles.attr("r", 0);
        };
        const growRadius = (enter) => {
            enter.transition(t).attr("r", radius);
        };

        selection
            .selectAll("circle")
            .data(marks)
            .join(
                (enter) =>
                    enter
                        .append("circle")
                        .call(positionCircles)
                        .call(initializeRadius)
                        .call(growRadius),
                (update) =>
                    update.call((update) =>
                        update
                            .transition(t)
                            .delay((d, i) => i * 10)
                            .call(positionCircles)
                            .attr("r", radius)
                    ),
                (exit) => exit.remove()
            ).style("fill", color("steelblue"));

        selection
            .selectAll("g.y-axis")
            .data([null])
            .join("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${margin.left},0)`)
            .call(axisLeft(y));

        selection
            .selectAll("g.x-axis")
            .data([null])
            .join("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .transition(t)
            .call(axisBottom(x));

        // const bottomAxis = (bottom) => {
        //     bottom.append('text').attr('class', "x-label").text("X-label")
        // }

        // selection.selectAll("g.x-label")
        //     .data([null])
        //     .join("g")
        //     .attr("class", "x-label")
        //     .attr("text-anchor", "middle")
        //     .attr("x", width / 2)
        //     .attr("y", height / 2)
        //     .call(bottomAxis)
    };

    my.width = function (_) {
        return arguments.length ? ((width = +_), my) : width;
    };

    my.height = function (_) {
        return arguments.length ? ((height = +_), my) : height;
    };

    my.data = function (_) {
        return arguments.length ? ((data = _), my) : data;
    };

    my.xValue = function (_) {
        return arguments.length ? ((xValue = _), my) : xValue;
    };
    my.yValue = function (_) {
        return arguments.length ? ((yValue = _), my) : yValue;
    };
    my.margin = function (_) {
        return arguments.length ? ((margin = _), my) : margin;
    };

    my.radius = function (_) {
        return arguments.length ? ((radius = _), my) : radius;
    };

    my.xType = function (_) {
        return arguments.length ? ((xType = _), my) : xType;
    };

    my.yType = function (_) {
        return arguments.length ? ((yType = _), my) : yType;
    };
    return my;
};
