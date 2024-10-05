#!/bin/bash
echo start share-pack

current_pwd=$pwd
ms_paths=$(pwd | grep -o ".*microservices")
ms_names=(
    '1-gateway-service'
    '2-notification-service'
    '3-auth-service'
    '4-users-service'
    '5-gig-service'
    '6-chat-service'
    '7-order-service'
)
lib_name='9-jobber-shared'
lib_pack_name=danieltalx-jobber-shared
lib_full_path=${ms_paths}/${lib_name}
lib_version=$(cat ${lib_full_path}/package.json | grep '"version"' | cut -d '"' -f 4)
lib_pack_name_version=${lib_pack_name}-${lib_version}


echo "----------------------------
PID=$$
pack_to_share=$lib_pack_name_version
target_ms_names=$ms_names
----------------------------"

for ms_name in "${ms_names[@]}"
do
    echo start share ${lib_pack_name_version} to ${ms_name}
    ms_full_path=${ms_paths}/${ms_name}
    rm -f ${ms_full_path}/local-packs/${lib_pack_name}*.tgz
    cp ${lib_full_path}/packs/${lib_pack_name_version}.tgz ${ms_full_path}/local-packs/
    cd ${ms_full_path}
    npm run i-local-packs
    echo end share ${lib_pack_name} to ${ms_name}
done

cd $current_pwd
echo end share-pack
