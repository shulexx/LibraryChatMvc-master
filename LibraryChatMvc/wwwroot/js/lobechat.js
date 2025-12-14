/* --------------------------------------------------------
   LOAD TOPICS (LEFT PANEL)
-------------------------------------------------------- */
async function loadTopics() {
    const res = await fetch("http://localhost:5169/api/topics");
    const topics = await res.json();

    const list = document.getElementById("topicList");
    list.innerHTML = "";

    topics.forEach(t => {
        const item = document.createElement("div");
        item.className = "topic-item";
        item.innerText = t;
        list.appendChild(item);
    });
}

/* --------------------------------------------------------
   LOAD RECOMMENDED BOOKS (RIGHT PANEL)
-------------------------------------------------------- */
function updateBookPanel(books) {
    const panel = document.getElementById("bookPanel");
    panel.innerHTML = "";

    books.forEach(b => {
        const div = document.createElement("div");
        div.className = "book-item";
        div.innerText = b.Title;

        const tip = document.createElement("div");
        tip.className = "tooltip";
        tip.innerHTML = `
            <b>${b.Title}</b><br>
            Yazar: ${b.Author}<br>
            Yıl: ${b.Year}
        `;

        div.appendChild(tip);
        panel.appendChild(div);
    });
}

/* --------------------------------------------------------
   CHAT MESSAGE RENDER
-------------------------------------------------------- */
function addMessage(text, isUser = false, markdown = false) {
    const box = document.getElementById("chat-box");

    const msg = document.createElement("div");
    msg.className = "lc-msg " + (isUser ? "lc-user" : "lc-ai");

    const avatar = document.createElement("div");
    avatar.className = "avatar " + (isUser ? "avatar-user" : "avatar-ai");

    const bubble = document.createElement("div");
    bubble.className = "lc-bubble " + (isUser ? "lc-bubble-user" : "lc-bubble-ai");

    bubble.innerHTML = markdown ? marked.parse(text) : text;

    msg.appendChild(avatar);
    msg.appendChild(bubble);

    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
}

/* --------------------------------------------------------
   TYPING ANIMATION
-------------------------------------------------------- */
function addTyping() {
    const box = document.getElementById("chat-box");

    const wrapper = document.createElement("div");
    wrapper.className = "lc-msg lc-ai";
    wrapper.id = "typing";

    wrapper.innerHTML = `
        <div class="avatar avatar-ai"></div>
        <div class="lc-bubble lc-bubble-ai">
            <div class="typing-dots">
                <div></div><div></div><div></div>
            </div>
        </div>
    `;

    box.appendChild(wrapper);
    box.scrollTop = box.scrollHeight;
}

function removeTyping() {
    const t = document.getElementById("typing");
    if (t) t.remove();
}

/* --------------------------------------------------------
   SEND MESSAGE
-------------------------------------------------------- */
async function sendMsg() {
    const input = document.getElementById("message");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = "";

    addTyping();

    const res = await fetch("/Chat/Ask", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `message=${encodeURIComponent(text)}`
    });

    const data = await res.json();

    removeTyping();

    addMessage(data.answer, false, true);

    if (data.books)
        updateBookPanel(data.books);
}

/* --------------------------------------------------------
   INIT
-------------------------------------------------------- */
window.onload = () => {
    loadTopics();
    addMessage(
        "**Merhaba!** Millet Kütüphanesi Yapay Zekâ Asistanı'na hoş geldiniz.\n\n" +
        "Solda konular, sağda tavsiye kitapları görebilirsiniz.\nBir soru yazabilirsiniz.",
        false, true
    );
};
