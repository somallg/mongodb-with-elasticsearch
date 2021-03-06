# Use ElasticSearch with MongoDB to create an instant search webbapp

## 1. Install NodeJS
```
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```

## 2. Install bower
```
$ sudo npm install -g bower
```

## 3. Install MongoDB
```
$ sudo apt-get install mongodb
```

## 4. MongoDB River Plugin (driver to connect to MongoDB)
* Open https://github.com/richardwilly98/elasticsearch-river-mongodb#mongodb-river-plugin-for-elasticsearch
* Note the version of MongoDB, ElasticSearch and MongoDB River Plugin

## 5. Install ElasticSearch
* Download ElasticSearch: http://www.elasticsearch.org/overview/elkdownloads/
* Check MongoDB version for match ElasticSearch and MongoDB River Plugin version
* Unzip and cd to the directory and run `bin/elasticsearch`
* Optionally, disable multicast discovery (development) in `config/elasticsearch.yml`
    * discovery.zen.ping.multicast.enabled: false

## 6. Install River
* `cd` to where elasticsearch is unzipped

```
$ bin/plugin --install elasticsearch/elasticsearch-mapper-attachments/MAPPER_VERSION
```

* MAPPER_VERSION from https://github.com/elastic/elasticsearch-mapper-attachments#mapper-attachments-type-for-elasticsearch

```
$ bin/plugin --install com.github.richardwilly98.elasticsearch/elasticsearch-river-mongodb/RIVER_VERSION
```

* RIVER_VERSION from https://github.com/richardwilly98/elasticsearch-river-mongodb#mongodb-river-plugin-for-elasticsearch

* Example: for MongoDB version `3.0.0` use ElasticSearch version `1.4.2` and the command lines below
```
$ bin/plugin --install elasticsearch/elasticsearch-mapper-attachments/2.4.3
$ bin/plugin --install com.github.richardwilly98.elasticsearch/elasticsearch-river-mongodb/2.0.9
```

* Example: for MongoDB version `2.4.9 -> 2.6.3` use ElasticSearch version `1.2.2` and the command lines below
```
$ bin/plugin --install elasticsearch/elasticsearch-mapper-attachments/2.2.1
$ bin/plugin --install com.github.richardwilly98.elasticsearch/elasticsearch-river-mongodb/2.0.1
```

## 7. Install additional plugin
```
$ bin/plugin --install mobz/elasticsearch-head
```

## 8. Config MongoDB
* You must be using MongoDB replica sets since the River Plugin tails the oplog
* Check `init_sharded_env.24825a3cb9f2.sh` for command to run

## 9. Clean everything up (first time only)
```
$ killall mongod
$ killall mongos
$ rm -rf /data/config
$ rm -rf /data/shard*
```

## 10. Start a replica set and tell it that it will be shard0
```
$ mkdir -p /data/shard0/rs0 /data/shard0/rs1 /data/shard0/rs2
$ mongod --replSet s0 --logpath "s0-r0.log" --dbpath /data/shard0/rs0 --port 37017 --fork --shardsvr --smallfiles
$ mongod --replSet s0 --logpath "s0-r1.log" --dbpath /data/shard0/rs1 --port 37018 --fork --shardsvr --smallfiles
$ mongod --replSet s0 --logpath "s0-r2.log" --dbpath /data/shard0/rs2 --port 37019 --fork --shardsvr --smallfiles
```

## 11. Connect to one server and initiate the set
```
$ mongo --port 37017
> config = { _id: "s0", members:[
            { _id : 0, host : "localhost:37017" },
            { _id : 1, host : "localhost:37018" },
            { _id : 2, host : "localhost:37019" }]};
> rs.initiate(config)
```

## 12. Create ElasticSearch index
```
$ curl -XPUT localhost:9200/_river/enronindex/_meta -d '{
  "type": "mongodb",
  "mongodb": {
    "servers": [{ "host": "127.0.0.1", "port": 37017 }],
    "db": "enron",
    "collection": "messages"
  },
  "index": {
    "name": "enronindex",
    "type": "message"
  }
}'
```

## 13. Prepare dump data
* Download the compressed mongodump data https://s3.amazonaws.com/mongodb-enron-email/enron_mongo.tar.bz2
* `cd` to the folder contains `enron_mongo.tar.br2`. Unzip the compressed file using
```
$ tar xvfj enron_mongo.tar.bz2
```
* Import data to mongo using 
```
$ mongorestore --port 37017 -d enron -c messages dump/enron_mail/messages.bson
```

## 14. Test url
* To check index of river `http://localhost:9200/_plugin/river-mongodb`
* To check index and query `http://localhost:9200/_plugin/head`

## 15. Install nodejs and bower dependencies
```
$ npm install
$ bower install
```

## 16. Run webapp
```
$ node server
```

* Then go to `localhost:3000`, type in input textbox for instant search