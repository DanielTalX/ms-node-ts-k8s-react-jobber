## Add/Apply global ingress-nginx-controller
- [minikube/ingress] kubectl apply -f ingress-depl.yaml

## Add/Apply API gateway ingress
- kubectl config view
- currently http://jobberapp.local/gateway-health is not working
- add 127.0.0.1 jobberapp.local to hosts file
- [minikube/1-gateway] kubectl apply -f ingress.yaml
- now http://jobberapp.local/gateway-health is working

## Generate self-signed certificates
1 - open lens -> ms shell pods (chat ms in example)
2 - verify if nano command exsits by type nano, if not: apk add nano
3 - copy the generate_certs.sh to the pod by:
  - mkdir certs 
  - [certs] touch generate_certs.sh
  - copy paste the content
  - ctrl x + shift y + enter
4 - chmod +x generate_certs.sh
5 - ./generate_certs.sh
    - if openssl error -> intall by: apk add openssl
    - remember the password and the host you want (jobberapp.local)
6 - Copy files from K8s pod to local machine
    - [local machine terminal] kubectl cp <pod-name>:<source-file-path-inside-pod-container> <destination-file-path-on-local-machine> -n <pod-namespace>
    - kubectl cp jobber-chat-fadsf34r3ed:/app/certs/jobberapp.local.crt ./Downloads/certs/jobberapp.local.crt -n production
    - kubectl cp jobber-chat-fadsf34r3ed:/app/certs/jobberapp.local.key ./Downloads/certs/jobberapp.local.key -n production
    - copy those file to [minikube/1-gateway/certs]
7 - update [minikube/1-gateway/ingress.yaml] file by set the tls section

## Create gateway tls secret
  - `kubectl -n <namespace> create secret tls <secret-name> --key <cert-key> --cert <cert-crt-file>`
  - [minikube/1-gateway/certs] kubectl -n production create secret tls gateway-ingress-tls --key jobberapp.local.key --cert jobberapp.local.crt
  - verify the secret created by: lens->config->secrets
  - add the secret also to minikube ingress
  - [minikube/1-gateway/ingress.yaml] - add under spec section: ingressClassName and tls sections.
  - kubectl apply -f ingress.yaml
  - https://jobberapp.local/gateway-health (not verified)
  - open in mac: "Keychain Access"->certificates->System, add the jobberapp.local.crt file to the item list.
  - double click the file and select always trust
  - https://jobberapp.local/gateway-health (verified)

---------------------------------------
## Adding SSL to the ingress controller
  - install mkcert tool - mkcert is a simple tool for making locally-trusted development certificates. It requires no configuration.
    - https://github.com/FiloSottile/mkcert
    - check installation by mkcert -h
  - mkcert -install
  - [k8s/minikube/1-gateway/certs] mkcert -key-file server.key -cert-file server.crt jobberapp.local
  - [k8s/minikube/1-gateway/certs] kubectl -n production create secret tls gateway-ingress-tls --key server.key --cert server.crt
  - [k8s/minikube/1-gateway/certs] kubectl -n production get secrets
  - [k8s/ingress-svc.yml] - add under spec section: ingressClassName and tls sections.
  - kubectl apply -f ingress.yaml
  - https://jobberapp.local/gateway-health