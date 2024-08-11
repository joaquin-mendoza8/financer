// Set up the SVG area and margins
const svgWidth = 400;
const svgHeight = 200;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create the SVG element
const svg = d3.select("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Create a group element for the bars
const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Define the scales and axes
const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

const y = d3.scaleLinear()
    .range([height, 0]);

const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`);

g.append("g")
    .attr("class", "y-axis");

// Function to update the graph based on input values
function updateGraph(income, expense) {

    // Update the data array with the new values
    const data = [
        { category: 'Income', value: income },
        { category: 'Expense', value: expense }
    ];

    // Update the domain of the x and y scales
    x.domain(data.map(d => d.category));
    y.domain([0, d3.max(data, d => d.value)]);

    // Update the bars
    const bars = g.selectAll(".bar")
        .data(data);

    // determine the color of the bars
    const expectedProgressPercentage = document.getElementById('expected-progress-value').innerHTML;
    const actualProgressPercentage = document.getElementById('actual-progress-value').innerHTML;
    if (expense > income) {
        const expenseColor = "#ce3636"
    } else if (expense > expectedProgressPercentage/100*income) {
        const expenseColor = "#ce9136"
    } else {
        const expenseColor = "#4c82af"
    }

    bars.enter().append("rect")
        .attr("class", "bar")
        .merge(bars)
        .attr("x", d => x(d.category))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => d.category === 'Income' ? "#258c28" : "#4c82af");

    bars.exit().remove();

    // Update the axes
    g.select(".x-axis")
        .call(xAxis);

    g.select(".y-axis")
        .call(yAxis);

    // Color all labels white
    if (income == 0 && expense == 0) {
        svg.selectAll('text')
            .attr('fill', 'black');
    } else {
        svg.selectAll('text')
            .attr('fill', 'white');
    }
}

$(document).ready(function() {

    var incomeVal = parseInt(document.getElementById('total-monthly-income-value').innerHTML);
    var expenseVal = parseInt(document.getElementById('total-monthly-expense-value').innerHTML);

    // Add event listeners to income and expense input fields
    var incomeInputs = document.querySelector('#income-inputs').children;
    for (let i = 0; i < incomeInputs.length; i++) {
        var input = incomeInputs[i];
        input.addEventListener('change', function() {
            incomeVal = parseInt(document.getElementById('total-monthly-income-value').innerHTML);
            expenseVal = parseInt(document.getElementById('total-monthly-expense-value').innerHTML);

            updateGraph(incomeVal, expenseVal);
        });
    }

    var expenseInputs = document.querySelector('#expense-inputs').children;
    for (let i = 0; i < expenseInputs.length; i++) {
        var input = expenseInputs[i];
        input.addEventListener('change', function() {
            incomeVal = parseInt(document.getElementById('total-monthly-income-value').innerHTML);
            expenseVal = parseInt(document.getElementById('total-monthly-expense-value').innerHTML);
            
            updateGraph(incomeVal, expenseVal);
        });
    }
});

updateGraph(0, 0);
