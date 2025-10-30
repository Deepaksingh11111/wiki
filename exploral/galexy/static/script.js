async function searchWiki() {
  const query = document.getElementById("query").value;
  const output = document.getElementById("output");
  output.innerHTML = "🔍 Searching Wikipedia...";
  const res = await fetch("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (data.error) return (output.innerHTML = "❌ " + data.error);
  output.innerHTML = `<h2>${data.title}</h2><p>${data.summary}</p>`;
  speakHindi(data.summary);
}

async function aiExplain() {
  const text = document.getElementById("output").innerText;
  const output = document.getElementById("output");
  output.innerHTML += "<p>🤖 Thinking...</p>";
  const res = await fetch("/ai_explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ summary: text }),
  });
  const data = await res.json();
  if (data.result) {
    output.innerHTML = `<h3>🤖 आशी का जवाब:</h3><p>${data.result}</p>`;
    speakHindi(data.result);
  } else {
    output.innerHTML = "❌ " + data.error;
  }
}

// 🎙️ Browser Voice Search
function voiceSearch() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-IN";
  recognition.start();
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    document.getElementById("query").value = text;
    searchWiki();
  };
}

// 🔊 Speak Hindi using browser voice
function speakHindi(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
}
// 🌠 Starfall Background Animation
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 1 + 0.5,
  });
}

function animateStars() {
  ctx.fillStyle = "rgba(0, 0, 20, 0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ffff";

  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });

  // 🌠 occasional shooting star
  if (Math.random() < 0.02) {
    const sx = Math.random() * canvas.width;
    const sy = Math.random() * 100;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(sx - i * 5, sy + i * 2, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + (1 - i / 20) + ")";
      ctx.fill();
    }
  }

  requestAnimationFrame(animateStars);
}
animateStars();

