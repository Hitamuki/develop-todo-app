#!/bin/bash

# すべてのコンテナを停止
docker stop $(docker ps -aq)

# すべてのコンテナを削除
docker rm $(docker ps -aq)

# すべてのイメージを削除
docker rmi $(docker images -aq)

# すべてのボリュームを削除
docker volume rm $(docker volume ls -q)

# 未使用のDockerネットワークを削除
docker network prune -f
