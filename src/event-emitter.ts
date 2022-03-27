
export class EventEmitter<EventsMap>{
	private eventListeners = new Map<keyof EventsMap, Set<(extra?: any) => void>>()

	public addEventListener<K extends keyof EventsMap>(type: K, callback: (extra: EventsMap[K]) => void) {
		console.assert(!!callback)
		const list = this.eventListeners.get(type)
		if (list) list.add(callback)
		else this.eventListeners.set(type, new Set([callback]))
	}


	protected emit<K extends keyof EventsMap>(type: K, extra: EventsMap[K] = undefined) {
		const list = this.eventListeners.get(type)
		if (list)
			for (const listener of list.values())
				listener(extra)
	}
}

export default EventEmitter
