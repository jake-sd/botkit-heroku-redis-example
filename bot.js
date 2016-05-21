var Botkit = require('botkit');
var redis = require('botkit/lib/storage/redis_storage');
var http = require('http');
var url = require('url');

var redisURL = url.parse(process.env.REDISCLOUD_URL);
var redisStorage = redis({
    namespace: 'botkit-example',
    host: redisURL.hostname,
    port: redisURL.port,
    auth_pass: redisURL.auth.split(":")[1]
});

var controller = Botkit.slackbot({
    storage: redisStorage
});

var bot = controller.spawn({
    token: process.env.SLACK_TOKEN
}).startRTM();

controller.hears(['hello','hi'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.reply(message,"Hello, I'm Super Soul, you can get a list of options by typing: help");
});

// HELP
controller.hears(['help'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.reply(message,"*Type one of these options:*\nDeveloper Onboarding\nContacts\nValues\nFive C's\nBenefits\nPayroll\nWhy is your name Super Soul");
});

// 5 C's
controller.hears(['Five c\'s', '5 Cs', 'Five C', 'Five Cs', 'Five C\'s'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.reply(message,"Culture\nCompany\nClients\nCreative\nCommunity");
});

// Contacts
controller.hears(['contact', 'contacts', 'Developer Contacts'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.reply(message,"Beau: 816-271-3763\nDylan: 410-707-5302\nChaz: 202-498-5233\nPaige: 732-492-6499\nLuke: 978-270-8289\nJake: 202-549-9307\nTadeo: 703-577-0526");
});

// Health Benefits
controller.hears(['health', 'benefits', 'health benefits'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.reply(message,"Login to Zenefits https://secure.zenefits.com/accounts/login/");
});

// Payroll
controller.hears(['payroll', 'pay check', 'cheddar'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.reply(message,"Login to Gusto https://gusto.com/");
});


// Developer Onboarding
controller.hears(['Developer Onboarding', 'onboarding'],['direct_message','direct_mention'],function(bot,message) {

  var attachments = [];
  var attachment = {
    title: 'Welcome to Developer Onboarding',
    color: '#FFCC99',
    image_url: 'http://images.popmatters.com/misc_art/d/dvd-lifeaquatic-criterion-650.jpg',
    fields: [],
  };

  attachment.fields.push({
    label: 'Field',
    value: '<https://github.com/socialdriver/developer-onboarding/wiki/A-Common-Dev-Stack|Github - Developer Onboarding>',
    short: false,
  });

  attachments.push(attachment);

  bot.reply(message,{
    text: 'This is our Developer Repository...',
    attachments: attachments,
  },function(err,resp) {
    console.log(err,resp);
  });
});

// Values
controller.hears(['Values', 'Social Driver Values', 'What are our values', 'What are our values?'],['direct_message','direct_mention'],function(bot,message) {

  var attachments = [];
  var attachment = {
    image_url: 'http://socialdriver.com/wp-content/uploads/2015/07/ill-3.png',
    title: 'Social Driver Values',
    color: '#FFCC99',
    fields: [],
  };

  attachment.fields.push({
    label: 'Field',
    value: '1. Go beyond what\'s expected\n2. Put people above everything else\n3. Ask questions even if you think you know the answes\n 4. Believe we can do better\n5. Feel good at the end of the day',
    short: false,
  });

  attachments.push(attachment);

  bot.reply(message,{
    text: 'These are our values:',
    attachments: attachments,
  },function(err,resp) {
    console.log(err,resp);
  });
});


// Who Is Super Soul?
controller.hears(['Why is your name Super Soul','Why is your name supersoul'],['direct_message','direct_mention'],function(bot,message) {

  var attachments = [];
  var attachment = {
    title: 'This is who I am',
    color: '#FFCC99',
    image_url: 'http://caveofcult.co.uk/wp-content/uploads/2013/10/clvp.jpg',
    fields: [],
  };

  attachment.fields.push({
    label: 'Field',
    value: 'https://vimeo.com/38927008',
    short: false,
  });

  attachments.push(attachment);

  bot.reply(message,{
    text: 'See below...',
    attachments: attachments,
  },function(err,resp) {
    console.log(err,resp);
  });
});

controller.hears(['dm me'],['direct_message','direct_mention'],function(bot,message) {
  bot.startConversation(message,function(err,convo) {
    convo.say('Heard ya');
  });

  bot.startPrivateConversation(message,function(err,dm) {
    dm.say('Private reply!');
  });

});

controller.hears('^stop','direct_message',function(bot,message) {
  bot.reply(message,'Goodbye');
  bot.rtm.close();
});

// To keep Heroku's free dyno awake
http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Ok, dyno is awake.');
}).listen(process.env.PORT || 5000);
