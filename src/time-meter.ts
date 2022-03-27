
export function TimeMeter() {
	return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
		const original = descriptor.value;

		descriptor.value = function( ... args: any[]) {
			const start = performance.now()
			try {
				return original.apply(this, args);
			} finally {
				const end = performance.now()
				console.log('Executing function', key, 'took', end - start,'ms')
			}
		};

		return descriptor;
	};
}
