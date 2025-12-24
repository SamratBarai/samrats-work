function createConfetti() {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD", "#E74C3C"];
  // Reduce confetti on low-end devices
  function getConfettiScale() {
    const mem = navigator.deviceMemory || 4;
    const cpus = navigator.hardwareConcurrency || 4;
    const ua = navigator.userAgent || '';
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua) || (navigator.userAgentData && navigator.userAgentData.mobile);
    let scale = 1;
    if (isMobile) scale = 0.4;
    if (mem <= 1.5 || cpus <= 1) scale = Math.min(scale, 0.25);
    else if (mem <= 2.5 || cpus <= 2) scale = Math.min(scale, 0.35);
    else if (mem <= 3.5 || cpus <= 3) scale = Math.min(scale, 0.6);
    return Math.max(0.25, Math.min(1, scale));
  }

  const confettiScale = getConfettiScale();
  const confettiCount = Math.max(40, Math.round(1200 * confettiScale));

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