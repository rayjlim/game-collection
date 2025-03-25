#!/bin/bash

. .env

# Validate environment variables
if [ ! -n "$FTP_HOST" ]; then
  echo "Missing environment variables"
  exit 2
fi

# Function definitions
print_usage() {
  echo ""
  echo "Usage: $0 [-b] [-f] [-r] [-n]"
  echo "Options:"
  echo "  -b    Skip Backend build"
  echo "  -f    Skip Frontend build"
  echo "  -r    Reset SSH connection"
  echo "  -n    Skip Upload"
  echo ""
}

build_backend() {
  echo "Building backend..."
  cd ../backend
  mkdir -p ./build/
  rsync -ravz --exclude-from '../scripts/exclude-from-prep.txt' --delete . ./build/
  rsync -avz "public/.htaccess" ./build/public/.htaccess
  rsync -avz ".htaccess.production" ./build/.htaccess
  rsync -avz ".env.production" ./build/.env
  rsync -avz "../scripts/exclude-from-prod.txt" ./build/

  cd ./build/
  composer.bat install --no-dev
  cd ../..
  echo "Backend build complete"
}

build_frontend() {
  echo "Building frontend..."
  cd ./frontend
  if ! npm run build; then
    echo "Frontend build failed"
    exit 1
  fi
  cd ..
  echo "Frontend build complete"
}

setup_ssh() {
  echo "Resetting SSH key..."
  ssh-keygen -f "$KEY_DIR" -R "$FTP_HOST"
  ssh-copy-id -f -i ~/.ssh/id_rsa -oHostKeyAlgorithms=+ssh-dss "$FTP_USER@$FTP_HOST"
}

deploy_backend() {
  echo "Deploying backend..."
  cd ./backend/build/
  rsync -rave 'ssh -oHostKeyAlgorithms=+ssh-dss' \
    --exclude-from 'exclude-from-prod.txt' \
    --delete . "$FTP_USER@$FTP_HOST:$FTP_TARGETFOLDER_API/"

  ssh "$FTP_USER@$FTP_HOST" "chmod -R 755 $FTP_TARGETFOLDER_API/"
  cd ../..
}

deploy_frontend() {
  echo "Deploying frontend..."
  cd ./frontend/dist/
  rsync --rsh='ssh -p2222' -rave 'ssh -oHostKeyAlgorithms=+ssh-dss' \
    --delete . "$FTP_USER@$FTP_HOST:$FTP_TARGETFOLDER_UI/"

  ssh "$FTP_USER@$FTP_HOST" -p 2222 -oHostKeyAlgorithms=+ssh-dss \
    "chmod -R 755 $FTP_TARGETFOLDER_UI/"
  cd ../..
}

cd ../
# Parse command line options
while getopts "rbfn" opt; do
  case $opt in
    r) RESETSSH=true ;;
    b) NOBACKENDBUILD=true ;;
    f) NOFRONTENDBUILD=true ;;
    n) NOPUBLISH=true ;;
    *) print_usage; exit 1 ;;
  esac
done

# Main execution flow
[ -z "$NOBACKENDBUILD" ] && build_backend
[ -z "$NOFRONTENDBUILD" ] && build_frontend
[ ! -z "$RESETSSH" ] && setup_ssh

if [ -z "$NOPUBLISH" ]; then
  [ -z "$NOBACKENDBUILD" ] && deploy_backend
  [ -z "$NOFRONTENDBUILD" ] && deploy_frontend
else
  echo "Skipping deployment"
fi
