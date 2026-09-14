This website is a blackjack trainer that recreates a realistic blackjack experience with full strategy and card-counting support.

Features
--------
  - Comprehensive playing ruleset including decks, S17, DAS, doubles, splits, late surrender, blackjack payout, and penetration.
  - Bankroll management with configurable starting bankroll, table minimum, and table maximum.
  - Customizable playing strategy with alerts that inform the user when they make a strategic mistake.
  - Customizable card-counting system with settings for card tag values, initial running counts, balanced and unbalanced systems, and true count divisor and calculation methods.
  - Customizable deviation chart to allow for playing deviations at specified true counts.

Code Details
--------
The core game logic lives in `src/GameComponents/Blackjack.ts` and is split across three classes:

  - `Card` — represents a single playing card with rank, suit, and soft/hard ace state.
  - `Shoe` — manages the deck, shuffling, card drawing, and running count tracking using a configurable tag map.
  - `Dealer` — tracks the dealer's hand, hole card, and hit-or-stand logic based on the S17 rule.
  - `BlackjackGame` — the main game state machine. Drives the full hand lifecycle: dealing, player decisions (hit, stand, double, split, surrender, insurance), dealer resolution, and bankroll updates. Exposes `playGame()` which advances state based on the current `choice` field, and `getCorrectChoice()` / `getCorrectDeviation()` which evaluate the player's decision against the configured strategy and deviation matrices.

Settings are defined as plain TypeScript interfaces in `src/SettingsObjects.ts` and managed as React state in `src/App.tsx`, passed down as props to both the settings page and the game. There are four settings objects:

  - `GameSettingsObject` — table rules.
  - `BankrollSettingsObject` — bankroll, table min, table max.
  - `StrategySettingsObject` — hard, soft, split, and surrender decision matrices.
  - `CountingSettingsObject` — tag values, initial running counts, true count divisor, deviation matrices.

The app has two routes:

  - `/` — settings page (`src/PlayComponents/Play.tsx`) where the user configures all four settings objects before starting a session.
  - `/game` — game page (`src/GameComponents/Game.tsx`) which instantiates `BlackjackGame` on mount and re-renders by shallow-cloning the game object after each action.

Strategy and deviation correctness checking is done on every player action. The correct choice is looked up from the matrix using the dealer upcard and hand total as indices and compared against the player's action. Errors are displayed as an overlay in the game view.

Tools used
  - React
  - TypeScript
  - Vite
  - GitHub Actions (build and deploy on push to main)
  - GitHub Pages
