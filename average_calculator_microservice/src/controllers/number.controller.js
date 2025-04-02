import fetchNumbers from "../utils/fetchNumbers.js";

const WINDOW_SIZE = 10;
let slidingWindow = [];

export const getNumbers = async (req, res) => {
  try {
    const { numberid } = req.params;
    const validIds = { p: "primes", f: "fibo", e: "even", r: "rand" };

    if (!validIds[numberid]) {
      return res.status(400).json({ error: "Invalid number ID" });
    }

    const windowPrevState = [...slidingWindow];

    const newNumbers = await fetchNumbers(validIds[numberid]);

    const uniqueNumbers = newNumbers.filter((num) => !slidingWindow.includes(num));

    if (uniqueNumbers.length === 0) {
      return res.json({
        windowPrevState,
        windowCurrState: slidingWindow,
        numbers: newNumbers,
        avg: parseFloat(
          (slidingWindow.reduce((sum, num) => sum + num, 0) / slidingWindow.length || 0).toFixed(2)
        ),
      });
    }

    slidingWindow = [...slidingWindow, ...uniqueNumbers].slice(-WINDOW_SIZE);

    const avg = slidingWindow.length
      ? (slidingWindow.reduce((sum, num) => sum + num, 0) / slidingWindow.length).toFixed(2)
      : 0;

    res.json({
      windowPrevState,
      windowCurrState: slidingWindow,
      numbers: newNumbers,
      avg: parseFloat(avg),
    });
  } catch (error) {
    console.error("Error in getNumbers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
