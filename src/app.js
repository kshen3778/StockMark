/**
 * StockMark Market Watcher app
 TODO: Shake to update
 */
var Settings = require('settings');
var UI = require('ui');
var ajax = require('ajax');
var ticker;
var menuItems;
//menu
var resultsMenu;

//show opening card
var splashCard = new UI.Card({
  title: "Open App configuration",
  body: "Click the gear icon for this app on the phone."
});

splashCard.show();

//retrieves data from json
var parseFeed = function(data){
  var items = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      //uppercase desc string
      var title = data[key];
      if(title === ""){
        title = "Add another";
      }
      //add to menu items array
      items.push({
        title: title
      });
    }
  }
  return items;
};

// Set a configurable with just the close callback
Settings.config(
  { 
    url: 'http://omicrontech.comuv.com/config-page.html' 
  },
  function(e) {
    console.log(Object.keys(e.options).length);
    menuItems = parseFeed(e.options); //load menu items 
    //create menu
    resultsMenu = new UI.Menu({ //create menu
      sections: [{
        title: 'Companies',
        items: menuItems
      }]
    });
   

   resultsMenu.on('select', function(e) {
     
      ticker = e.item.title; //get clicked ticker
      ticker = ticker.replace(/"/g,""); //remove "" in string
      if(ticker != "Add another"){
          var URL = "http://dev.markitondemand.com/Api/Quote/json?" + "symbol=" + ticker; 
          //make ajax call to retrieve data
          ajax(
            {
              url: URL,
              type: 'json'
            },
            function(data) {
              //if such ticker doesn't exist
              if(data.hasOwnProperty("Message")){ 
                var invalid = new UI.Card({
                title: "Error loading data",
                body: "No symbol matches found. One or more ticker symbols may be invalid."
              });
              invalid.show();
              }
              // retrieve data for clicked company
              console.log('Successfully fetched stock data!');
              //get JSON data key values
              var name = data.Data.Name;
              var symbol = data.Data.Symbol;
              var lastprice = data.Data.LastPrice;
              var openprice = data.Data.Open;
              var change = data.Data.Change;
              var percentchange = data.Data.ChangePercent;
              percentchange = +percentchange.toFixed(2); //correct to 2 decimals
              change = +change.toFixed(2); //correct to 2 decimals
              //put + or - sign in front of change and percentchange
              if(change >= 0.00 ){
                change = "+" + change;
              }
              if(percentchange >= 0.00){
                percentchange = "+" + percentchange;
              }
              //create the stock quote card
              var quotecard = new UI.Card({
                title: name + ", " + "(" + symbol + ")",
                body: "Last Price: " + lastprice + "\n" + "Open Price: " + openprice + "\n" + "Change: " + change + " (" + percentchange + "%)"
              });
              quotecard.show();
            },
            function(error) {
              // Failure!
              console.log('Failed fetching stock data: ' + error);
              var errorcard = new UI.Card({
                title: "Error loading data",
                body: "Ensure you have proper internet connection and try restarting the app."
              });
              errorcard.show();
              
            }
          );
      }
      else{ //if user clicked on empty card
        var instructions = new UI.Card({
            title: "Add another",
            body: "Add another ticker via the configuration."
        });

        instructions.show();
      }
    });
    
    //construct menu to show to user
    resultsMenu.show();
    splashCard.hide();
    
    // Show the raw response if parsing failed
    if (e.failed) {
       console.log("failed to fetch JSON data");
       var failed = new UI.Card({
            title: "Error processing config data",
            body: "Ensure you have proper internet connection and try restarting the app."
       });
       failed.show();
    }
  }
);

 