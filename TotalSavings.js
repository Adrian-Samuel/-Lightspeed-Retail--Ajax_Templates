// Event Listener, runs the code inside of it when all content on page is fully loaded
document.addEventListener("DOMContentLoaded", function() {

    let str = window.location.href; // Getting the URL of the Sale
    let new_num = str.replace(/[\s\S]+?([\d]+)\.html[\s\S]+/ig, "$1"); //Getting the SaleID from the URL
    let radPatt = /[\s\S]+\bAccount\/\b(\d{1,})[\s\S]+/ig;
    let RAD = str.replace(radPatt, "$1"); // Getting the RAD from the URL
    let domain = window.location.host; // Getting the domain host from the URL
    let thankYou = document.querySelector('.thankyou'); // Selecting the DOM element that contains the thank you

    fetch(`https://${domain}/API/Account/${RAD}/DisplayTemplate/Sale/${new_num}.json`, {
            credentials: "same-origin"
        }) // Ensuring that I can have access to cross domain pages with my credentials
        .then((response) => response.json()) // bringing the response to JSON
        .then((data) => {

            // Checking if the Sale contains more than one line item
            if (typeof data.Sale.SaleLines.SaleLine.length == "undefined") {

                // storing the amount paid on the sale for singular item into a variable
                let amountPaid = data.Sale.calcTotal;

                // storing the default price of the singular item into a variable
                let defaultPrice = data.Sale.SaleLines.SaleLine.Item.Prices.ItemPrice[0].amount;

                // storing the MSRP of the singular item into a variable
                let MSRP = data.Sale.SaleLines.SaleLine.Item.Prices.ItemPrice[1].amount;

                // if the ammount paid is not equal to the MSRP value of that same item, execute code within curly braces
                if (amountPaid != MSRP) {
                    // The Sale Promotion is the difference between the default sale price and the amount paid on that sale
                    let promotion = defaultPrice - amountPaid;

                    // The total savings of that singular item
                    let savings = MSRP - defaultPrice + promotion;
                    // adding the total sales in HTML on the page
                    thankYou.insertAdjacentHTML('afterend', `<span style="position:absolute; left: 409px; font-size: 9pt;">YOU SAVE $${savings.toFixed(2)} TODAY!</span>`);
                }
            }
            // If the sale contains only one line item
            else {
                let itemTotal = data.Sale.SaleLines.SaleLine; // The array of items on the sale
                let savings = 0
                // Looping through each item on the sale
                for (let i = 0; i < itemTotal.length; i++) {
                    // Storing the default price of each item from its index
                    let defaultPrice = data.Sale.SaleLines.SaleLine[i].Item.Prices.ItemPrice[0].amount;
                    // Storing the MSRP of each item from its index
                    let MSRP = data.Sale.SaleLines.SaleLine[i].Item.Prices.ItemPrice[1].amount;
                    // Storing the amount paid on the sale for the item via its index
                    let amountPaid = data.Sale.SaleLines.SaleLine[i].calcTotal;
                    // if the ammount paid is not equal to the MSRP value of that same item, execute code within curly braces
                    if (amountPaid != MSRP) {
                        // The Sale Promotion is the difference between the default sale price and the amount paid on that sale
                        let promotion = defaultPrice - amountPaid;
                        // Accumulate the total savings in a variable called saving on each loop
                        savings = savings + (MSRP - defaultPrice + promotion);

                    }

                } // Add that total savings amount in HTML on the page
                thankYou.insertAdjacentHTML('afterend', `<span style="position:absolute; left: 409px; font-size: 9pt;">YOU SAVE $${savings.toFixed(2)} TODAY!</span>`);

            }

        });

});
