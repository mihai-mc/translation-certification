export function safeSet(func: () => void, errors: string[]) {
    try {
        func();
    }
    catch (e) {
        errors.push((e as Error).message);
    }
}