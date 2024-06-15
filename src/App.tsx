import React, { useState, ChangeEvent, useEffect } from "react";
import goodimg from "../src/assets/good.jpg";
import evilimg from "../src/assets/evil.jpg";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  Aptos,
  Account,
  Ed25519PrivateKey,
  InputViewFunctionData,
} from "@aptos-labs/ts-sdk";

import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

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

export const aptos = new Aptos();
// change this to be your module account address
export const moduleAddress =
  "d7e864c4e6350c95955ad62eaacfc53f19eaa1ee2c197a7f9b36284c363889a8";

const getFaBalance = async (
  owner: Account,
  assetType: string
): Promise<number> => {
  const data = await aptos.getCurrentFungibleAssetBalances({
    options: {
      where: {
        owner_address: { _eq: owner.accountAddress.toStringLong() },
        asset_type: { _eq: assetType },
      },
    },
  });
  return data[0]?.amount ?? 0;
};

const privateKey = new Ed25519PrivateKey(
  "0xc18a9a158cc0ccfe95798f526cfb9b4ee07ade0f0216d9434d02fb8dc3f56bb0"
);
const admin = Account.fromPrivateKey({ privateKey });

const App: React.FC = () => {
  const [range, setRange] = useState<Range>({ min: 1, max: 10 });
  const [guesses, setGuesses] = useState<string>("");
  const [cost, setCost] = useState<number>(0);
  const [result, setResult] = useState<string | null>(null);
  const [win, setWin] = useState<boolean>(false);
  const [randomNum, setRandomNum] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0); // Initial balance for demonstration
  const { account, connected } = useWallet(); // Use connected from useWallet
  const token = "0x65735cb9546ca07af21f4bef98ca581e30c3bdedf32c2a5d6c5e1419e95dee53"

  useEffect(() => {
    const guessArray = guesses.split(",").map(Number);
    const totalCost = guessArray.length * 10;
    setCost(totalCost);
  }, [guesses]);

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

  const handleSubmit = () => {
    const guessArray = guesses.split(",").map(Number);
    const randomNumGenerated =
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    setRandomNum(randomNumGenerated);
    const isWin = guessArray.includes(randomNumGenerated);
    setWin(isWin);
    setResult(`Result: ${isWin ? "Win" : "Lose"}`);
    if (isWin) {
      const winAmount = (range.max - range.min + 1 - guessArray.length) * 10;
      setBalance(balance + winAmount); // Add winnings to balance
    }
    setBalance(balance - cost); // Deduct cost from balance after submission
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
        {!connected ? (
          <div className="flex justify-between mb-4">
            <WalletSelector />
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded">
              {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
            </button>
            <p className="text-black mx-4">Balance: ${balance.toFixed(2)}</p>
            <button
              onClick={handleRedeemClick}
              className="bg-yellow-500 text-white py-2 px-4 rounded">
              Redeem
            </button>
          </div>
        )}
        {connected && (
          <>
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
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded mb-4 w-full">
              Set Range & Start
            </button>
            <div className="mb-4">
              <p>Cost = {cost}</p>
              <p>
                Winning Chance = {guesses.split(",").length}/
                {range.max - range.min + 1} ={" "}
                {(
                  guesses.split(",").length /
                  (range.max - range.min + 1)
                ).toFixed(1)}
              </p>
            </div>
            {result && (
              <div className="text-xl font-bold mb-4">
                <p>{result}</p>
                <p>Random Number: {randomNum}</p>
              </div>
            )}
            {win && (
              <p>
                Amount you win:{" "}
                {(range.max - range.min + 1 - guesses.split(",").length) * 10}
              </p>
            )}
            {showModal && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    Order NFT Stickers
                  </h2>
                  <div className="flex justify-between items-center mb-4">
                    <p>Balance: ${balance.toFixed(2)}</p>
                    <button className="bg-green-500 text-white py-2 px-4 rounded">
                      Order!
                    </button>
                  </div>
                  <div className="flex justify-center space-x-4">
                    {nftData.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col items-center bg-gray-200 p-4 rounded-lg">
                        <img
                          src={item.Image}
                          alt={item.title}
                          className="w-32 h-32 mb-2"
                        />
                        <p className="text-lg">
                          {item.title} - ${item.price}
                        </p>
                        <button className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded">
                          Mint
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
