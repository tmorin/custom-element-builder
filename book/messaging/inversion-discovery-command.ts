import {
  Command,
  DiscoverableCommandHandler,
  Event,
  MessageBuilder,
  Result,
} from "@tmorin/ceb-messaging-core"

// create the handler using the "implementation" way
export class GreetSomebodyHandler
  implements
    DiscoverableCommandHandler<
      Command<string>,
      Result<String>,
      Array<Event<string>>
    >
{
  // the type of the Command to handle
  type = "GreetSomebody"

  // the handler
  handler(command: Command<string>) {
    // create the greeting text
    const result = MessageBuilder.result(command)
      .body(`Hello, ${command.body}!`)
      .build()
    // create the event
    const events = [
      MessageBuilder.event("SomeoneHasBeenGreeted").body(command.body).build(),
    ]
    // return the output
    return { result, events }
  }
}
