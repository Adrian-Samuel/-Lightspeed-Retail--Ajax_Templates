// Event Listener, runs the code inside of it when all content on page is fully loaded
document.addEventListener("DOMContentLoaded", function() {

let str = window.location.href; 
 let new_num = str.replace(/[\s\S]+?([\d]+)\.html[\s\S]+/ig, "$1");  
 let radPatt = /[\s\S]+\bAccount\/\b(\d{1,})[\s\S]+/ig; 
 let RAD = str.replace(radPatt, "$1"); 
 let domain = window.location.host; 
 let thankYou =  document.querySelector('.thankyou'); 
fetch(`https://${domain}/API/Account/${RAD}/DisplayTemplate/Sale/${new_num}.json`, {
    credentials: "same-origin"}) 
    .then((response) => response.json()) 
    .then((data) => { 
if (typeof data.Sale.SaleLines.SaleLine.length  == "undefined") {
    let amountPaid = data.Sale.calcTotal;
     let defaultPrice = data.Sale.SaleLines.SaleLine.Item.Prices.ItemPrice[0].amount;  
     let MSRP = data.Sale.SaleLines.SaleLine.Item.Prices.ItemPrice[1].amount;
     let quantity = data.Sale.SaleLines.SaleLine.unitQuantity
   if((amountPaid/quantity) != MSRP || amountPaid/quantity) != defaultPrice) {
       let promotion = (defaultPrice * quantity) - amountPaid; 
       let savings = ((MSRP - defaultPrice )* quantity ) + promotion;
       thankYou.insertAdjacentHTML('afterend', `<span style="position:absolute; left: 409px; font-size: 9pt;">YOU SAVE $${savings.toFixed(2)} TODAY!</span>`);
    } 
}
else {
    let itemTotal = data.Sale.SaleLines.SaleLine; 
    let savings = 0
    for(let i = 0; i < itemTotal.length; i++ ) {
    	let quantity = data.Sale.SaleLines.SaleLine[i].unitQuantity;

    let defaultPrice = data.Sale.SaleLines.SaleLine[i].Item.Prices.ItemPrice[0].amount;
    let MSRP = data.Sale.SaleLines.SaleLine[i].Item.Prices.ItemPrice[1].amount;
    let amountPaid = data.Sale.SaleLines.SaleLine[i].calcTotal;
    if((amountPaid/quantity) != MSRP || amountPaid/quantity) != defaultPrice) {
        let promotion = (defaultPrice * quantity) - amountPaid;
        savings = savings + ((MSRP - defaultPrice) * quantity) + promotion;
    
        }
    } 
    thankYou.insertAdjacentHTML('afterend', `<span style="position:absolute; left: 409px; font-size: 9pt;">YOU SAVE $${savings.toFixed(2)} TODAY!</span>`);

}

});

});
