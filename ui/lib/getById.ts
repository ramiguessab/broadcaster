import useCameraCacheStore from "@/hooks/states/camerasCache";

const cache = useCameraCacheStore.getState().camerasCache;
const addToCache = useCameraCacheStore.getState().addCameraToCache;

export async function GetCameraById(id: string) {
    if (Object.keys(cache).includes(id)) {
        return cache[id];
    } else {
        return navigator.mediaDevices
            .getUserMedia({
                video: { width: 1920, height: 1080, deviceId: id },
            })
            .then((stream) => {
                addToCache(id, stream);
                return stream;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export async function GetCaptureById(id: string) {
    if (Object.keys(cache).includes(id)) {
        return cache[id];
    } else {
        return navigator.mediaDevices
            .getDisplayMedia({
                video: { width: 1920, height: 1080, deviceId: id },
            })
            .then((stream) => {
                addToCache(id, stream);
                return stream;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
