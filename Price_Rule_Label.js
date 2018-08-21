/* AJAX template to display Price Rule discounts to labels to show saving */

  document.addEventListener("DOMContentLoaded", function() {

let domain = window.location.host;
let numbers = /[\s\S]+\bAccount\/\b(\d+)[\s\S]+\b\ItemAsLabel\/\b(\d+)[\s\S]+/ig;
let full_url = window.location.href;
let rad = full_url.replace(numbers, "$1");
let itemID = full_url.replace(numbers, "$2");
let test = localStorage.getItem('refSale');
      
	
    let sale_request =

    {
	    "employeeID": 2,
	    "registerID": 5,
	    "shopID": 1,
	    "completed": false,
        "taxCategoryID": "1",
        "enablePromotions": "true",
	    "SaleLines": {
	        "SaleLine": 
	        {
	            "itemID": itemID,
	            "unitQuantity": 1,
	        }, 
	    },

	};
    if (test != null) {
        sale_request.saleID= test;
      
     

    console.log(sale_request);
	fetch(`https://${domain}/API/Account/${rad}/Sale/${test}.json`, {
	  method: 'PUT',  
	  body: JSON.stringify(sale_request), 
	   credentials: "same-origin",
	  headers:{
	    'Content-Type': 'application/json'
	  }    
	}).then(res => res.json())
    .then((saleData) => {
        let promotionPrice = Number(saleData.Sale.calcTotal);
       let oldPrice = document.querySelector('.saleprice');
       let price = oldPrice.innerText;
       let currency = price.replace(/\d/g, "");
       oldPrice.style.cssText="text-decoration: line-through; font-size: 11pt ;";
        oldPrice.insertAdjacentHTML('beforebegin', `<p style="font-size: 20pt;">${currency}${promotionPrice.toFixed(2)}</p>`);

        let saleID = saleData.Sale.saleID;
        console.log(saleID);
        localStorage.setItem('refSale', saleID);
      
        let salelineID = saleData.Sale.SaleLines.SaleLine.saleLineID;
        console.log(salelineID);
       

            fetch(`https://${domain}/API/Account/${rad}/SaleLine/${salelineID}.json`, {
          method: 'DELETE', 
           credentials: "same-origin",
          headers:{
            'Content-Type': 'application/json'
          }    });
        
        
    });
 
} else {


    fetch(`https://${domain}/API/Account/${rad}/Sale.json`, {
        method: 'POST',  
        body: JSON.stringify(sale_request), 
         credentials: "same-origin",
        headers:{
          'Content-Type': 'application/json'
        }    
      }).then(res => res.json())
      .then((saleData) => {
          let promotionPrice = Number(saleData.Sale.calcTotal);
         let oldPrice = document.querySelector('.saleprice');
         let price = oldPrice.innerText;
         let currency = price.replace(/\d/g, "");
         oldPrice.style.cssText="text-decoration: line-through; font-size: 11pt ;";
          oldPrice.insertAdjacentHTML('beforebegin', `<p style="font-size: 20pt;">${currency}${promotionPrice.toFixed(2)}</p>`);
  
          let saleID = saleData.Sale.saleID;
          console.log(saleID);
          localStorage.setItem('refSale', saleID);
        
          let salelineID = saleData.Sale.SaleLines.SaleLine.saleLineID;
          console.log(saleLineID);
  
          let delete_data = {
  
              "archived": true
          }
  
              fetch(`https://${domain}/API/Account/${rad}/SaleLine/${salelineID}.json`, {
            method: 'DELETE', 
            body: JSON.stringify(delete_data), 
             credentials: "same-origin",
            headers:{
              'Content-Type': 'application/json'
            }    
          }).then(res => res.json())
          .then((postSaleData) => {
      
            fetch(`https://${domain}/API/Account/${rad}/SaleLine/${salelineID}.json`, {
                method: 'DELETE', 
                body: JSON.stringify(delete_data), 
                 credentials: "same-origin",
                headers:{
                  'Content-Type': 'application/json'
                }    
              }).then(res => res.json())
              .then((postSaleData) => {
                  
                  
                fetch(`https://${domain}/API/Account/${rad}/Sale/${test}.json`, {
	  method: 'DELETE', 
	   credentials: "same-origin",
	  headers:{
	    'Content-Type': 'application/json'
	  }    
	}).then(res => res.json())
    .then((archiveMe) => {

        console.log(archiveMe);
    });

              });
              
          });
          
          
      });




}


       


  });
