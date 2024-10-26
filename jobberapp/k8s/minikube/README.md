## Commands

### Generic commands to apply or delete k8s objects
* `kubectl apply -f .` - This will apply all objects found in the current directory.
* `kubectl apply -f <yaml-file-name>` - This will apply specific object found in the current directory.

### Minikube
* Increase minikube's cpu and memory
  * minikube config set cpus `add number of cpus cores your machine has`
  * minikube config set memory `10000`
* Delete minikube cluster if you already created one
  * minikube delete
* Enable minikube registry addon
  * minikube addons enable registry
* Start minikube with any driver other than docker
  * minikube start --driver=<driver-name> --insecure-registry "10.0.0.0/24"
* Make sure to always start minikube with the command above throughout the course
* To check minikube capacity
  * `kubectl get node minikube -o jsonpath='{.status.capacity}'`

### Copy files from K8s pod to local machine
* `kubectl cp <pod-name>:<source-file-path-inside-pod-container> <destination-file-path-on-local-machine> -n <pod-namespace>`

### Create tls secret
* `kubectl -n <namespace> create secret tls <secret-name> --key <cert-key> --cert <cert-crt-file>`

### Change Elasticsearch kibana user password
* [jobber-elastic-pod] `curl -s -X POST -u elastic:admin1234 -H "Content-Type: application/json" http://localhost:9200/_security/user/kibana_system/_password -d "{\"password\":\"kibana\"}"`

### Create kibana service token
* [jobber-elastic-pod] `bin/elasticsearch-service-tokens create elastic/kibana jobber-kibana`
  ==> SERVICE_TOKEN elastic/kibana/jobber-kibana = <token>

### Port forwarding
* `kubectl -n <namespace> port-forward <pod-name> <forwarding-port>:<port-inside-container>`
  - `kubectl -n production port-forward jobber-mongo-0 27017:27017`
  - `kubectl -n production port-forward jobber-mysql-hash 3306:3306`