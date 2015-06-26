/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var Settings = require('settings');
var UI = require('ui');
var ajax = require('ajax');
var ticker;
//show opening card
var splashCard = new UI.Card({
  title: "Open App configuration",
  body: "Click the gear icon on the phone beside the app and type in your company's stock ticker symbol."
});

splashCard.show();

// Set a configurable with just the close callback
Settings.config(
  { 
    url: 'http://omicrontech.comuv.com/config-page.html' 
  },
  function(e) {
    console.log('closed configurable');
    // Show the parsed response
    ticker = JSON.stringify(e.options.ticker);
    //ticker = ticker.replace("\"", "");
    //ticker = ticker.replace("\"", "");
    ticker = ticker.replace(/"/g,"");
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
    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
      console.log("failed");
    }
  }
);
