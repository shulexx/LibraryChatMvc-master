// ========== SOL PANEL: TOPICS YÜKLE ==========
async function loadTopics() {
    const res = await fetch("http://localhost:5169/api/topics");
    const topics = await res.json();

    const list = document.getElementById("topic-list");
    list.innerHTML = "";

    topics.forEach(t => {
        const li = document.createElement("li");
        li.textContent = t;
        list.appendChild(li);
    });
}

loadTopics();


// ========== SAĞ PANEL: RECOMMENDATIONS ==========
function updateRecommendations(books) {
    const list = document.getElementById("recommend-list");
    list.innerHTML = "";

    books.forEach(b => {
        const li = document.createElement("li");
        li.className = "recommend-item";
        li.innerText = b.title;
        li.dataset.author = b.author;
        li.dataset.year = b.year;
        li.dataset.summary = b.summary;

        li.addEventListener("mousemove", showHoverCard);
        li.addEventListener("mouseleave", hideHoverCard);

        list.appendChild(li);
    });
}


// ========== Hover Kartı ==========
function showHoverCard(e) {
    const card = document.getElementById("hover-card");

    card.innerHTML = `
        <b>${this.innerText}</b><br>
        Yazar: ${this.dataset.author}<br>
        Yıl: ${this.dataset.year}
    `;

    card.style.display = "block";
    card.style.left = (e.pageX + 15) + "px";
    card.style.top = (e.pageY + 15) + "px";
}

function hideHoverCard() {
    const card = document.getElementById("hover-card");
    card.style.display = "none";
}
