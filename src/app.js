/**
 * StockMark Market Watcher app
 Current bugs:
 Menu must contain 5 companies otherwise it won't work.
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
  body: "Click the gear icon on the phone beside the app and type in your company's stock ticker symbol."
});

splashCard.show();


var parseFeed = function(data,quantity){
  var items = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      //uppercase desc string
      var title = data[key];
      if(title === ""){
        title = "Add another";
      }
      console.log(title);
      //add to menu items array
      items.push({
        title: title
      });
    }
  }
  //console.log(JSON.stringify(data));
  
  //return array
  return items;
};

// Set a configurable with just the close callback
Settings.config(
  { 
    url: 'http://omicrontech.comuv.com/config-page.html' 
  },
  function(e) {
    console.log('closed configurable');
    // Show the parsed response
  /*  ticker = JSON.stringify(e.options.ticker1);
    ticker = ticker.replace(/"/g,""); 
    var URL = "http://dev.markitondemand.com/Api/Quote/json?" + "symbol=" + ticker; */
     menuItems = parseFeed(e.options,5); //load menu items 
    resultsMenu = new UI.Menu({
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
          // Success!
          console.log('Successfully fetched stock data!');
          var name = data.Data.Name;
          var symbol = data.Data.Symbol;
          var lastprice = data.Data.LastPrice;
          var openprice = data.Data.Open;
          var change = data.Data.Change;
          var percentchange = data.Data.ChangePercent;
          //percentchange = percentchange.substring(0,2);
          percentchange = +percentchange.toFixed(2);
          change = +change.toFixed(2);
          var quotecard = new UI.Card({
            title: name + ", " + "(" + symbol + ")",
            body: "Last Price: " + lastprice + "\n" + "Open Price: " + openprice + "\n" + "Change: " + change + " (" + percentchange + "%)"
          });
          quotecard.show();
        },
        function(error) {
          // Failure!
          console.log('Failed fetching stock data: ' + error);
        }
      );
      }
      else{
        var instructions = new UI.Card({
            title: "Add another",
            body: "Open app configuration to set your companies(maximum 5)."
        });

        instructions.show();
      }
    });
    
    //construct menu to show to user
    console.log("menu");
    resultsMenu.show();
    splashCard.hide();
    
    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
      console.log("failed");
    }
  }
);

 