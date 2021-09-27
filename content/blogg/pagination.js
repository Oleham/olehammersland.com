const root = document.getElementById("pagination");

const nextBtn = document.createElement("next-btn");
nextBtn.appendChild(document.createTextNode("<<< neste"));
root.appendChild(nextBtn);

const displayInfo = document.createElement("span");
root.appendChild(displayInfo)

const prevBtn = document.createElement("prev-btn");
prevBtn.appendChild(document.createTextNode("forrige >>>"));
root.appendChild(prevBtn);


const teasers = getTeasers();

let = currentView = 0;

function getTeasers() {
    let allTeasers = document.querySelectorAll(".blog-posts a")
    let teasers = [];
    let selection = [];

    let totalLength = allTeasers.length

    for (let i = 0; i < totalLength + 1; i++) {
        selection.push(allTeasers[i])
        if (selection.length === 10) {
            teasers.push(selection)
            selection = [];
        } else if (i === totalLength) {
            teasers.push(selection)
        }
    }
    return teasers
}

function updateView(current) {
    let count = 0;
    displayInfo.innerHTML = `Viser side ${current + 1} av ${teasers.length}`;
    teasers.forEach(function(selection) {
        selection.forEach(function (el) {
            if (count === current) {
                el.removeAttribute("style")
            } else {
                el.setAttribute("style", "display:none;")
            }
        })
        count++;
    })
}

function updateButtons() {
    if (currentView === 0) {
        nextBtn.setAttribute("style", "display:none;");
    } else {
        nextBtn.removeAttribute("style");
    }

    if (currentView === (teasers.length - 1)) {
        prevBtn.setAttribute("style", "display:none;");
    } else {
        prevBtn.removeAttribute("style");
    }
}

nextBtn.addEventListener("click", function() {
    currentView--;
    updateButtons();
    updateView(currentView);
})

prevBtn.addEventListener("click", function() {
    currentView++;
    updateButtons();
    updateView(currentView);
})


updateButtons();
updateView(0);