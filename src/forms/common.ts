export function safeSet<T>(func: () => void, errors: string[]) {
    try {
        func();
    }
    catch (e) {
        errors.push((e as Error).message);
    }
}