import Game from "./game";
import { getLostText, init as initLanguage } from "./lang";
import {
  FAST_ANIMATIONS,
  LESS_COLORS,
  SHOW_SYMBOLS,
  bindToBooleanStore,
} from "./settings-store";

const scoreSpan = document.getElementById("score");
const nextColorsSpan = document.getElementById("next-colors");

const readSerializeState = () => {
  try {
    return localStorage.getItem("lastGame");
  } catch (_) {
    // ignore
  }
};

let oldInstance: Game | undefined = undefined;
const startGame = (ignoreSerialized: boolean) => {
  oldInstance?.terminate();
  const board = document.getElementById("board");
  const instance = (oldInstance = new Game({
    boardElement: board,
    reducedColors: LESS_COLORS.get(),
    boardHeight: 9,
    boardWidth: 9,
    spawnBallsAfterEveryMoveCount: 3,
    initialBallsCount: 5,
    requiredSameColorsBallsToClearCount: 5,
  }));

  instance.addEventListener("score-changed", (score) => {
    if (!instance.isActive) return;
    if (scoreSpan.innerText === `${score}`) return;
    const setter = () => void (scoreSpan.innerText = `${score}`);

    (document as any)?.startViewTransition(setter) ?? setter();
  });

  instance.addEventListener("game-over", (score) => {
    if (!instance.isActive) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => alert(getLostText(score)))
    );
  });

  instance.addEventListener("next-ball-colors-changed", (nextColors) => {
    if (!instance.isActive) return;
    const children = nextColorsSpan.children;
    if (children.length !== nextColors.length) {
      nextColorsSpan.innerHTML = "";
      for (const color of nextColors) {
        const span = document.createElement("span");
        span.style.setProperty("--color", `var(--${color})`);
        nextColorsSpan.appendChild(span);
      }
    } else {
      let i = 0;
      for (const child of children) {
        (child as HTMLElement).style.setProperty(
          "--color",
          `var(--${nextColors[i]})`
        );
        i++;
      }
    }
  });
  instance.deserializeGameOrReset(
    ignoreSerialized ? undefined : readSerializeState()
  );
  instance.scheduler.interval = 250 * (FAST_ANIMATIONS.get() ? 0.4 : 1);
};

document
  .getElementById("reset-btn")
  .addEventListener("click", () => startGame(true));
startGame(false);

if (
  (location.port === "" || location.port === "443") &&
  "serviceWorker" in navigator
) {
  navigator.serviceWorker.register("/sw.js");
}

let lastSerializationDate = Date.now();
const performSerialization = () => {
  const doRealPerform = () => {
    const now = Date.now();
    if (now - lastSerializationDate < 500) return;
    lastSerializationDate = now;
    try {
      const state = oldInstance?.serialize();
      localStorage.setItem("lastGame", state || "");
    } catch (_) {
      // ignore
    }
  };
  if (document.getElementById("board").classList.contains("moves-in-progress"))
    setTimeout(performSerialization, 500);
  else doRealPerform();
};

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") return;
  performSerialization();
});

window.addEventListener("blur", () => performSerialization());
initLanguage();

window.addEventListener("beforeinstallprompt", (e) => e.preventDefault());

bindToBooleanStore(
  LESS_COLORS,
  document.getElementById("checkbox-less-colors") as HTMLInputElement
);

document
  .getElementById("settings-btn")
  .addEventListener("click", () =>
    (document.querySelector("dialog") as HTMLDialogElement)?.showModal()
  );

document
  .getElementById("close-settings-btn")
  .addEventListener("click", () =>
    (document.querySelector("dialog") as HTMLDialogElement)?.close()
  );

bindToBooleanStore(
  FAST_ANIMATIONS,
  document.getElementById("checkbox-fast-animations") as HTMLInputElement,
  (fast) => {
    document.body.style.setProperty(
      "--animation-multiplier",
      `${fast ? 0.4 : 1}`
    );
    if (oldInstance)
      oldInstance.scheduler.interval = 250 * (FAST_ANIMATIONS.get() ? 0.4 : 1);
  }
);

bindToBooleanStore(
  SHOW_SYMBOLS,
  document.getElementById("checkbox-show-symbols") as HTMLInputElement,
  (show) => {
    document.body.classList.toggle(
      "show-symbols",
      show
    );
  }
);