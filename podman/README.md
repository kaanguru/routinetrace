# Docker image for Expo build

Docker image for Expo builds to build android apps

## Prerequisites

- Docker and docker-compose installed (or podman and podman-compose)

- Expo App Folder `npx create-expo-app@latest`

## Usage

1. Clone this repository put it inside a subfolder like `podman`
2. Build the image `podman-compose up -d`
3. Get into container bash `podman exec -it expo-android-builder bash`
4. Add 'android/\*' to .gitignore file
5. Login to expo `eas login`
6. Build `EAS_NO_VCS=1 npx eas build --local --platform android --profile development`
7. Run prebuild `podman exec -it expo-android-builder npx expo prebuild -p android`
8. Build preview `podman exec -it expo-android-builder EAS_NO_VCS=1 npx eas build --local --platform android --profile preview`
9. Turn off `podman compose down`

---

## Clone gist

`git clone https://gist.github.com/093e2e3961e6645ea6c3eb71b465401c.git docker`

This will add docker folder with Dockerfile and docker-compose.yml

## Build the image and start the container

`podman-compose up -d`

## Logs

To see logs if you have any issues `docker logs expo-android-builder`

## Bash

Get into container bash `docker exec -it expo-android-builder bash`

## Expo prebuild inside container

Run prebuild `docker exec -it expo-android-builder npx expo prebuild -p android`

### Expo CLI login inside container

Login to expo `eas login`

`npx eas build --local --platform android --profile preview`

## Builds

build development `docker exec -it expo-android-builder eas build --platform android --profile development --local`

build preview `docker exec -it expo-android-builder eas build --platform android --profile preview --local`

build production `docker exec -it expo-android-builder eas build --platform android --profile production --local`

## Turn off

after you finish building `docker-compose down`
