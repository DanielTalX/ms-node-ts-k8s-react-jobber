source ./config.file
FILE_NAME=$(basename "$0")

echo "----------------------------
PID=$$
PROJECT_NAME=$PROJECT_NAME
FILE_NAME=$FILE_NAME
PROJECT_DIR=$PROJECT_DIR
DOCKER_ID=$DOCKER_ID
----------------------------"

for image in "${IMAGES[@]}"
do
    echo "start build & push ${image}"
    image_path=${PROJECT_DIR}/microservices/${image}
    local_image_tag=${DOCKER_ID}/${image}
    remote_image_tag=${DOCKER_ID}/${PROJECT_NAME}:${image}

    cd $image_path
    docker build -t ${remote_image} .
    # docker tag ${remote_image} ${remote_image}
    # docker push ${remote_image}
    echo "end build ${image}"
    sleep($SLEEP)
done
