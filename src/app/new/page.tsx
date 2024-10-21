"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({ name: '' });
  const [cardData, setCardData] = useState({ name: '' });
  const [dateData, setDateData] = useState({ date: '' });
  const [priceData, setPriceData] = useState({ price: '' });
  const [nameList, setNameList] = useState<{ name: string; price: number}[]>([]);
  const [companyList, setCompanyList] = useState<{ card: string; price: number; expiry: Date  }[]>([]);

  // Load existing names from local storage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedNames = localStorage.getItem('companies');
      const storedCompany = localStorage.getItem(formData.name.toUpperCase());
      if (storedNames) {
        setNameList(JSON.parse(storedNames).map((item: { name: string, price: number, expiry: string }) => ({
          ...item,
          expiry: new Date(item.expiry), // Convert stored date strings to Date objects
        })));
      }
      if (storedCompany) {
        setCompanyList(JSON.parse(storedCompany));
      }
    }
  }, [formData.name]); // Added formData.name as a dependency

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const priceValue = parseFloat(priceData.price) || 0;
    const expiryDate = new Date(dateData.date); // Convert string to Date object

    const existingNameIndex = nameList.findIndex(item => item.name === formData.name.toUpperCase());
    const existingCardIndex = companyList.findIndex(item => item.card === cardData.name);

    const updatedNameList = [...nameList];
    const updatedCardList = [...companyList];

    if (existingNameIndex !== -1) {
      updatedNameList[existingNameIndex].price += priceValue;
    } else {
      const newName = { name: formData.name.toUpperCase(), price: priceValue};
      updatedNameList.push(newName);
    }

    if (existingCardIndex !== -1) {
      updatedCardList[existingCardIndex].price += priceValue;
    } else {
      const newCard = { card: cardData.name, price: priceValue, expiry: expiryDate };
      updatedCardList.push(newCard);
    }

    // Update the state with the new lists
    setNameList(updatedNameList);
    setCompanyList(updatedCardList);

    // Store the updated lists in local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('companies', JSON.stringify(updatedNameList));
      localStorage.setItem(formData.name.toUpperCase(), JSON.stringify(updatedCardList));
    }

    // Clear the form after submission
    setFormData({ name: '' });
    setPriceData({ price: '' });
    setCardData({ name: '' });
    setDateData({ date: '' });
  };

  return (
    <div className="w-1/2 p-5">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="rounded-md border-2 p-2"
        />
        <input
          type="number"
          placeholder="Price Change"
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
    </div>
  );
}
