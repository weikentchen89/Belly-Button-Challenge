// Fetch the JSON data and use D3 to select the dropdown menu
var select_tag= d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    var sample_names = data.names;

    sample_names.forEach((sample) => {
      select_tag
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    buildMetadata(sample_names[0]);
    buildCharts(sample_names[0]);
    
  });

// initialize the page with a default plot
function buildPlot(BellyButtonBiodiversityData) {
    d3.json("samples.json").then((data) => {
        var plottingData = data.samples;
        var subject = plottingData.filter(
          (sampleobject) => sampleobject.id == selectedPatientID
        )[0];

        console.log(subject);
        var ids = subject.otu_ids;
        var labels = subject.otu_labels;
        var values = subject.sample_values;
    })
    selDataset
}

function buildMetadata(id) {
    d3.json("samples.json").then((data) => {
        console.log("data")
        console.log(data)
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleobject => sampleobject.id == id)
        console.log("resultArray")
        console.log(resultArray);
        result = resultArray[0]
        var box = d3.select("#sample-metadata");
        box.html("");
        Object.entries(result).forEach(([key, value]) => {
            box.append("h6").text(`${key.toUpperCase()}: ${value}`);
        })
    })
}

    // get top 10 sample_values of an individual and put in the bar chart
function buildCharts(id) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var subject = samples.filter(
          (sampleobject) => sampleobject.id == id
        )[0];

        console.log(subject);
        var ids = subject.otu_ids;
        var labels = subject.otu_labels;
        var values = subject.sample_values;

        var barData = [
            {
              y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
              x: values.slice(0, 10).reverse(),
              text: labels.slice(0, 10).reverse(),
              type: "bar",
              orientation: "h",
            }
          ];
          
          var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
          };
          
          Plotly.newPlot("bar", barData, barLayout);

          var bubbleData = [
            {
              x: ids,
              y: values,
              text: labels,
              mode: "markers",
              marker: {
                size: values,
                color: ids,
                colorscale: "Earth"
              }
            }
          ];
      
        // make a bubble chart of each sample
          var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
          };
      
          Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    })

};

function optionChanged(id) {
    buildMetadata(id);
    buildCharts(id);
}

init();