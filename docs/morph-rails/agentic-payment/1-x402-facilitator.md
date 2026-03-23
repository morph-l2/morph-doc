---
title: x402 Facilitator
lang: en-US
keywords: [morph,x402,HTTP 402,payment protocol,AI agent,facilitator,developer integration,Coinbase x402,HMAC]
description: Morph x402 API implements the Coinbase x402 protocol for on-chain payment settlement on Morph network. Developer integration guide with HMAC auth, endpoints, and code examples.
---

# Morph x402 Developer Integration Guide

## 1. Overview

Morph x402 API is built on the [Coinbase x402 protocol](https://github.com/coinbase/x402), providing on-chain payment settlement services for the Morph network.

**Base URL**: `https://morph-rails.morph.network/x402`

### Authentication Model

| Endpoint | Auth |
|----------|------|
| `POST /v2/verify` | HMAC signature |
| `POST /v2/settle` | HMAC signature |
| `GET /v2/supported` | None |

### Prerequisites

Obtain your **Access Key** and **Secret Key** from the [Morph x402 Console](https://morph-rails.morph.network/x402).

> **Important**: Store your Secret Key securely upon creation. It will only be shown once. To retrieve it later, contact the Morph team.

---

## 2. Getting Your API Credentials

1. Visit the [Morph x402 Console](https://morph-rails.morph.network/x402)
2. Connect your wallet (MetaMask or any EIP-1193 compatible wallet)
3. Sign the login message when prompted
4. Click **Create** to generate your API Key pair

You will receive:
- **Access Key** (`morph_ak_...`) — included in every API request header
- **Secret Key** (`morph_sk_...`) — used to compute HMAC signatures, never sent over the wire

> **Important**: The Secret Key is only displayed once at creation time. Store it securely. To retrieve it later, contact the Morph team.

> Each wallet address can only create one API Key.

---

## 3. HMAC Signature Authentication

All requests to `/v2/verify` and `/v2/settle` must include HMAC signature headers.

### 3.1 Required Headers

| Header | Description |
|--------|-------------|
| `MORPH-ACCESS-KEY` | Your Access Key |
| `MORPH-ACCESS-TIMESTAMP` | Request timestamp in **milliseconds**, must be within ±30s of server time |
| `MORPH-ACCESS-SIGN` | Base64-encoded HMAC-SHA256 signature |

### 3.2 Signature Algorithm

All signing elements are placed into a single JSON map. The map is serialized with **keys sorted in lexicographic order**, producing a compact JSON string (no whitespace). The signature is then computed over this string.

**Signature map structure:**

```json
{
  "MORPH-ACCESS-BODY": { "paymentPayload": { ... }, "paymentRequirements": { ... }, "x402Version": 2 },
  "MORPH-ACCESS-KEY": "morph_ak_a1b2c3d4e5f6g7h8",
  "MORPH-ACCESS-METHOD": "POST",
  "MORPH-ACCESS-PATH": "/x402/v2/settle",
  "MORPH-ACCESS-TIMESTAMP": "1738056600000",
  "chain": ["morph"],
  "version": ["2"]
}
```

| Field | Description | Rules |
|-------|-------------|-------|
| `MORPH-ACCESS-KEY` | Access Key, same as the header value | Required |
| `MORPH-ACCESS-TIMESTAMP` | Timestamp in milliseconds, same as the header value | Required |
| `MORPH-ACCESS-METHOD` | HTTP method, uppercase (e.g. `POST`) | Required |
| `MORPH-ACCESS-PATH` | Full URL path including gateway prefix (e.g. `/x402/v2/settle`), excluding query string | Required |
| Query params | Flattened into top-level map; values are `string[]` arrays | Omit if no query |
| `MORPH-ACCESS-BODY` | Request body parsed as JSON object | Omit if no body |

**Computation:**

```
signContent = JSON.serialize(signMap, sortKeys=true, compact=true)
signature   = Base64( HMAC-SHA256( secretKey, signContent ) )
```

### 3.3 Deterministic Serialization

The only requirement for a correct signature is: **all JSON keys must be recursively sorted in lexicographic order and output in compact format (no spaces, no newlines)**.

| Language | How keys are sorted |
|----------|-------------------|
| **Go** | `json.Marshal(map[string]interface{})` sorts keys automatically |
| **JavaScript / TypeScript** | `JSON.stringify` preserves insertion order; you must recursively sort keys before serializing |
| **Python** | `json.dumps(obj, sort_keys=True, separators=(',', ':'))` sorts keys automatically |

---

## 4. Business Endpoints

Request/response formats are fully compatible with the Coinbase x402 SDK. These endpoints return raw x402 responses (not wrapped in `code/data/message`).

### 4.1 POST /v2/verify (Auth Required)

Verify whether a payment payload is valid.

**Request**

```json
{
  "x402Version": 2,
  "paymentPayload": { ... },
  "paymentRequirements": { ... }
}
```

**Response** — `x402.VerifyResponse`

```json
{
  "isValid": true,
  "invalidReason": "",
  "payer": "0x..."
}
```

### 4.2 POST /v2/settle (Auth Required)

Submit an on-chain settlement.

**Request**

```json
{
  "x402Version": 2,
  "paymentPayload": { ... },
  "paymentRequirements": { ... }
}
```

**Response** — `x402.SettleResponse`

```json
{
  "success": true,
  "errorReason": "",
  "payer": "0x...",
  "transaction": "0x...",
  "network": "eip155:2818"
}
```

### 4.3 GET /v2/supported (No Auth)

Query supported payment methods and networks.

```bash
curl 'https://morph-rails.morph.network/x402/v2/supported'
```

**Response** — `x402.SupportedResponse`

```json
{
  "kinds": [
    { "x402Version": 2, "scheme": "exact", "network": "eip155:2818" }
  ],
  "extensions": [],
  "signers": {
    "eip155:*": ["0xb22C2E02997B10bc481907f05475C90047e84697"]
  }
}
```

---

## 5. Code Examples

### 5.1 Go — Integration with Coinbase x402 SDK

The recommended approach is to implement a custom `http.RoundTripper` that automatically signs requests at the transport layer, requiring zero changes to SDK usage code.

#### Signing Utilities

> `json.Marshal` on `map[string]interface{}` automatically sorts keys in Go. No extra sorting is needed.

```go
package morph

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/base64"
    "encoding/json"
    "net/url"
)

func BuildSignContent(accessKey, timestamp, method, path, rawQuery, rawBody string) []byte {
    signMap := map[string]interface{}{
        "MORPH-ACCESS-KEY":       accessKey,
        "MORPH-ACCESS-TIMESTAMP": timestamp,
        "MORPH-ACCESS-METHOD":    method,
        "MORPH-ACCESS-PATH":      path,
    }
    if rawQuery != "" {
        values, _ := url.ParseQuery(rawQuery)
        for k, vs := range values {
            signMap[k] = vs
        }
    }
    if rawBody != "" {
        var bodyObj interface{}
        if err := json.Unmarshal([]byte(rawBody), &bodyObj); err == nil {
            signMap["MORPH-ACCESS-BODY"] = bodyObj
        }
    }
    content, _ := json.Marshal(signMap)
    return content
}

func Sign(accessKey, secretKey, timestamp, method, path, rawQuery, rawBody string) string {
    content := BuildSignContent(accessKey, timestamp, method, path, rawQuery, rawBody)
    mac := hmac.New(sha256.New, []byte(secretKey))
    mac.Write(content)
    return base64.StdEncoding.EncodeToString(mac.Sum(nil))
}
```

#### Signing Transport

```go
package morph

import (
    "bytes"
    "io"
    "net/http"
    "strconv"
    "time"
)

type MorphSignTransport struct {
    accessKey string
    secretKey string
    base      http.RoundTripper
}

func NewMorphSignTransport(accessKey, secretKey string) *MorphSignTransport {
    return &MorphSignTransport{
        accessKey: accessKey,
        secretKey: secretKey,
        base:      http.DefaultTransport,
    }
}

func (t *MorphSignTransport) RoundTrip(req *http.Request) (*http.Response, error) {
    timestamp := strconv.FormatInt(time.Now().UnixMilli(), 10)
    method := req.Method
    path := req.URL.Path
    rawQuery := req.URL.RawQuery

    var rawBody string
    if req.Body != nil {
        bodyBytes, err := io.ReadAll(req.Body)
        if err != nil {
            return nil, err
        }
        rawBody = string(bodyBytes)
        req.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
    }

    sign := Sign(t.accessKey, t.secretKey, timestamp, method, path, rawQuery, rawBody)

    req.Header.Set("MORPH-ACCESS-KEY", t.accessKey)
    req.Header.Set("MORPH-ACCESS-TIMESTAMP", timestamp)
    req.Header.Set("MORPH-ACCESS-SIGN", sign)

    return t.base.RoundTrip(req)
}
```

#### Using with Coinbase x402 SDK

```go
package main

import (
    "net/http"
    "time"

    x402http "github.com/coinbase/x402/go"
    "your-project/morph"
)

func main() {
    httpClient := &http.Client{
        Transport: morph.NewMorphSignTransport("morph_ak_...", "morph_sk_..."),
        Timeout:   30 * time.Second,
    }

    facilitatorClient := x402http.NewFacilitatorClient(&x402http.FacilitatorConfig{
        URL:        "https://morph-rails.morph.network/x402/v2",
        HTTPClient: httpClient,
    })

    // Signing is handled automatically at the transport layer
    verifyResp, err := facilitatorClient.Verify(ctx, payloadBytes, requirementsBytes)
    settleResp, err := facilitatorClient.Settle(ctx, payloadBytes, requirementsBytes)
}
```

#### Complete Single-File Example (Gin + x402 Paywall)

A runnable example with HMAC signing, transport, and Gin router integrated with the Coinbase x402 SDK. Test environment values are pre-filled; replace `accessKey` and `secretKey` with your own.

```go
package main

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"net/url"
	"strconv"
	"time"

	x402 "github.com/coinbase/x402/go"
	x402http "github.com/coinbase/x402/go/http"
	ginmw "github.com/coinbase/x402/go/http/gin"
	evmServer "github.com/coinbase/x402/go/mechanisms/evm/exact/server"
	"github.com/gin-gonic/gin"
)

var (
	facilitatorURL = "https://..."
	accessKey      = "morph_ak_..." // Replace with your Access Key
	secretKey      = "morph_sk_..." // Replace with your Secret Key

	chainID        = int64(2910)
	tokenAddress   = "0xEcF966Cc754BC411E1F1106fbb4e343b835E85E4"
	tokenName      = "HoodiTestToken"
	tokenVersion   = "1.0"
	tokenDecimals  = 18
	payToAddress   = "0x98a55f86E1a57bBf28e4eA9dD719874075Fe6513"
	price          = "0.01"
	port           = "8080"
	requestTimeout = 10 * time.Second
)

func morphBuildSignContent(accessKey, timestamp, method, path, rawQuery, rawBody string) []byte {
	signMap := map[string]interface{}{
		"MORPH-ACCESS-KEY":       accessKey,
		"MORPH-ACCESS-TIMESTAMP": timestamp,
		"MORPH-ACCESS-METHOD":    method,
		"MORPH-ACCESS-PATH":      path,
	}
	if rawQuery != "" {
		values, _ := url.ParseQuery(rawQuery)
		for k, vs := range values {
			signMap[k] = vs
		}
	}
	if rawBody != "" {
		var bodyObj interface{}
		if err := json.Unmarshal([]byte(rawBody), &bodyObj); err == nil {
			signMap["MORPH-ACCESS-BODY"] = bodyObj
		}
	}
	content, _ := json.Marshal(signMap)
	return content
}

func morphSign(accessKey, secretKey, timestamp, method, path, rawQuery, rawBody string) string {
	content := morphBuildSignContent(accessKey, timestamp, method, path, rawQuery, rawBody)
	mac := hmac.New(sha256.New, []byte(secretKey))
	mac.Write(content)
	return base64.StdEncoding.EncodeToString(mac.Sum(nil))
}

type morphSignTransport struct {
	accessKey string
	secretKey string
	base      http.RoundTripper
}

func (t *morphSignTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	timestamp := strconv.FormatInt(time.Now().UnixMilli(), 10)
	var rawBody string
	if req.Body != nil {
		bodyBytes, err := io.ReadAll(req.Body)
		if err != nil {
			return nil, err
		}
		rawBody = string(bodyBytes)
		req.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
	}
	sign := morphSign(t.accessKey, t.secretKey, timestamp, req.Method, req.URL.Path, req.URL.RawQuery, rawBody)

	req.Header.Set("MORPH-ACCESS-KEY", t.accessKey)
	req.Header.Set("MORPH-ACCESS-TIMESTAMP", timestamp)
	req.Header.Set("MORPH-ACCESS-SIGN", sign)
	return t.base.RoundTrip(req)
}

func main() {
	httpClient := &http.Client{
		Transport: &morphSignTransport{accessKey: accessKey, secretKey: secretKey, base: http.DefaultTransport},
		Timeout:   requestTimeout,
	}

	facilitator := x402http.NewHTTPFacilitatorClient(&x402http.FacilitatorConfig{
		URL:        facilitatorURL,
		HTTPClient: httpClient,
	})

	evmServerScheme := evmServer.NewExactEvmScheme()
	evmServerScheme.RegisterMoneyParser(func(amount float64, _ x402.Network) (*x402.AssetAmount, error) {
		amountInSmallestUnits := math.Round(amount * math.Pow10(tokenDecimals))
		return &x402.AssetAmount{
			Amount: fmt.Sprintf("%.0f", amountInSmallestUnits),
			Asset:  tokenAddress,
			Extra: map[string]interface{}{
				"name":    tokenName,
				"version": tokenVersion,
			},
		}, nil
	})

	network := x402.Network(fmt.Sprintf("eip155:%d", chainID))

	routes := x402http.RoutesConfig{
		"GET /api/resource": {
			Accepts: x402http.PaymentOptions{
				{
					Scheme:  "exact",
					PayTo:   payToAddress,
					Price:   price,
					Network: network,
				},
			},
			Description: "Demo API Resource",
			MimeType:    "application/json",
		},
	}

	router := gin.Default()
	router.Use(ginmw.X402Payment(ginmw.Config{
		Routes:                 routes,
		Facilitator:            facilitator,
		Schemes:                []ginmw.SchemeConfig{{Network: network, Server: evmServerScheme}},
		SyncFacilitatorOnStart: true,
		Timeout:                requestTimeout,
	}))

	router.GET("/api/resource", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Payment successful, access granted.",
			"data":    "This is the protected data.",
		})
	})

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
```

---

### 5.2 JavaScript / TypeScript

> `JSON.stringify` preserves insertion order. You must recursively sort keys before serializing.

```typescript
import crypto from "crypto";

const ACCESS_KEY = "morph_ak_...";
const SECRET_KEY = "morph_sk_...";
const API_ORIGIN = "https://morph-rails.morph.network";
const API_PREFIX = "/x402";

function sortObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((sorted: any, key: string) => {
        sorted[key] = sortObject(obj[key]);
        return sorted;
      }, {});
  }
  return obj;
}

function sign(
  accessKey: string,
  secretKey: string,
  timestamp: string,
  method: string,
  path: string,
  rawQuery: string,
  rawBody: string
): string {
  const signMap: Record<string, any> = {
    "MORPH-ACCESS-KEY": accessKey,
    "MORPH-ACCESS-TIMESTAMP": timestamp,
    "MORPH-ACCESS-METHOD": method,
    "MORPH-ACCESS-PATH": path,
  };

  if (rawQuery) {
    const params = new URLSearchParams(rawQuery);
    params.forEach((v, k) => {
      if (signMap[k]) {
        (signMap[k] as string[]).push(v);
      } else {
        signMap[k] = [v];
      }
    });
  }

  if (rawBody) {
    signMap["MORPH-ACCESS-BODY"] = JSON.parse(rawBody);
  }

  const content = JSON.stringify(sortObject(signMap));
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(content);
  return hmac.digest("base64");
}

async function settlePayment(payload: object, requirements: object) {
  const timestamp = Date.now().toString();
  const method = "POST";
  const endpoint = "/v2/settle";
  const fullPath = API_PREFIX + endpoint; // /x402/v2/settle — used for signing
  const body = JSON.stringify({
    x402Version: 2,
    paymentPayload: payload,
    paymentRequirements: requirements,
  });

  const signature = sign(ACCESS_KEY, SECRET_KEY, timestamp, method, fullPath, "", body);

  const resp = await fetch(`${API_ORIGIN}${fullPath}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "MORPH-ACCESS-KEY": ACCESS_KEY,
      "MORPH-ACCESS-TIMESTAMP": timestamp,
      "MORPH-ACCESS-SIGN": signature,
    },
    body,
  });

  return resp.json();
}
```

---

## 6. Rate Limiting

- Default limit: **10 QPS** per Access Key
- When exceeded, HTTP 429 is returned:

```json
{
  "isValid": false,
  "invalidReason": "rate limit exceeded",
  "success": false,
  "errorReason": "rate limit exceeded"
}
```

---

## 7. Error Responses

Auth and rate-limit errors on `/v2/*` endpoints use the Coinbase x402 SDK compatible format:

```json
{
  "isValid": false,
  "invalidReason": "<error_description>",
  "success": false,
  "errorReason": "<error_description>"
}
```

| HTTP Status | Error | Description |
|-------------|-------|-------------|
| 401 | `missing auth headers` | One or more required HMAC headers are missing |
| 401 | `invalid timestamp` | Timestamp is not a valid integer |
| 401 | `timestamp expired` | Timestamp differs from server time by more than ±30s |
| 401 | `invalid access key` | Access Key does not exist |
| 401 | `invalid signature` | HMAC signature mismatch |
| 403 | `access key disabled` | Access Key has been disabled |
| 429 | `rate limit exceeded` | Request rate exceeded |

---

## 8. FAQ

**Q: Does `/v2/supported` require authentication?**
A: No. It is a public endpoint.

**Q: My signature keeps failing. How do I debug?**
A: Checklist:
1. Verify all fixed keys use the `MORPH-ACCESS-` prefix (e.g. `MORPH-ACCESS-KEY`, `MORPH-ACCESS-METHOD`)
2. Verify query parameters are flattened into the top-level map (not nested), with values as `string[]` arrays
3. Verify all keys in the sign map (including nested objects) are **recursively** sorted in lexicographic order
4. Verify the output is compact JSON (no extra spaces or newlines)
5. Verify the timestamp is in **milliseconds** (not seconds)
6. Verify the HTTP method is uppercase (`POST`, not `post`)
7. Verify `MORPH-ACCESS-PATH` is the **full URL path** including the `/x402` prefix (e.g. `/x402/v2/settle`, not `/v2/settle`), and does not include the query string
8. Verify `MORPH-ACCESS-BODY` is omitted when there is no request body

**Q: What is the Morph network identifier?**
A: CAIP-2 format: `eip155:2818`.

**Q: What if my Access Key is disabled?**
A: Contact the Morph team. Access Keys can only be manually enabled/disabled.

**Q: I lost my Secret Key. How do I get it back?**
A: Contact the Morph team. The Secret Key is only displayed once at creation time.
