import { useEffect, useState, useRef } from "react";
import "./styles.css";

export default function SnakeEatGame() {
  const gridSize = 15;
  const INITIAL_SNAKE = [[5, 5]];
  const GRID = Array.from({ length: gridSize }, () =>
    new Array(gridSize).fill("")
  );

  const [snakeBody, setSnakeBody] = useState(INITIAL_SNAKE);
  const generateFood = () => {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    return [x, y];
  };
  const directionRef = useRef([1, 0]);
  // const [food, setFood] = use(generateFood());
  const foodRef = useRef(generateFood());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSnakeBody((prevSnakeBody) => {
        const newHead = [
          prevSnakeBody[0][0] + directionRef.current[0],
          prevSnakeBody[0][1] + directionRef.current[1],
        ];

        // Check for collisions with the walls
        if (
          newHead[0] < 0 ||
          newHead[0] >= gridSize ||
          newHead[1] < 0 ||
          newHead[1] >= gridSize ||
          prevSnakeBody.find(([x, y]) => {
            return newHead[0] === x && newHead[1] === y;
          })
        ) {
          directionRef.current = [1, 0];
          // Reset the snake to its initial position on collision
          return INITIAL_SNAKE;
        }
        const copySnakeBody = prevSnakeBody.map((arr) => [...arr]);
        if (
          newHead[0] === foodRef.current[0] &&
          newHead[1] === foodRef.current[1]
        ) {
          foodRef.current = generateFood();
        } else {
          copySnakeBody.pop();
        }

        copySnakeBody.unshift(newHead);
        return copySnakeBody;
      });
    }, 500);
    const handleDirection = (e) => {
      const key = e.key;

      if (key === "ArrowUp" && directionRef.current[0] !== 1) {
        directionRef.current = [-1, 0];
      } else if (key === "ArrowDown" && directionRef.current[0] !== -1) {
        directionRef.current = [1, 0];
      } else if (key === "ArrowRight" && directionRef.current[1] !== -1) {
        directionRef.current = [0, 1];
      } else if (key === "ArrowLeft" && directionRef.current[1] !== 1) {
        directionRef.current = [0, -1];
      }
    };

    window.addEventListener("keydown", handleDirection);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleDirection);
    };
  }, []);

  return (
    <div>
      <div className="container">
        {GRID.map((row, rx) =>
          row.map((col, ry) => {
            const isSnake = snakeBody.some(([x, y]) => x === rx && y === ry);
            const isFood =
              foodRef.current[0] === rx && foodRef.current[1] === ry;
            return (
              <div
                key={`${rx}-${ry}`}
                className={`cell ${isSnake ? "snakeStyle" : ""} ${
                  isFood ? "food" : ""
                }`}
              ></div>
            );
          })
        )}
      </div>
    </div>
  );
}
