function toDate(value){
  if (!value) return new Date().toISOString()
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'number') return new Date(value).toISOString()
  return value
}

function normalizeDetails(details){
  if (details === undefined || details === null) return JSON.stringify({})
  if (typeof details === 'string') return details
  return JSON.stringify(details)
}

async function saveFeedStatusEvent(params){
  const {
    client,
    event,
    eventType,
    type,
    startedAt,
    endedAt,
    details,
    status,
    ...metadata
  } = params || {}
  if (!client) throw new Error('client is required')

  const source = event || {}
  const eventStatus = status || source.status
  const eventDetails = details || source.details
  const event_type = eventType || type || source.eventType || source.type
  if (!event_type) throw new Error('eventType is required')
  const persistedDetails = eventDetails || {
    ...metadata,
    raw: source.raw,
  }

  const [savedEvent] = await client.query(
    `
      INSERT INTO feed_status_events (
        event_type,
        started_at,
        ended_at,
        details
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [
      event_type,
      toDate(startedAt || source.startedAt || (eventDetails && eventDetails.at) || (eventStatus && eventStatus.lastStatusAt)),
      endedAt || source.endedAt ? toDate(endedAt || source.endedAt) : null,
      normalizeDetails(persistedDetails),
    ]
  )

  return savedEvent
}

module.exports = saveFeedStatusEvent
