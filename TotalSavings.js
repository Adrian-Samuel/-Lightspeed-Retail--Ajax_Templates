/*  Script to Calculate Total Savings on a sale. Total Savings = MSRP - Default Price + Promotion Value */

let str = window.location.href; // Getting the URL of the Sale
 let new_num = str.replace(/[\s\S]+?([\d]+)\.html[\s\S]+/ig, "$1");   //Getting the SaleID from the URL
 let radPatt = /[\s\S]+\bAccount\/\b(\d{1,})[\s\S]+/ig; 
 let RAD = str.replace(radPatt, "$1"); // Getting the RAD from the URL
 let domain = window.location.host; // Getting the domain host from the URL
 let thankYou =  document.querySelector('.thankyou');
 
fetch(`https://${domain}/API/Account/${RAD}/DisplayTemplate/Sale/${new_num}.json`, {
    credentials: "same-origin"}) // Ensuring that I can have access to cross domain pages with my credentials
    .then((response) => response.json()) // bringing the response to JSON
    .then((data) => { 

if (typeof data.Sale.SaleLines.SaleLine.length  == "undefined") {

    let amountPaid = data.Sale.calcTotal;
     let defaultPrice = data.Sale.SaleLines.SaleLine.Item.Prices.ItemPrice[0].amount;    
     let MSRP = data.Sale.SaleLines.SaleLine.Item.Prices.ItemPrice[1].amount;
   if(amountPaid != MSRP) {
       let promotion = defaultPrice - amountPaid;
       let savings = MSRP - defaultPrice + promotion;

       thankYou.insertAdjacentHTML('afterend', `<span style="position:absolute; left: 409px; font-size: 9pt;">YOU SAVE $${savings} TODAY!</span>`);
    } 
}
else {
    let itemTotal = data.Sale.SaleLines.SaleLine; 
    console.log(itemTotal);
    let savings = 0
    for(let i = 0; i < itemTotal.length; i++ ) {
    let defaultPrice = data.Sale.SaleLines.SaleLine[i].Item.Prices.ItemPrice[0].amount;
    let MSRP = data.Sale.SaleLines.SaleLine[i].Item.Prices.ItemPrice[1].amount;
    let amountPaid = data.Sale.SaleLines.SaleLine[i].calcTotal;
        if(amountPaid != MSRP) {
    
        let promotion = defaultPrice - amountPaid;
        savings = savings + (MSRP - defaultPrice + promotion);
    
        }
        
    }
    thankYou.insertAdjacentHTML('afterend', `<span style="position:absolute; left: 409px; font-size: 9pt;">YOU SAVE $${savings} TODAY!</span>`);

}

});

