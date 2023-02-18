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

export const bindToBooleanStore = (store: ReturnType<typeof createBooleanStore>, element: HTMLInputElement) => {
    element.checked = store.get()
    element.addEventListener('change', e => {
        LESS_COLORS.set((e.target as HTMLInputElement).checked)
    });
}