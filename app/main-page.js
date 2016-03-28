var createViewModel = require("./main-view-model").createViewModel;
var application = require('application');
var articleUrl = null;

if (application.android) {
    application.onLaunch = function (intent) {
        if(intent.getAction() === "android.intent.action.SEND"){
            console.log("SEND Intent");
            articleUrl = intent.getStringExtra('android.intent.extra.TEXT');
            console.log(intent.getStringExtra('android.intent.extra.TEXT'))
        }
    };
}



function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = createViewModel(articleUrl);
}

exports.onNavigatingTo = onNavigatingTo;