function createConfetti() {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD", "#E74C3C"];
    const confettiCount = 1200;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      const size = Math.random() * 10 + 6;
      confetti.style.height = size + "px";
      confetti.style.width = size + "px";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
      confetti.style.animationDelay = Math.random() * 2 + "s";

      document.body.appendChild(confetti);

      confetti.addEventListener("animationend", () => {
        confetti.remove();
      });
    }
  }

// Start confetti after a delay (e.g., 2 seconds)
setTimeout(createConfetti, 6000);