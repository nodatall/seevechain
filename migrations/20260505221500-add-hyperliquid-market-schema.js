exports.up = db => {
  return db.runSql(
    `
      CREATE TABLE markets (
        coin text PRIMARY KEY,
        display_name text,
        enabled boolean DEFAULT true,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );

      INSERT INTO markets (coin, display_name, enabled)
      VALUES
        ('BTC', 'Bitcoin', true),
        ('ETH', 'Ethereum', true),
        ('SOL', 'Solana', true),
        ('HYPE', 'Hyperliquid', true)
      ON CONFLICT (coin) DO NOTHING;

      CREATE TABLE trades (
        coin text NOT NULL,
        tid bigint NOT NULL,
        time_ms bigint NOT NULL,
        side text NOT NULL,
        raw_side text,
        price numeric NOT NULL,
        size numeric NOT NULL,
        notional numeric NOT NULL,
        hash text,
        buyer text,
        seller text,
        raw jsonb,
        created_at timestamptz DEFAULT now(),
        PRIMARY KEY (coin, time_ms, tid)
      );

      CREATE TABLE market_stats_cache (
        cache_name text PRIMARY KEY,
        payload jsonb NOT NULL,
        updated_at timestamptz DEFAULT now()
      );

      CREATE TABLE feed_status_events (
        id bigserial PRIMARY KEY,
        event_type text NOT NULL,
        started_at timestamptz NOT NULL DEFAULT now(),
        ended_at timestamptz,
        details jsonb DEFAULT '{}'::jsonb,
        created_at timestamptz DEFAULT now()
      );

      CREATE INDEX idx_trades_time_ms
        ON trades (time_ms DESC);

      CREATE INDEX idx_trades_coin_time_ms
        ON trades (coin, time_ms DESC);

      CREATE INDEX idx_trades_coin_side_time_ms
        ON trades (coin, side, time_ms DESC);

      CREATE INDEX idx_feed_status_events_started_at
        ON feed_status_events (started_at DESC);

      CREATE INDEX idx_feed_status_events_event_type_started_at
        ON feed_status_events (event_type, started_at DESC);
    `
  )
}

exports.down = db => {
  return db.runSql(
    `
      DROP INDEX idx_feed_status_events_event_type_started_at;
      DROP INDEX idx_feed_status_events_started_at;
      DROP INDEX idx_trades_coin_side_time_ms;
      DROP INDEX idx_trades_coin_time_ms;
      DROP INDEX idx_trades_time_ms;
      DROP TABLE feed_status_events;
      DROP TABLE market_stats_cache;
      DROP TABLE trades;
      DROP TABLE markets;
    `
  )
}
