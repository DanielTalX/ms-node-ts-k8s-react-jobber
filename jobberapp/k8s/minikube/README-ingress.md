## Add/Apply global ingress-nginx-controller
- [minikube/ingress] kubectl apply -f ingress-depl.yaml

## Add/Apply API gateway ingress
- kubectl config view
- currently http://jobbberapp.local/gateway-health is not working
- add 127.0.0.1 jobbberapp.local to hosts file
- [minikube/1-gateway] kubectl apply -f ingress.yaml
- now http://jobbberapp.local/gateway-health is working
