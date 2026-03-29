const rateCache = {};

export const getConvertedAmount = async (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return parseFloat(amount).toFixed(2);
    
    // Check cache to avoid hitting the API repeatedly
    if (!rateCache[fromCurrency]) {
        try {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            if (!response.ok) throw new Error("Network error");
            const data = await response.json();
            rateCache[fromCurrency] = data.rates;
        } catch (error) {
            console.error("Failed to fetch exchange rates:", error);
            // Fallback: return original amount if API fails
            return parseFloat(amount).toFixed(2);
        }
    }
    
    const rate = rateCache[fromCurrency][toCurrency];
    if (rate) {
        return (parseFloat(amount) * rate).toFixed(2);
    }
    
    return parseFloat(amount).toFixed(2);
};
