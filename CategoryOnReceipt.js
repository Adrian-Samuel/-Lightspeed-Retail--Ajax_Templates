let str = window.location.href;
let new_num = str.replace(/[\s\S]+?([\d]+)\.html[\s\S]+/ig, "$1");
let apiSale = fetch(`https://us.merchantos.com/API/Account/127704/DisplayTemplate/Sale/${new_num}.json`, {
    credentials: "same-origin"
}).then((response) => response.json());
let apiCategory = fetch("https://us.merchantos.com/API/Account/127704/Category.json", {
    credentials: "same-origin"
}).then((response) => response.json());
let saleData = {
    "apiSale": {},
    "apiCategory": {}
};
Promise.all([apiSale, apiCategory]).then((values) => {
    saleData["apiSale"] = values[0];
    saleData["apiCategory"] = values[1];
    var items = document.querySelectorAll('table.sale.lines div:first-child');
    if (items.length === 1) {
        if (items[0].classList.contains("line_description")) {
            if (saleData.apiSale.Sale.SaleLines.SaleLine.Item.categoryID == 0) {

                console.log("I have no category");

            }  else { 
            for (var x = 0; x < saleData.apiCategory.Category.length; x++) {
                if (saleData.apiSale.Sale.SaleLines.SaleLine.Item.categoryID == saleData.apiCategory.Category[x].categoryID) {
                    console.log("My Category name is " + saleData.apiCategory.Category[x].name);
                }
            }
        }
        } else {
            console.log("I am not an inventoried item");
        }
    } else {
        for (var i = 0; i < items.length; i++) {
            if (items[i].classList.contains("line_description")) {
                if (saleData.apiSale.Sale.SaleLines.SaleLine[i].Item.categoryID == 0){
                    console.log("I have no category");
                } else {

                
                for (var x = 0; x < saleData.apiCategory.Category.length; x++) {
                    if (saleData.apiSale.Sale.SaleLines.SaleLine[i].Item.categoryID == saleData.apiCategory.Category[x].categoryID) {
                        console.log("My Category name is " + saleData.apiCategory.Category[x].name);
                    }
                }
            }
            } else {
                console.log("I am not an inventoried item");
            }
        }
    }
});
