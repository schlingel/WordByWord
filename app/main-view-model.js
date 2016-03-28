var Observable = require("data/observable").Observable;
var http = require('http');
var Ticker = require('./model/ticker').Ticker;

function createViewModel(fetchUrl) {
    console.log('Started with', fetchUrl);

    var viewModel = new Observable();
    viewModel.counter = 42;
    viewModel.message = '';
    viewModel.url = fetchUrl || 'http://derstandard.at/2000032894628/Kaiser-Franz-Joseph-I-Die-kalte-Sonne';
    viewModel.buttonLabel = 'Start';

    viewModel.handleReadTap = function() {
      if(viewModel.buttonLabel === 'Start') {
          viewModel.ticker.start();
          viewModel.set('buttonLabel', 'Pause');
      } else {
          viewModel.ticker.stop();
          viewModel.set('buttonLabel', 'Start')
          viewModel.buttonLabel = 'Start';
      }
    };

    fetchPage(viewModel.url, function(paragraphs) {
        viewModel.paragraphs = paragraphs;
        initTicker();
    });

    function initTicker() {
        viewModel.ticker =  new Ticker(viewModel.paragraphs);
        viewModel.ticker.timeout = 120;
        viewModel.ticker.setOnTickHandler(function(token) {
            viewModel.set('message', token);
        });
        viewModel.ticker.setOnFinishHandler(function() {
            viewModel.set('message', 'Finished');
            viewModel.buttonLabel = 'Start';
            initTicker();
        });
    }

    return viewModel;
}

function parseResult(resp) {
    if(resp.status === 'success') {
        return [resp.response.content];
    }

    return ['Error'];
}

function fetchPage(articleUrl, onData) {
    var url = "http://boilerpipe-web.appspot.com/extract?url={0}&extractor=ArticleExtractor&output=json&extractImages="
        .replace('{0}', encodeURIComponent(articleUrl));

    http.getJSON(url).then(function(data) {
        onData(parseResult(data));
    }, function() {
       onData(['Error']);
    });
}

exports.createViewModel = createViewModel;