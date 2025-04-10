import { useEffect, useState } from "react";
import pbj from "./assets/pbj.gif";
import pbj2 from "./assets/pbj2.gif";
import CHARACTERPOOL, {hardcorepool} from "./characterpool";
import useLocalState from "./useLocalState";


type MessageType = {
  message: string;
  type: string;
};

function App() {
  const [hardMode, setHardMode] = useState(false);
  const [hardcoreMode, setHardcoreMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(hardcoreMode? 750:hardMode ? 1000 : 2000);
  const [percentageLeft, setPercentageLeft] = useState(100);
  const [gameOver, setGameOver] = useState(true);
  const [checkChar, setCheckChar] = useState(
    hardcoreMode? hardcorepool[Math.floor(Math.random() * hardcorepool.length)]:CHARACTERPOOL[Math.floor(Math.random() * CHARACTERPOOL.length)]
  );
  const [toast, setToast] = useState<MessageType | undefined>(undefined);
  const [score, setScore] = useLocalState("score", 0);
  const [highScore, setHighScore] = useLocalState("highScore", {
    normal: 0,
    hard: 0,
    hardcore: 0,
  });


  useEffect(() => {
    setPercentageLeft(timeLeft / (hardcoreMode? 7:hardMode ? 10 : 20));
  }, [timeLeft, percentageLeft]);

  // time-out toast
  useEffect(() => {
    if (!gameOver && timeLeft === 0) {
      setScore(0);
      setToast({ message: "too slow", type: "error" });
      setCheckChar(
        hardcoreMode? hardcorepool[Math.floor(Math.random() * hardcorepool.length)] : CHARACTERPOOL[Math.floor(Math.random() * CHARACTERPOOL.length)]
      );
      setGameOver(true);
    }
  }, [timeLeft, setScore, gameOver]);

  // KEYPRESS
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey && !event.ctrlKey && !event.metaKey) {
        const key = event.key;

        if (key.length === 1) {
          if (key === checkChar) {
            setToast({ message: "+1 point", type: "success" });
            setScore((prev: number) => prev + 1);
            if (hardMode) {
              if (score + 1 > highScore.hard) {
                setHighScore({ ...highScore, hard: highScore.hard + 1 });
              }
            } else if (hardcoreMode) {
              if (score + 1 > highScore.hardcore) {
                setHighScore({ ...highScore, hardcore: highScore.hardcore + 1 });
              }
            } else {
              if (score + 1 > highScore.normal) {
                setHighScore({ ...highScore, normal: highScore.normal + 1 });
              }
            }
          } else {
            setToast({ message: `${key} was wrong`, type: "error" });
            setScore(0);
            setGameOver(true);
          }
          setCheckChar(
            hardcoreMode? hardcorepool[Math.floor(Math.random() * hardcorepool.length)] : CHARACTERPOOL[Math.floor(Math.random() * CHARACTERPOOL.length)]
          );
          setTimeLeft(hardcoreMode? 750:hardMode ? 1000 : 2000);
        }
      }
    };
    if (!gameOver) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [checkChar, gameOver, highScore, score, setHighScore, setScore, timeLeft]);

  // set and remove Toast
  useEffect(() => {
    const timeout = setTimeout(() => {
      setToast(undefined);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [toast]);

  // timer
  useEffect(() => {
    // If timeLeft is 0, stop the timer
    if (timeLeft === 0) {
      return;
    }

    // Update the countdown every millisecond
    const intervalId = setInterval(() => {
      const reduceTime = (timeLeft: number) =>
        timeLeft > 0 ? timeLeft - 1 : 0;
      setTimeLeft(reduceTime(timeLeft));
    }, 1);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [setTimeLeft, timeLeft]);

  const handleClick = () => {
    setGameOver(false);
    setCheckChar(
      hardcorepool? hardcorepool[Math.floor(Math.random() * hardcorepool.length)] :CHARACTERPOOL[Math.floor(Math.random() * CHARACTERPOOL.length)]
    );
    setTimeLeft(hardcoreMode? 500: hardMode ? 1000 : 2000);
  };
  const handleReset = () => {
    setScore(0);
    setHighScore({
      normal: 0,
      hard: 0,
      hardcore: 0,
    });
  };

  return (
    <div className="flex flex-col items-start justify-start h-screen text-xl font-bold gap-10">
      <div className="navbar bg-base-100 px-4">
        <div className="navbar-start">
          <div className="flex gap-5 items-center">
            <button className="btn" onClick={handleReset}>
              reset highscore
            </button>
            <h2 className="hidden lg:flex">high score: </h2>
            <span className="text-sm">normal: {highScore.normal}</span>
            <span className="text-sm text-warning">hard: {highScore.hard}</span>
            <span className="text-sm text-error">hardcore: {highScore.hardcore}</span>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          {/* <a className="btn btn-ghost text-xl hidden md:flex">Typo 🍌</a> */}
          <h1
            className={hardcoreMode?`w-full text-3xl text-center ${
              hardcoreMode && "text-error"
            }`:`w-full text-3xl text-center ${
              hardMode && "text-warning"
            }`}
          >

            {hardcoreMode? "HARDCOREMODE☠️" : hardMode ? "HARDMODE 💀" : "normal mode"}
          </h1>
        </div>
        <div className="navbar-end gap-5">
          {gameOver && (
            <>
              <input
                type="checkbox"
                className="toggle toggle-warning"
                checked={hardMode}
                onChange={() => setHardMode((prev) => !prev)}
              />
              💀
              <input
                type="checkbox"
                className="toggle toggle-error"
                checked={hardcoreMode}
                onChange={() => setHardcoreMode((prev) => !prev)}
              />
              ☠️☠️☠️
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full h-full mt-20 gap-10 items-center justify-start">
        {gameOver ? (
          <div className="scale-[2.5] h-full flex items-center">
            <button
              className={hardcoreMode?`btn ${hardcoreMode && "btn-error"}`:`btn ${hardMode && "btn-warning"}`}
              onClick={handleClick}
              autoFocus
            >
              New Game
            </button>
          </div>
        ) : (
          <>
            <progress
              className={`progress w-2/3 h-5 md:h-10 ${
                percentageLeft > 60
                  ? "progress-success"
                  : percentageLeft > 30
                  ? "progress-warning"
                  : "progress-error"
              }`}
              value={percentageLeft}
              max="100"
            ></progress>
            <kbd className={`kbd kbd-lg text-neutral-content scale-150 md:scale-[3] my-14 ${hardcoreMode? "bg-error": hardMode?"bg-warning": ""}`}>
              {checkChar}
            </kbd>
            <span>score: {score}</span>
          </>
        )}
        {gameOver && (
          <div className="h-20">
            {toast?.type === "error" && (
              <span className="text-error">{toast.message}</span>
            )}
            {toast?.type === "success" && (
              <span className="text-success">{toast.message}</span>
            )}
          </div>
        )}
        <div className="h-40 flex flex-col items-center">
          {!hardMode && highScore.normal !== 0 && score >= highScore.normal && (
            <>
              <img
                src={pbj}
                className="h-full"
                alt="peanut butter jelly dance"
              />
              <div>high score!!!</div>
            </>
          )}
          {hardMode && highScore.hard !== 0 && score >= highScore.hard && (
            <>
              <img
                src={pbj2}
                className="h-full"
                alt="peanut butter jelly dance"
              />
              <div>high score!!!</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
