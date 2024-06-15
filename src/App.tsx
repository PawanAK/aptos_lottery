import React, { useState, ChangeEvent } from 'react';
import goodimg from "../src/assets/good.jpg";
import evilimg from "../src/assets/evil.jpg";

interface Range {
  min: number;
  max: number;
}

interface NFTItem {
  title: string;
  price: number;
  Image: string;
  id: number;
}

const App: React.FC = () => {
  const [range, setRange] = useState<Range>({ min: 1, max: 10 });
  const [guesses, setGuesses] = useState<string>('');
  const [cost, setCost] = useState<number>(0);
  const [result, setResult] = useState<string | null>(null);
  const [win, setWin] = useState<boolean>(false);
  const [randomNum, setRandomNum] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const nftData: NFTItem[] = [
    { title: "Good Pack", price: 0, Image: goodimg, id: 1 },
    { title: "Evil Pack", price: 0, Image: evilimg, id: 2 },
  ];

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRange((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleGuessesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGuesses(e.target.value);
  };

  const calculateCost = () => {
    const guessArray = guesses.split(',').map(Number);
    setCost(guessArray.length * 10);
  };

  const handleSubmit = () => {
    const guessArray = guesses.split(',').map(Number);
    const randomNumGenerated = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    setRandomNum(randomNumGenerated);
    setWin(guessArray.includes(randomNumGenerated));
    setResult(`Result: ${guessArray.includes(randomNumGenerated) ? 'Win' : 'Lose'}`);
  };

  const handleRedeemClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 relative">
        <div className="flex justify-between mb-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded">Connect</button>
          <button onClick={handleRedeemClick} className="bg-yellow-500 text-white py-2 px-4 rounded">Redeem</button>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">Move-Lette</h1>
        <div className="flex mb-4">
          <input
            type="number"
            name="min"
            value={range.min}
            onChange={handleRangeChange}
            className="border p-2 mr-2 w-full"
          />
          <span className="self-center">to</span>
          <input
            type="number"
            name="max"
            value={range.max}
            onChange={handleRangeChange}
            className="border p-2 ml-2 w-full"
          />
        </div>
        <input
          type="text"
          value={guesses}
          onChange={handleGuessesChange}
          placeholder="Enter your guesses (e.g., 1,4,5)"
          className="border p-2 w-full mb-4"
        />
        <button
          onClick={() => {
            calculateCost();
            handleSubmit();
          }}
          className="bg-blue-500 text-white py-2 px-4 rounded mb-4 w-full"
        >
          Set Range & Start
        </button>
        <div className="mb-4">
          <p>Cost = {cost}</p>
          <p>Winning Chance = {guesses.split(',').length}/{range.max - range.min + 1} = {(guesses.split(',').length / (range.max - range.min + 1)).toFixed(1)}</p>
        </div>
        {result && (
          <div className="text-xl font-bold mb-4">
            <p>{result}</p>
            <p>Random Number: {randomNum}</p>
          </div>
        )}
        {win && (
          <p>
            Amount you win: {(range.max - range.min + 1 - guesses.split(',').length) * 10}
          </p>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-center">Order NFT Stickers</h2>
              <div className="flex justify-between items-center mb-4">
                <p>No items in cart. Total Price: $0.00</p>
                <button className="bg-green-500 text-white py-2 px-4 rounded">Order!</button>
              </div>
              <div className="flex justify-center space-x-4">
                {nftData.map(item => (
                  <div key={item.id} className="flex flex-col items-center bg-gray-200 p-4 rounded-lg">
                    <img src={item.Image} alt={item.title} className="w-32 h-32 mb-2" />
                    <p className="text-lg">{item.title} - ${item.price}</p>
                    <button className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded">Mint</button>
                  </div>
                ))}
              </div>
              <button onClick={handleCloseModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
