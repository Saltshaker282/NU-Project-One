//Shoehorning Buttons
$("#catfact").click(function(event){
    $.ajax({
        method: "GET",
        url: "https://catfact.ninja/fact?max_length=50"
    }).then(function(response){
        $("#catfact").text(response.fact)
    })
})

//All this code needs to be based on a select event
$("#selectForm").change(function(event) {
    //Clear the search area
    cardHTML = '<div class="col s8"> <span class="information" id="">Name</span> <span class="information" id="">Scientific Name</span> <span class="information" id="">Endagerment Status</span><span class="information" id="">Native Status</span><span class="information" id=""></span></div><div class="col s4"><img src="img/profile_4.jpg" class="img-responsive"></div>'
    columnHTML = '</div><div class="col m2" id="spacer"></div>'
    $("#searchresults").html("")
    
    //var should be defined from drop down, just setting it here for now !!!CHANGE!!!
    var park = event.target.value
    //!!!!!

    //Setting AJAX url according to the requested national park
    var queryURL = ""
    if (park === "2") {
        queryURL = "https://api.inaturalist.org/v1/observations?taxon_id=1&nelat=47.96&nelng=-123.24=&swlat=47.614&swlng=-123.83&per_page=100"
    }
    if (park === "1") {
        queryURL = "https://api.inaturalist.org/v1/observations?taxon_id=1&nelat=25.76&nelng=-80.50=&swlat=25.054&swlng=-81.08&per_page=100"
    }
    if (park === "3") {
        queryURL = "https://api.inaturalist.org/v1/observations?taxon_id=1&nelat=35.679610&nelng=-83.939667=&swlat=35.542284&swlng=-83.038788&per_page=100"
    }
    if (park === "4") {
        queryURL = "https://api.inaturalist.org/v1/observations?taxon_id=1&nelat=45&nelng=-110.01=&swlat=44.15&swlng=-111.04&per_page=100"
    }

    //AJAX call, requesting information
    $.ajax({
        method: "GET",
        url: queryURL
    }).then(function(response) {
        var includedSpecies = []
        var indexCounter = -1
        //cycle through 100 different observations, arbitrary number
        for (i = 0; i < 100; i++) {
            indexCounter++
            var result = response.results[i]
            var taxonScientificName = result.taxon.name
            var taxonCommonName = result.taxon.preferred_common_name
            var endangermentStatus = "Endangered: " + result.taxon.threatened
            var nativeStatus
            if (result.taxon.native) {
                nativeStatus = "Native/Introduced: Native"
            }
            else {
                nativeStatus = "Native/Introduced: Introduced"
            }
            var wikiLink = result.taxon.wikipedia_url
            var taxonImageURL = ""

            //Sometimes, the API doesn't give an image
            if (result.taxon.default_photo !== null) {
                taxonImageURL = result.taxon.default_photo.url
            }
            else {
                taxonImageURL = "https://via.placeholder.com/150"
            }


            //Remove entry if it's already been added to the HTML and undo the incrementation of index
            if (includedSpecies.includes(taxonScientificName)) {
                indexCounter--
            }

            //sometimes, the API doesn't give a common name
            else {
                if (taxonCommonName === undefined) {
                    taxonCommonName = "No common name"
                }

                includedSpecies.push(taxonScientificName)
                
                //some test code, change to inputting info into the HTML
                // var bodyEl = $("body")
                // bodyEl.append(taxonCommonName + ", " + taxonScientificName + ", " + endangermentStatus + ", Native/Introduced: " + nativeStatus + "  ||  ")
                
                //Adding the info to the HTML, need the front end to give me target El
                var targetEl = $("#searchresults")

                var newCard = $("<div>").addClass("animal-info col s12 m5 z-depth-1 mb25" + " cardnumber" + i).html(cardHTML)
                console.log(newCard[0])
                newCard[0].children[0].children[0].textContent = taxonScientificName
                newCard[0].children[0].children[1].textContent = taxonCommonName
                newCard[0].children[0].children[2].textContent = endangermentStatus
                newCard[0].children[0].children[3].textContent = nativeStatus
                // newCard[0].children[0].children[4].textContent = wikiLink
                newCard[0].children[1].children[0].setAttribute("src", taxonImageURL)
                targetEl.append(newCard)
                if (indexCounter%2 === 0) {
                    var columnDiv = $("<div>").addClass("col m2").attr("id", "spacer")
                    targetEl.append(columnDiv)
                }
            }
        }
    })
})



