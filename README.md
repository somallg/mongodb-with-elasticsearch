# Use Elasticsearch with MongoDB

## Install NodeJS
```
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```

## Install MongoDB
```
$ sudo apt-get install mongodb
```

## MongoDB River Plugin (driver to connect to MongoDB)
* Open https://github.com/richardwilly98/elasticsearch-river-mongodb#mongodb-river-plugin-for-elasticsearch
* Note the version of MongoDB, ElasticSearch and MongoDB River Plugin

## Install Elasticsearch
* Download Elasticsearch: http://www.elasticsearch.org/overview/elkdownloads/
* Check MongoDB version for match ElasticSearch and MongoDB River Plugin version
* Unzip and cd to the directory and run `bin/elasticsearch`
* Optionally, disable multicast discovery (development) in `config/elasticsearch.yml`
    * discovery.zen.ping.multicast.enabled: false

## Install Plugin
* `cd` to where elasticsearch is unzipped
* `$ bin/plugin --install elasticsearch/elasticsearch-mapper-attachments/MAPPER_VERSION`
    * MAPPER_VERSION from https://github.com/elastic/elasticsearch-mapper-attachments#mapper-attachments-type-for-elasticsearch
* `$ bin/plugin --install com.github.richardwilly98.elasticsearch/elasticsearch-river-mongodb/RIVER_VERSION`
    * RIVER_VERSION from https://github.com/richardwilly98/elasticsearch-river-mongodb#mongodb-river-plugin-for-elasticsearch

* `$ bin/plugin --install mobz/elasticsearch-head`

## Config MongoDB
* You must be using MongoDB replica sets since the River Plugin tails the oplog
* Check `init_sharded_env.24825a3cb9f2.sh` for command to run

## Prepare data
* Go to http://openrecip.es/ and download latest recipe items
* Unzip the gz file
* Import to mongo using `mongoimport --port 37017 -d test -c recipes`

## Create ElasticSeach index
```
$ curl -XPUT localhost:9200/_river/recipesindex/_meta -d '{
  "type": "mongodb",
  "mongodb": {
    "servers": [{ "host": "127.0.0.1", "port": 37017 }],
    "db": "test",
    "collection": "recipes"
  },
  "index": {
    "name": "recipesindex",
    "type": "recipes"
  }
}'
```