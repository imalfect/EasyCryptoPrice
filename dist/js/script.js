const priceDownClasses = ['bg-gradient-to-r', 'from-red-500', 'to-orange-950', 'text-transparent','dark:from-red-500', 'dark:to-red-700']
const priceUpClasses = ['bg-gradient-to-r', 'from-green-500', 'to-blue-950', 'text-transparent']
let selectedCoinId = '';
let coinArrayList = [];
async function getCoinInfo() {
    const numberFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2, // Set the minimum number of decimal digits to 8
        maximumFractionDigits: 10, // Set the maximum number of decimal digits to 8
    });
    if (selectedCoinId === '') {
        alert('Please enter a coin name');
        return;
    }
    const coinInfo = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selectedCoinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false'`)
            .then(res => res.json())
    console.log(coinInfo);
    // Image
    const image = coinInfo.image.large;
    // Price
    const price = coinInfo.market_data.current_price.usd;
    // Name
    const name = coinInfo.name;
    // Symbol
    const symbol = coinInfo.symbol;
    // 24h high and low
    const high24 = coinInfo.market_data.high_24h.usd;
    const low24 = coinInfo.market_data.low_24h.usd;
    // 24h volume
    const volume24 = coinInfo.market_data.total_volume.usd;

    // Display data
    document.getElementById('coinLogo').src = image;
    document.getElementById('coinName').innerHTML = `${name} (${symbol.toUpperCase()})`;
    document.getElementById('coinPriceAndChange').innerHTML = `${numberFormatter.format(price)} 
    (${coinInfo.market_data.price_change_percentage_24h.toFixed(2)}%)`;
    // Set classes for price change
    const priceChange = coinInfo.market_data.price_change_percentage_24h;
    if (priceChange < 0) {
        // Remove up classes
        priceUpClasses.forEach(className => {
            document.getElementById('coinPriceAndChange').classList.remove(className);
        });
        priceDownClasses.forEach(className => {
            document.getElementById('coinPriceAndChange').classList.add(className);
        })
    } else {
        // Remove down classes
        priceDownClasses.forEach(className => {
            document.getElementById('coinPriceAndChange').classList.remove(className);
        });
        priceUpClasses.forEach(className => {
            document.getElementById('coinPriceAndChange').classList.add(className);
        });
    }
    console.log(high24)
    console.log(low24);
    document.getElementById('24hHigh').innerHTML = numberFormatter.format(high24);
    document.getElementById('24hLow').innerHTML = numberFormatter.format(low24);
    document.getElementById('24hVolume').innerHTML = numberFormatter.format(volume24);
    // Show the coin info div
    document.getElementById('cryptoPriceDisplayDiv').classList.remove('hidden');
}

async function getCoinList() {
    // Check if saved in localStorage
    const coinListJSONString = localStorage.getItem('coinList');

    if (coinListJSONString) {
        // Get coinlist from localStorage and parse it
        const coinListJSON = JSON.parse(coinListJSONString);
        // Check expiration date (coinListJSON.expiresOn) is a unix timestamp
        const currentUnixTime = Math.round(new Date().getTime() / 1000);

        if (coinListJSON.expiresOn < currentUnixTime) {
            const newCoinList = await fetchCoinList();
            // Set the new expiration date and update localStorage
            console.log('Setting localStorage');
            let autocompleteArray = [];
            for (const coin of newCoinList) {
                autocompleteArray.push({
                    name: `${coin.name} (${coin.symbol.toUpperCase()})`,
                    id: coin.id
                })
            }
            const newCoinListJSON = {
                expiresOn: currentUnixTime + 86400,
                coinList: newCoinList,
                autocompleteArray: autocompleteArray
            };
            localStorage.setItem('coinList', JSON.stringify(newCoinListJSON));
        }
    } else {
        const newCoinList = await fetchCoinList();
        const currentUnixTime = Math.round(new Date().getTime() / 1000);
        // Set the new expiration date and update localStorage
        console.log('Setting localStorage');
        let autocompleteArray = [];
        for (const coin of newCoinList) {
            autocompleteArray.push({
                name: `${coin.name} (${coin.symbol.toUpperCase()})`,
                id: coin.id
            })
        }
        const newCoinListJSON = {
            expiresOn: currentUnixTime + 86400,
            coinList: newCoinList,
            autocompleteArray: autocompleteArray
        };
        localStorage.setItem('coinList', JSON.stringify(newCoinListJSON));
    }
    coinList = JSON.parse(localStorage.getItem('coinList')).autocompleteArray;
    loadAutoComplete();
}

function loadAutoComplete() {
    // Get the input element
    var input = document.getElementById("coinNameInput");

    // Initialize Awesomplete
    var awesomplete = new Awesomplete(input, {
        maxItems: 5,
        list: coinList.map(function (coin) {
            return coin.name;
        }),
        filter: function (text, input) {
            return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
        },
        replace: function (text) {
            let lastToken = this.input.value.match(/[^,]*$/)[0];
            this.input.value = this.input.value.replace(
                new RegExp(lastToken + "$"),
                text
            );
            // You can log the corresponding ID to the console here
            let selectedCoin = coinList.find((element) => element.name === text.label);
            if (selectedCoin) {
                selectedCoinId = selectedCoin.id;
                console.log("Selected Coin ID: " + selectedCoin.id);
            }
        },
    });
}
async function fetchCoinList() {
    return await fetch(
        'https://api.coingecko.com/api/v3/coins/list'
    ).then(res => res.json());
}
