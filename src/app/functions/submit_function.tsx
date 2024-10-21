export const submit = (company: string, card: string, cost: number, expiry: string) => {
    let companyList: { card: string; price: number; expiry: Date }[] = [];
    let nameList: { name: string; price: number }[] = [];

    if (typeof window !== 'undefined') {
        const storedNames = localStorage.getItem('companies');
        const storedCompany = localStorage.getItem(company.toUpperCase());

        // Check if there is a stored company and name data
        if (storedNames) {
            nameList = JSON.parse(storedNames);
        }

        if (storedCompany) {
            companyList = JSON.parse(storedCompany).map((item: any) => ({
                ...item,
                expiry: new Date(item.expiry), // Convert stored date strings to Date objects
            }));
        }

        const expiryDate = new Date(expiry);

        // Handle name list update (without expiry)
        const existingNameIndex = nameList.findIndex(item => item.name === company.toUpperCase());
        let updatedNameList = [...nameList];

        if (existingNameIndex !== -1) {
            updatedNameList[existingNameIndex].price += cost;
        } else {
            const newName = { name: company.toUpperCase(), price: cost };
            updatedNameList.push(newName);
        }

        // Handle card list update (with expiry)
        const existingCardIndex = companyList.findIndex(item => item.card === card);
        let updatedCardList = [...companyList];

        if (existingCardIndex !== -1) {
            updatedCardList[existingCardIndex].price += cost;
        } else {
            const newCard = { card: card, price: cost, expiry: expiryDate };
            updatedCardList.push(newCard);
        }

        // Update localStorage with new or modified data
        localStorage.setItem('companies', JSON.stringify(updatedNameList));
        localStorage.setItem(company.toUpperCase(), JSON.stringify(updatedCardList));
    }
};
