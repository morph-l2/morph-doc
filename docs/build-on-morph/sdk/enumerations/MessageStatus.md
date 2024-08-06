[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / MessageStatus

# Enumeration: MessageStatus

Enum describing the status of a message.

## Enumeration Members

### FAILED\_L1\_TO\_L2\_MESSAGE

> **FAILED\_L1\_TO\_L2\_MESSAGE**: `1`

Message is an L1 to L2 message and the transaction to execute the message failed.
When this status is returned, you will need to resend the L1 to L2 message, probably with a
higher gas limit.

#### Source

src/interfaces/types.ts:186

***

### IN\_CHALLENGE\_PERIOD

> **IN\_CHALLENGE\_PERIOD**: `5`

Message is a proved L2 to L1 message and is undergoing the challenge period.

#### Source

src/interfaces/types.ts:206

***

### READY\_FOR\_RELAY

> **READY\_FOR\_RELAY**: `6`

Message is ready to be relayed.

#### Source

src/interfaces/types.ts:211

***

### READY\_TO\_PROVE

> **READY\_TO\_PROVE**: `4`

Message is ready to be proved on L1 to initiate the challenge period.

#### Source

src/interfaces/types.ts:201

***

### RELAYED

> **RELAYED**: `7`

Message has been relayed.

#### Source

src/interfaces/types.ts:216

***

### UNCONFIRMED\_L1\_TO\_L2\_MESSAGE

> **UNCONFIRMED\_L1\_TO\_L2\_MESSAGE**: `0`

Message is an L1 to L2 message and has not been processed by the L2.

#### Source

src/interfaces/types.ts:179

***

### WITHDRAWAL\_HASH\_NOT\_SYNC

> **WITHDRAWAL\_HASH\_NOT\_SYNC**: `3`

Message is an L2 to L1 message and withdrawal hash has not been published to backend yet.

#### Source

src/interfaces/types.ts:196

***

### WITHDRAWAL\_ROOT\_NOT\_PUBLISHED

> **WITHDRAWAL\_ROOT\_NOT\_PUBLISHED**: `2`

Message is an L2 to L1 message and withdrawal root has not been published yet.

#### Source

src/interfaces/types.ts:191
