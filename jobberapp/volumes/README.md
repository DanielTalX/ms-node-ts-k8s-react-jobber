## Run docker compose services
These services are required to be executed first with so as to prevent errors when you start your microservices.
* `docker compose up -d redis mongodb mysql postgres rabbitmq elasticsearch`
Or via:
* `redis`
  * `docker compose up -d redis`
* `mongodb`
  * `docker compose up -d mongodb`
* `mysql`
  * `docker compose up -d mysql`
* `postgres`
  * `docker compose up -d postgres`
* `rabbitmq`
  * `docker compose up -d redis`
* `elasticsearch`
  * `docker compose up -d elasticsearch`
  * It could take somewhere between 5 and 10 minutes for elasticsearch to be running.

## Setting up Kibana
* Using a kibana docker image greater than 8.10.x, the setup is a bit different.
* Once elasticsearch is running, open the elasticsearch container terminal and change the password of kibana_system
  * `curl -s -X POST -u elastic:admin1234 -H "Content-Type: application/json" http://localhost:9200/_security/user/kibana_system/_password -d "{\"password\":\"kibana\"}"`
  * If the update was successful, you should see a `{}` displayed in the terminal.
* Also from the elasticsearch container terminal, create a kibana service token
  * `bin/elasticsearch-service-tokens create elastic/kibana jobber-kibana`
  * If the service account token was generated, it will be displayed.
  * Once generated, copy and add it to the kibana environment variable `ELASTICSEARCH_SERVICEACCOUNT_TOKEN` inside your docker compose file
* `docker compose up -d kibana`

