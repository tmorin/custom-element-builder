import {
  DiscoverableQueryHandler,
  MessageBuilder,
  Query,
  Result,
} from "@tmorin/ceb-messaging-core"

// create the handler using the "implementation" way
export class WhatTimeIsItHandler
  implements DiscoverableQueryHandler<Query<void>, Result<string>>
{
  // the type of the Query to handle
  type = "WhatTimeIsIt"

  // the handler
  handler(query: Query<void>) {
    return MessageBuilder.result(query).body(new Date().toISOString()).build()
  }
}
