import { useState, useEffect } from "react";
import { GiftCard } from "./GiftCard";
import { submit } from "../functions/submit_function";

// Define interfaces for the card and company data
interface Card {
  card: string;
  price: number;
  expiry: Date;
}

interface CompanyData {
  name: string;
  price: number;
}

export function Card({ company }: { company: string }) {
  const [text, setText] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [cardData, setCardData] = useState({ name: '' });
  const [dateData, setDateData] = useState({ date: '' });
  const [priceData, setPriceData] = useState({ price: '' });
  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    setShowDetails(!showDetails);
  };

  const loadCompanyData = () => {
    const localStorageText = window.localStorage.getItem('companies');
    const cardList = window.localStorage.getItem(company.toUpperCase());

    if (localStorageText) {
      try {
        const data: CompanyData[] = JSON.parse(localStorageText);
        const companyName = company?.toUpperCase();
        const companyData = data.find((item: CompanyData) => item.name === companyName);

        if (companyData) {
          const price = companyData.price;
          setText(price.toString());
        } else {
          setText('0'); // If no company found, show 0
        }
      } catch (error) {
        console.error("Failed to parse local storage data", error);
        setText('0');
      }
    } else {
      setText('0');
    }

    if (cardList) {
      try {
        const cardData: Card[] = JSON.parse(cardList);
        setCards(cardData.map((card) => ({ ...card, expiry: new Date(card.expiry) })));
      } catch (error) {
        console.error('Failed to parse card list data', error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const priceValue = parseFloat(priceData.price) || 0;
    submit(company, cardData.name, priceValue, dateData.date);
    loadCompanyData();

    // Clear form after submission
    setPriceData({ price: '' });
    setCardData({ name: '' });
    setDateData({ date: '' });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadCompanyData(); // Load data on component mount

      // Load stored cards specific to this company
      const storedCards = localStorage.getItem(company?.toUpperCase());
      if (storedCards) {
        try {
          const data: Card[] = JSON.parse(storedCards);
          const cardsWithDates = data.map((card) => ({
            ...card,
            expiry: new Date(card.expiry),
          }));
          const sortedCards = cardsWithDates.sort(
            (a, b) => a.expiry.getTime() - b.expiry.getTime()
          );
          setCards(sortedCards);
        } catch (error) {
          console.error('Failed to parse local storage data', error);
        }
      }

      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'companies' || event.key === company?.toUpperCase()) {
          loadCompanyData(); // Re-load data when 'companies' or the specific company is updated
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [company]);

  return (
    <main className="p-3">
      <div className="flex flex-col rounded-xl bg-gray-50 p-10 shadow-sm hover:shadow-md ">
        <div className="flex justify-between items-center">
          <div className="flex flex-row items-center">
            <h1 className="font-semibold font-sans text-3xl">{company}</h1>
            <p className="font-mono ml-4">${text} remaining</p>
          </div>
          <div className="ml-auto px-5 flex flex-row">
            {showDetails && (
              <form onSubmit={handleSubmit}>
                <input
                  type="number"
                  placeholder="Balance"
                  value={priceData.price}
                  onChange={(e) => setPriceData({ price: e.target.value })}
                  className="rounded-md border-2 p-2"
                />
                <input
                  type="text"
                  placeholder="Gift Card"
                  value={cardData.name}
                  onChange={(e) => setCardData({ name: e.target.value })}
                  className="rounded-md border-2 p-2"
                />
                <input
                  type="date"
                  value={dateData.date}
                  onChange={(e) => setDateData({ date: e.target.value })}
                  className="rounded-md border-2 p-2"
                />
                <button type="submit" className="px-5 py-2 bg-cyan-50 hover:bg-cyan-500 rounded-full">Submit</button>
              </form>
            )}
            <button
              onClick={handleClick}
              className="hover:cursor-pointer hover:shadow-2xl bg-cyan-50 hover:bg-cyan-500 px-5 py-3 rounded-full text-xl"
            >
              +
            </button>
          </div>
        </div>
        <ol className="py-1">
          {cards.map((card) => (
            <li key={`${card.card}-${card.expiry.getTime()}`}>
              <GiftCard
                company={company}
                card={card.card}
                price={card.price}
                expiry={card.expiry}
                onButtonClick={loadCompanyData} // Call loadCompanyData when button is clicked
              />
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
