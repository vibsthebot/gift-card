import { useState, useEffect } from "react";
import Image from "next/image";

export function GiftCard({
  company,
  card,
  price,
  expiry,
  onButtonClick
}: {
  company: string;
  card: string;
  price: number;
  expiry: Date;
  onButtonClick: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [priceData, setPriceData] = useState<{ price: string }>({ price: "" });
  const [currentPrice, setCurrentPrice] = useState(price);

  const handleClick = () => {
    setShowDetails(!showDetails);
  };

  const handleButtonClick = () => {
    onButtonClick();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const priceValue = parseFloat(priceData.price) || 0;
    const storedCards = localStorage.getItem(company?.toUpperCase());
    const storedCompanies = localStorage.getItem('companies');

    if (storedCards && storedCompanies) {
      try {
        const data = JSON.parse(storedCards);
        const companyData = JSON.parse(storedCompanies);

        const index = data.findIndex((item: { card: string }) => item.card === card);
        const companyIndex = companyData.findIndex((item: { name: string }) => item.name === company);

        if (index !== -1 && companyIndex !== -1) {
          data[index].price += priceValue;
          localStorage.setItem(company.toUpperCase(), JSON.stringify(data));

          companyData[companyIndex].price += priceValue;
          localStorage.setItem('companies', JSON.stringify(companyData));

          setCurrentPrice(data[index].price);
        } else {
          console.error("Card not found.");
        }
      } catch (error) {
        console.error("Failed to parse local storage data", error);
      }
    } else {
      console.error("No data found for company:", company);
    }

    onButtonClick();
  };

  useEffect(() => {
    const storedCards = localStorage.getItem(company?.toUpperCase());
    if (storedCards) {
      try {
        const data = JSON.parse(storedCards);
        const index = data.findIndex((item: { card: string }) => item.card === card);
        if (index !== -1) {
          setCurrentPrice(data[index].price);
        }
      } catch (error) {
        console.error("Failed to parse local storage data", error);
      }
    }
  }, [company, card]);

  return (
    <main className="py-3">
      <div className="rounded-xl bg-gray-100 p-3 shadow-sm hover:shadow-sm">
        <div className="flex flex-row justify-between items-center" onClick={handleClick}>
          <p>
            {card} : ${currentPrice} left. Expires on{" "}
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(expiry)}
          </p>
          <div
            className={`cursor-pointer transform ${
              showDetails ? "rotate-180" : "rotate-0"
            } transition-transform duration-500`}
          >
            <Image
              className="cursor-pointer"
              src={"/54785.png"}
              alt="Logo"
              width={20}
              height={20}
            />
          </div>
        </div>

        {showDetails && (
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              placeholder="Balance Change"
              value={priceData.price}
              onChange={(e) => setPriceData({ price: e.target.value })}
              className="rounded-md border-2 p-2"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-50 hover:bg-cyan-500 rounded-full"
              onClick={handleButtonClick}
            >
              +/-
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
