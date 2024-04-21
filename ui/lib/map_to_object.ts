type ObjectPremitives = string | number;

export function map_to_object(
    map: Map<ObjectPremitives, any>,
    depth: number = 0
) {
    const obj: any = {};

    map.forEach((value, key) => {
        if (depth && value instanceof Map) {
            value = map_to_object(value, depth - 1);
        }
        obj[key] = value;
    });

    return obj;
}

export function object_to_map(
    obj: { [key: ObjectPremitives]: any },
    depth: number = 0
) {
    const map: Map<any, any> = new Map();

    Object.entries(obj).forEach(([key, value]) => {
        if (depth && obj instanceof Object) {
            value = object_to_map(value, depth - 1);
        }
        map.set(key, value);
    });

    return map;
}
