[@morph-l2/sdk](../intro.md) / [Exports](../modules) / MessageStatus

# Enumeration: MessageStatus

Enum describing the status of a message.

## Table of contents

### Enumeration Members

- [FAILED\_L1\_TO\_L2\_MESSAGE](MessageStatus#failed_l1_to_l2_message)
- [IN\_CHALLENGE\_PERIOD](MessageStatus#in_challenge_period)
- [READY\_FOR\_RELAY](MessageStatus#ready_for_relay)
- [READY\_TO\_PROVE](MessageStatus#ready_to_prove)
- [RELAYED](MessageStatus#relayed)
- [UNCONFIRMED\_L1\_TO\_L2\_MESSAGE](MessageStatus#unconfirmed_l1_to_l2_message)
- [WITHDRAWAL\_HASH\_NOT\_SYNC](MessageStatus#withdrawal_hash_not_sync)
- [WITHDRAWAL\_ROOT\_NOT\_PUBLISHED](MessageStatus#withdrawal_root_not_published)

## Enumeration Members

### FAILED\_L1\_TO\_L2\_MESSAGE

• **FAILED\_L1\_TO\_L2\_MESSAGE** \= ``1``

Message is an L1 to L2 message and the transaction to execute the message failed.
When this status is returned, you will need to resend the L1 to L2 message, probably with a
higher gas limit.

#### Defined in

[src/interfaces/types.ts:129](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L129)

___

### IN\_CHALLENGE\_PERIOD

• **IN\_CHALLENGE\_PERIOD** \= ``5``

Message is a proved L2 to L1 message and is undergoing the challenge period.

#### Defined in

[src/interfaces/types.ts:149](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L149)

___

### READY\_FOR\_RELAY

• **READY\_FOR\_RELAY** \= ``6``

Message is ready to be relayed.

#### Defined in

[src/interfaces/types.ts:154](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L154)

___

### READY\_TO\_PROVE

• **READY\_TO\_PROVE** \= ``4``

Message is ready to be proved on L1 to initiate the challenge period.

#### Defined in

[src/interfaces/types.ts:144](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L144)

___

### RELAYED

• **RELAYED** \= ``7``

Message has been relayed.

#### Defined in

[src/interfaces/types.ts:159](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L159)

___

### UNCONFIRMED\_L1\_TO\_L2\_MESSAGE

• **UNCONFIRMED\_L1\_TO\_L2\_MESSAGE** \= ``0``

Message is an L1 to L2 message and has not been processed by the L2.

#### Defined in

[src/interfaces/types.ts:122](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L122)

___

### WITHDRAWAL\_HASH\_NOT\_SYNC

• **WITHDRAWAL\_HASH\_NOT\_SYNC** \= ``3``

Message is an L2 to L1 message and withdrawal hash has not been published to backend yet.

#### Defined in

[src/interfaces/types.ts:139](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L139)

___

### WITHDRAWAL\_ROOT\_NOT\_PUBLISHED

• **WITHDRAWAL\_ROOT\_NOT\_PUBLISHED** \= ``2``

Message is an L2 to L1 message and withdrawal root has not been published yet.

#### Defined in

[src/interfaces/types.ts:134](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L134)
