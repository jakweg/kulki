import EventEmitter from './event-emitter'

export type TaskExecutor = () => void
export interface SchedulerEvent {
	'queue-empty': undefined,
	'queue-non-empty': undefined
}

export class GameScheduler extends EventEmitter<SchedulerEvent> {
	private nextAllowedStart = 0
	private timeoutId: number
	private enqueuedTasks: TaskExecutor[] = []

	constructor(private readonly interval: number = 250) {
		super()
	}


	public schedule(task: TaskExecutor): Promise<void> {
		console.assert(!!task)

		return new Promise<void>((resolve, reject) => {
			const wasEmpty = this.enqueuedTasks.length === 0
			this.enqueuedTasks.push(() => {
				try {
					task()
				} catch (e){
					reject(e)
				}
				resolve()
			})

			if (wasEmpty) {
				this.emit('queue-non-empty')
				if (this.nextAllowedStart < Date.now()) {
					this.executeTask()
				} else {
					clearTimeout(this.timeoutId)
					this.timeoutId = setTimeout(this.executeTask.bind(this), this.interval)
				}
			}
		})
	}


	private executeTask() {
		this.nextAllowedStart = Date.now() + this.interval
		const task = this.enqueuedTasks.shift()
		console.assert(!!task)
		task()

		if (this.enqueuedTasks.length !== 0)
			this.timeoutId = setTimeout(this.executeTask.bind(this), this.interval)
		else
			this.emit('queue-empty')
	}
}

export default GameScheduler
