var url = "data.json";

var loadData = function(filter_tag) {
    d3.json(url, function (data) {
        var tag_to_pubs = {};
        for (var pub_type in data) {
            for (var pub_idx in data[pub_type]) {
                var pub = data[pub_type][pub_idx];

                for (var tag_idx in pub.tags) {
                    var tag = pub.tags[tag_idx];

                    if (tag_to_pubs[tag] == undefined)
                        tag_to_pubs[tag] = [];
                    tag_to_pubs[tag].push(pub);
                }
            }
        }

        var sorted_tags = Object.keys(tag_to_pubs).sort();
        var sorted_pub_types = Object.keys(data);

        var tags = d3.select("body").select("#tags");

        // Clear previous
        tags.selectAll("div").remove();

        tags.selectAll("div")
            .data(sorted_tags)
            .enter().append("div")
            .attr("class", function (tag) { return "tag-button " + (filter_tag == tag ? "selected" : ""); })
            .text(function(tag) { return tag; })
            .on("click", function (tag) { loadData(filter_tag == tag ? undefined : tag); });

        var pubs_div = d3.select("body").select("#pubs");
        pubs_div.selectAll("div").remove();

        var pub_types = pubs_div
                .selectAll("div")
                .data(sorted_pub_types)
                .enter().append("div")
                .attr("class", "pub-type")
                .text(function(pub_type) { return pub_type.toUpperCase(); });

        pub_types.selectAll("li").remove();

        var pubs = pub_types
                .append("ul")
                .selectAll("li")
                .data(function (pub_type) {
                    return data[pub_type].filter(function (d) { return filter_tag == undefined || d.tags.indexOf(filter_tag) >= 0; });
                })
                .enter()
                .append("li")
                .append("div")
                .text(function (d) { return d.title; })
                .append("div")
                .selectAll("span")
                .data(function (d) {
                    return d.tags;
                })
                .enter()
                .append("span")
                .attr("class", "tag-button small")
                .text(function (tag) { return tag; })
                .on("click", function (tag) { loadData(tag); });

    });
};

var onload = function () {
    loadData();
};