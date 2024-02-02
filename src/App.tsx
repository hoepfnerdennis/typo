import { useEffect, useState } from "react";

const CHARACTERPOOL = [
  "[",
  "]",
  "{",
  "}",
  "(",
  ")",
  "<",
  ">",
  "/",
  "|",
  ".",
  ",",
  ";",
  ":",
  "'",
  '"',
  "?",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "_",
  "-",
  "+",
  "=",
];

function App() {
  const [char, setChar] = useState("");
  const [checkChar, setCheckChar] = useState(
    CHARACTERPOOL[Math.floor(Math.random() * CHARACTERPOOL.length)]
  );
  const [correct, setCorrect] = useState(false);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey && !event.ctrlKey && !event.metaKey) {
        const key = event.key;

        if (key.length === 1) {
          setChar(key);
          console.log("soll: ", checkChar);
          console.log("ist: ", key);

          if (key === checkChar) {
            setCorrect(true);
            setTimeout(() => {
              setCorrect(false);
            }, 2000);
          } else {
            setWrong(true);
            setTimeout(() => {
              setWrong(false);
            }, 1000);
          }
          setCheckChar(
            CHARACTERPOOL[Math.floor(Math.random() * CHARACTERPOOL.length)]
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [checkChar]); // Now handleKeyDown will be updated whenever checkChar changes

  return (
    <div className="flex flex-col items-center text-xl font-bold gap-12">
      <div className="flex items-center gap-5">
        <div>Type this:</div>
        <kbd className="kbd">{checkChar}</kbd>
      </div>
      <div className="flex items-center gap-5">
        {!wrong && correct && (
          <div className="form-control">
            <div className="form-control">
              <label className="cursor-pointer label gap-2">
                <span className="label-text">voll gut</span>
                <input
                  type="checkbox"
                  checked
                  className="checkbox checkbox-success"
                />
              </label>
            </div>
          </div>
        )}
        {wrong && (
          <>
            <div className="label-text">das </div>
            {char && <kbd className="kbd">{char}</kbd>}
            <div className="label-text"> war nix 💩</div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
