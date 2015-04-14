var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
  host: '127.0.0.1',
  port: 8000,
  routes: { cors: true }
});

var plugins = [{
  register: require('hapi-mongodb'),
  options: {
    // url: "mongodb://127.0.0.1:27017/punisher",
    url: "mongodb://127.0.0.1/punisher",
    settings: {db: { native_parser: false}}
  }
}];

server.register(plugins, function(err) {
  if (err) { throw err; }

  server.route([
    // POST /punish ==> Creates a new punishment
    {
      method: 'POST',
      path: '/punish',
      handler: function (request, reply) {
        var punishment = {
          punishment: request.payload.punishment
        };

        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('punishments').insert(punishment, function(err, writeResult){
          if (err) { throw err };

          reply(writeResult);
        });
      }
    },
    {
      method: 'GET',
      path: '/punish/random',
      handler: function(request, reply){
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('punishments').find().toArray(function(err, punishmentArray){
          var randomIndex = Math.floor(Math.random() * punishmentArray.length);
          reply(punishmentArray[randomIndex]);
        })
      }
    },
    {
      method: 'GET',
      path: '/punish/who',
      handler: function(request, reply){
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('students').find().toArray(function(err, studentArray){
          var randomIndex = Math.floor(Math.random() * studentArray.length);
          reply(studentArray[randomIndex]);
        })
      }
    }
  ]);

  server.start(function(){
    console.log('Server started!');
  });
});
