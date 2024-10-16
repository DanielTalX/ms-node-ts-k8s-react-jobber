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
* after 2 min open: http://localhost:5601/app/home#/

## Heartbeat file
* inside the `heartbeat.yml`:
  * if you run microservices with docker Replace `<your-ip-address_or_container_name>` with ms_conteriner_name.
  * else if you run microservices with node run dev Replace `<your-ip-address_or_container_name>` with your own ip address.

## Run docker compose to the others cors services
* `docker compose up -d metricbeat`
  * http://localhost:5601/app/observability/overview?rangeFrom=now-15m&rangeTo=now
  * Hosts section click Show invetory
* `docker compose up -d heartbeat`
  * http://localhost:5601/app/observability/overview?rangeFrom=now-15m&rangeTo=now
  * Monitors section click Show monitors
* `docker compose up -d apmServer`
  * http://localhost:5601/app/observability/overview?rangeFrom=now-15m&rangeTo=now
  * Services section click Show service invetory

## Running microservices
* You can run the microservices using either docker compose or by opening a terminal for wach service and execute `npm run dev`.
* Personally, I prefer to run the microservices individually in the terminal because it allows me to easily monitor errors displayed.
* Whichever approach you intend to use to start the microservices, make sure the `gateway service` is always the last service you start. All other services should be running before starting the `gateway service`.

