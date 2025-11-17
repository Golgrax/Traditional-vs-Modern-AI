(() => {
  const body = document.body;
  if (!body) return;

  const details = Array.from(document.querySelectorAll(".point"));
  const nextBtn = document.querySelector(".nav-next");
  const prevBtn = document.querySelector(".nav-prev");
  const fullscreenBtn = document.querySelector(".fullscreen-toggle");
  const arrows = document.querySelectorAll(".nav-arrow");
  const nextHref = body.dataset.next;
  const prevHref = body.dataset.prev;

  const EDGE_X = 160;
  const EDGE_Y = 100;
  const FS_EDGE_X = 140;
  const FS_EDGE_Y = 120;

  const shouldResumeFullscreen =
    sessionStorage.getItem("resumeFullscreen") === "true";
  if (shouldResumeFullscreen) {
    sessionStorage.removeItem("resumeFullscreen");
    const attempt = () =>
      document.documentElement.requestFullscreen().catch(() => {});
    attempt();
    const resumeOnInteraction = () => {
      if (!document.fullscreenElement) {
        attempt();
      }
    };
    document.addEventListener("pointerdown", resumeOnInteraction, {
      once: true,
    });
    document.addEventListener("keydown", resumeOnInteraction, {
      once: true,
    });
  }

  function navigateTo(url) {
    if (!url) return;
    sessionStorage.setItem(
      "resumeFullscreen",
      document.fullscreenElement ? "true" : "false",
    );
    window.location.href = url;
  }

  function openNextDetail() {
    if (details.length) {
      const nextClosed = details.find((panel) => !panel.open);
      if (nextClosed) {
        nextClosed.open = true;
        nextClosed.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    if (nextHref) navigateTo(nextHref);
  }

  function closePreviousDetail() {
    if (details.length) {
      const opened = details.filter((panel) => panel.open);
      if (opened.length) {
        const target = opened[opened.length - 1];
        target.open = false;
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    if (prevHref) navigateTo(prevHref);
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleProximity(event) {
    const x = event.clientX ?? -1;
    const y = event.clientY ?? -1;
    const nearVerticalEdge =
      y >= 0 && (y < EDGE_Y || y > window.innerHeight - EDGE_Y);

    arrows.forEach((arrow) => {
      arrow.classList.remove("is-near");
      if (nearVerticalEdge) {
        arrow.classList.add("is-hidden-vertical");
      } else {
        arrow.classList.remove("is-hidden-vertical");
      }
    });

    if (!nearVerticalEdge) {
      if (prevBtn && x >= 0 && x <= EDGE_X) {
        prevBtn.classList.add("is-near");
      }
      if (nextBtn && x >= window.innerWidth - EDGE_X) {
        nextBtn.classList.add("is-near");
      }
    }

    if (fullscreenBtn) {
      const nearFullscreen =
        x >= window.innerWidth - FS_EDGE_X && y >= 0 && y <= FS_EDGE_Y;
      fullscreenBtn.classList.toggle("is-near", nearFullscreen);
    }
  }

  function resetHoverStates() {
    arrows.forEach((arrow) => {
      arrow.classList.remove("is-near");
      arrow.classList.add("is-hidden-vertical");
    });
    fullscreenBtn?.classList.remove("is-near");
  }

  nextBtn?.addEventListener("click", openNextDetail);
  prevBtn?.addEventListener("click", closePreviousDetail);

  document.addEventListener("pointermove", handleProximity);
  document.addEventListener("pointerleave", resetHoverStates);

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      openNextDetail();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      closePreviousDetail();
    } else if (event.key === "F11") {
      event.preventDefault();
      toggleFullscreen();
    }
  });

  fullscreenBtn?.addEventListener("click", toggleFullscreen);

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      fullscreenBtn?.classList.add("active");
    } else {
      fullscreenBtn?.classList.remove("active");
    }
  });
})();

