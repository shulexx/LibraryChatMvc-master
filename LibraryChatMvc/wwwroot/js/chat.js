function addMessage(text, isUser = false) {
    const box = document.getElementById("chat-box");

    const wrapper = document.createElement("div");
    wrapper.className = "message " + (isUser ? "user-msg" : "bot-msg");

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble " + (isUser ? "msg-user" : "msg-bot");
    bubble.innerText = text;

    wrapper.appendChild(bubble);
    box.appendChild(wrapper);

    box.scrollTop = box.scrollHeight;
}

async function sendMessage() {
    const msg = document.getElementById("message").value;
    if (!msg.trim()) return;

    addMessage(msg, true);
    document.getElementById("message").value = "";

    if (window.lastOcrText) {

        if (msg.toLowerCase() === "hayır" && !window.awaitingOcrRetry) {

            addMessage("📷 Tekrar fotoğraf çekmek ister misin? (evet / hayır)", false);
            window.awaitingOcrRetry = true;
            return;
        }

        if (msg.toLowerCase() === "evet" && !window.awaitingOcrRetry) {

            addMessage("📚 Kitap aranıyor...", false);

            const res2 = await fetch("/Chat/Search", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `text=${encodeURIComponent(window.lastOcrText)}`
            });

            const found = await res2.json();

            if (found.length > 0) {
                const b = found[0];
                addMessage(
                    `📘 *${b.title}* bulundu!\n\nYazar: ${b.author}\nYayıncı: ${b.publisher}\nKonu: ${b.subject}`,
                    false
                );
            } else {
                addMessage("❌ Kitap bulunamadı.", false);
            }

            window.lastOcrText = null;
            return;
        }

        if (window.awaitingOcrRetry && msg.toLowerCase() === "evet") {

            addMessage("📸 Kamera açılıyor...", false);

            window.awaitingOcrRetry = false;
            window.lastOcrText = null;

            openCamera();
            return;
        }

        if (window.awaitingOcrRetry && msg.toLowerCase() === "hayır") {

            addMessage("Tamam, devam edebilirsiniz.", false);

            window.awaitingOcrRetry = false;
            window.lastOcrText = null;

        }
    }

    addMessage("Yazıyor...", false);
    const box = document.getElementById("chat-box");
    const loadingBubble = box.lastChild;

    const res = await fetch("/Chat/Ask", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `message=${encodeURIComponent(msg)}`
    });

    const data = await res.json();

    loadingBubble.remove();

    addMessage(data.answer, false);
}


let stream = null;

async function startCamera() {
    const video = document.getElementById("camera");
    video.style.display = "block";

    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
}

async function capturePhoto() {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("captureCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");

    closeCamera();

    addMessage("📷 Fotoğraf alındı, OCR yapılıyor...", false);

    const res = await fetch("/Chat/Ocr", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `imageBase64=${encodeURIComponent(base64)}`
    });

    const data = await res.json();
    const text = data.text.trim();

    window.lastOcrText = text;

    addMessage("📙 OCR Kitap Adı: " + text, false);
    addMessage(`Bu kitap adı doğru mu? "${text}" (evet / hayır)`, false);
}


function openCamera() {
    const container = document.getElementById("camera-container");
    container.style.display = "flex";

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
            stream = s;
            document.getElementById("camera").srcObject = s;
        });

    document.getElementById("camera").onclick = capturePhoto;

    addMessage("📸 Kamera açık. Fotoğraf çekmek için küçük pencereye tıklayın.", false);
}

function closeCamera() {
    const container = document.getElementById("camera-container");
    container.style.display = "none";

    if (stream) {
        stream.getTracks().forEach(t => t.stop());
    }
}


