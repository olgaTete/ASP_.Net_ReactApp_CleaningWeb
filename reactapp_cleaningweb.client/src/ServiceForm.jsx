import React, { useState } from 'react';

const ServiceForm = () => {
    const [city, setCity] = useState('');
    const [cityPrices, setCityPrices] = useState(null);
    const [totalMetres, setTotalMetres] = useState(0);
    const [selectedServices, setSelectedServices] = useState({});
    const [totalPrice, setTotalPrice] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCityChange = async (e) => {
        const selectedCity = e.target.value;
        setCity(selectedCity);

        if (selectedCity) {
            try {
                const response = await fetch(`https://localhost:7105/api/Services/${selectedCity}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setCityPrices(data);

                    const services = {};
                    data.services.forEach(service => {
                        services[service.options] = false;
                    });
                    setSelectedServices(services);
                } else {
                    setErrorMessage('Failed to fetch city prices');
                    setCityPrices(null);
                }
            } catch (error) {
                console.error('Error fetching city prices:', error);
                setErrorMessage('Error fetching city prices. Please try again later.');
                setCityPrices(null);
            }
        }
    };

    const handleServiceChange = (e) => {
        const { name, checked } = e.target;
        setSelectedServices((prevServices) => ({
            ...prevServices,
            [name]: checked,
        }));
    };

    const handleTotalMetresChange = (e) => {
        setTotalMetres(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedServicesList = Object.keys(selectedServices)
            .filter(service => selectedServices[service]);

        const payload = {
            city,
            totalMetres: parseInt(totalMetres),
            selectedServices: selectedServicesList,
        };

        try {
            const response = await fetch('https://localhost:7105/api/Services/CalculatePrice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                setTotalPrice(result.totalPrice);
            } else {
                alert('Error calculating the total price');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="service-form">
            <h1>Cleaning Service Pricing</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select City:</label>
                    <select value={city} onChange={handleCityChange}>
                        <option value="">--Select City--</option>
                        <option value="Stockholm">Stockholm</option>
                        <option value="Uppsala">Uppsala</option>
                    </select>
                </div>

                {cityPrices && (
                    <>
                        <h3>Prices for {cityPrices.city}</h3>
                        <p>Price per square meter: {cityPrices.pricePerSquareMeter} SEK</p>

                        {cityPrices.services.map((service) => (
                            <div key={service.options}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name={service.options}
                                        checked={selectedServices[service.options]}
                                        onChange={handleServiceChange}
                                    />
                                    {service.options} (Price: {service.price} SEK)
                                </label>
                            </div>
                        ))}
                    </>
                )}

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <br/>
                {cityPrices && (
                    <div>
                        <label>Total Square Meters to be Cleaned:</label>
                        <input
                            type="number"
                            min="0"
                            value={totalMetres}
                            onChange={handleTotalMetresChange}
                        />
                    </div>
                )}
                <br/>
                <button type="submit">Calculate Price</button>
            </form>
       
            {totalPrice !== null && (
                <div>
                    <h2>Total Price: {totalPrice} SEK</h2>
                </div>
            )}
        </div>
    );
};

export default ServiceForm;
