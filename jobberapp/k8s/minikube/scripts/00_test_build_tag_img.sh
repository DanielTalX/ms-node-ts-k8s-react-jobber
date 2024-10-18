PROJECT_NAME=jobberapp
PROJECT_DIR=$(pwd | grep -o ".*$PROJECT_NAME")
DOCKER_ID=mydockerid
FILE_NAME=$(basename "$0")
ms_name="1-gateway-service"

echo "----------------------------
PID=$$
FILE_NAME=$FILE_NAME
PROJECT_NAME=$PROJECT_NAME
PROJECT_DIR=$PROJECT_DIR
DOCKER_ID=$DOCKER_ID
ms_name=$ms_name
----------------------------"

ms_path=${PROJECT_DIR}/microservices/${ms_name}
local_image=${DOCKER_ID}/${ms_name}
remote_image=${DOCKER_ID}/${PROJECT_NAME}:${ms_name}

echo "start build & push ${ms_name}"
cd $ms_path
docker build -t ${local_image} .
#docker tag ${remote_image} ${remote_image}
#docker push ${remote_image}
echo "end build ${ms_name}"
