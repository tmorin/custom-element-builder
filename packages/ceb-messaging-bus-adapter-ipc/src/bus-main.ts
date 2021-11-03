import any from "promise.any";
import {IpcMain, IpcMainEvent, webContents} from "electron";
import {
    Bus,
    ExecuteOptions,
    ExecutionHandler,
    Handler,
    MessageAction,
    MessageConstructor,
    MessageEvent,
    MessageKind,
    MessageResult,
    MessageType,
    SubscribeOptions,
    Subscription,
    SubscriptionListener
} from "@tmorin/ceb-messaging-core";
import {IpcHandler, IpcMessageConverter, IpcActionError, IpcMessageMetadata, IpcSubscription} from "./bus";

/**
 * The implementation of {@link Bus} for the Main context of Electron IPC.
 */
export class IpcMainBus implements Bus {
    constructor(
        private readonly parentBus: Bus,
        private readonly ipcMessageConverter: IpcMessageConverter,
        private readonly ipcMain: IpcMain,
    ) {
    }

    async execute<A extends MessageAction>(action: A, arg1?: any, arg2?: any): Promise<any> {
        if (arg1) {
            return this.executeAndWait(action, arg1, arg2)
        }
        return this.executeAndForget(action)
    }

    handle<M extends MessageAction, R extends MessageResult>(
        actionType: MessageType,
        ResultType: MessageConstructor<R>,
        handler: ExecutionHandler<M, R>
    ): Handler {
        // handle event from parent
        const parentHandler = this.parentBus.handle(actionType, ResultType, handler)
        // handle event from IPC
        const channel: string = actionType
        const ipcListener = async (event: IpcMainEvent, data: any, metadata: IpcMessageMetadata) => {
            const message = this.ipcMessageConverter.deserialize<M>(channel, {channel, data, metadata})
            if (metadata.waitForResult) {
                try {
                    const result = await this.parentBus.execute(message, ResultType, {
                        timeout: metadata.timeout
                    })
                    const ipcResult = this.ipcMessageConverter.serialize(result)
                    event.reply(channel, ipcResult.data, {
                        ...ipcResult.metadata,
                        correlationId: message.headers.messageId
                    })
                } catch (error: any) {
                    const ipcError = this.ipcMessageConverter.serialize(new IpcActionError(message, error))
                    event.reply(channel, ipcError.data, {
                        ...ipcError.metadata,
                        correlationId: message.headers.messageId
                    })
                }
            } else {
                this.parentBus.execute(message)
                    .catch(error => console.error("IpcMainBus - the action failed", error))
            }
        }
        this.ipcMain.on(channel, ipcListener)
        // create the handler
        return new IpcHandler(() => {
            parentHandler.cancel()
            this.ipcMain.removeListener(channel, ipcListener)
        })
    }

    async publish<E extends MessageEvent>(event: E): Promise<void> {
        // forward to IPC
        const {channel, data, metadata} = this.ipcMessageConverter.serialize(event)
        webContents.getAllWebContents().forEach(webContent => webContent.send(channel, data, metadata))
        // forward to parent
        return this.parentBus.publish(event)
    }

    subscribe<E extends MessageEvent>(
        eventType: MessageType,
        listener: SubscriptionListener<E>,
        options?: SubscribeOptions
    ): Subscription {
        // handle event from parent
        const parentSubscription = this.parentBus.subscribe(eventType, listener, options)
        // handle event from IPC
        const channel: string = eventType
        const ipcListener = (event: IpcMainEvent, data: any, metadata: IpcMessageMetadata) => {
            const message = this.ipcMessageConverter.deserialize<E>(channel, {
                channel: channel,
                data,
                metadata
            })
            this.parentBus.publish(message)
        }
        this.ipcMain.on(channel, ipcListener)
        // create the subscription
        return new IpcSubscription(() => {
            parentSubscription.unsubscribe()
            this.ipcMain.removeListener(channel, ipcListener)
        })
    }

    private async executeAndWait<A extends MessageAction, R extends MessageResult>(
        action: A,
        ResultType: MessageConstructor<R>,
        options?: ExecuteOptions
    ): Promise<R> {
        const {channel, data, metadata} = this.ipcMessageConverter.serialize(action)
        // forward to IPC
        const pIpc = new Promise<R>((resolve, reject) => {
            const listener = (event: IpcMainEvent, data: any, metadata: IpcMessageMetadata) => {
                // leave early if the message type is wrong
                if (action.headers.messageId === metadata.correlationId) {
                    clearTimeout(timeoutId);
                    const message = this.ipcMessageConverter.deserialize(ResultType, {channel, data, metadata})
                    if (message.kind === MessageKind.error) {
                        reject(message.body);
                    } else {
                        resolve(message);
                    }
                }
            }

            const timeout = options?.timeout || 500
            const timeoutId = setTimeout(() => {
                this.ipcMain.removeListener(channel, listener)
                reject(new Error(`IpcRendererBus - unable to get a result after ${timeout} ms`))
            }, timeout)

            this.ipcMain.once(channel, listener)

            webContents.getAllWebContents().forEach(webContent => webContent.send(channel, data, {
                ...metadata,
                waitForResult: true
            }))
        })
        // forward to parent
        const pParent = this.parentBus.execute(action, ResultType, options)
        // return first
        return any<R>([pParent, pIpc])
    }

    private async executeAndForget<A extends MessageAction>(action: A): Promise<void> {
        // forward to IPC
        const {channel, data, metadata} = this.ipcMessageConverter.serialize(action)
        webContents.getAllWebContents().forEach(webContent => webContent.send(channel, data, {
            ...metadata,
            waitForResult: false
        }))
        // forward to parent
        return this.parentBus.execute(action)
            .catch(error => console.error("IpcMainBus - the action failed", error))
    }

}