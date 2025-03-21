const createBooleanStore = (key: string, defaultValue: boolean) => {
    let current = defaultValue
    try {
        const read = localStorage.getItem(key)
        if (read) current = read === '1'
    } catch (_) {
        //ignore
    }
    return {
        get() {
            return current;
        },
        set(newValue: boolean) {
            if (newValue === current) return
            current = newValue
            try {
                localStorage.setItem(key, newValue ? '1' : '0')
            } catch (_) {
                //ignore
            }
        }
    }
}

export const LESS_COLORS = createBooleanStore('less-colors', false)
export const FAST_ANIMATIONS = createBooleanStore('fast-animations', false)
export const SHOW_SYMBOLS = createBooleanStore('show-symbols', false)

export const bindToBooleanStore = (store: ReturnType<typeof createBooleanStore>,
    element: HTMLInputElement, listener?: (value: boolean) => void) => {
    element.checked = store.get()
    element.addEventListener('change', e => {
        const value = (e.target as HTMLInputElement).checked
        store.set(value)
        listener?.(value)
    });
    listener?.(element.checked)
}