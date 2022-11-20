@echo off
echo "Deploying to GCP"
echo "Building image..."
docker build -t spusermgmtnode:v1 .
echo "Image built successfully"
gcloud config set project sportal-362901
gcloud config set compute/region asia-southeast1
gcloud auth login
docker tag spusermgmtnode:v1 gcr.io/sportal-362901/spusermgmtnode:v1
gcloud auth configure-docker
docker push gcr.io/sportal-362901/spusermgmtnode:v1
echo "Image successfully pushed to GCP"