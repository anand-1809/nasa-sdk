![Star Wars Space GIF](https://github.com/user-attachments/assets/0ec87fd0-c221-4338-a3ea-1a659e6bbd55)
# @riank718/nasa-sdk 🧑🏻‍🚀🌕
A production-grade, TypeScript-first SDK for the **NASA Astronomy Picture of the Day (APOD)** API. Engineered for reliability, performance, and developer experience.

## Badges

[![NPM Version](https://img.shields.io/npm/v/@riank718/nasa-sdk)](https://www.npmjs.com/package/@riank718/nasa-sdk)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![NPM Downloads](https://img.shields.io/npm/dw/@riank718/nasa-sdk?color=blue)](https://www.npmjs.com/package/@riank718/nasa-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

---

## 🔑 Authentication & API Keys

This SDK makes it simple to integrate NASA's APIs. While some endpoints allow public access, it is highly recommended to obtain a free API key to avoid strict rate limiting.

- **Get your Key**: Register at [api.nasa.gov](https://api.nasa.gov) (Free and easy).
- **Rate Limits**: API keys are limited to **1,000 requests per hour**.
- **Efficiency**: We have implemented strict client-side validation using **Zod**. This prevents malformed requests from being sent to NASA, saving you from wasting your hourly request quota.
---
## ✨ Features

- ✅ Fetch **Today’s APOD**
- 🎲 Fetch **Random APODs**
- 📅 Fetch **APOD by date or date range**
- 🔁 Automatic retry with configurable backoff
- 🛑 `AbortSignal` support (React-friendly)
- 🧪 Fully tested with **Vitest**
- 📦 Dual build output (ESM + CJS)
- 🔒 Runtime response validation using **Zod**
- 💯 TypeScript-first API

---
## 📦 Installation

Install the SDK via npm:

```bash
npm install @riank718/nasa-sdk
```
---
### 🚀 Usage/Examples

```bash
import { NasaSDK } from '@riank718/nasa-sdk';

const nasa = new NasaSDK({
  apiKey: 'YOUR_NASA_API_KEY', // Defaults to 'DEMO_KEY'
  retries: 3,                 // Optional: Default 3
  retryDelayMs: 500           // Optional: Default 500ms
});

// Using the SDK
async function fetchSpaceData() {
  try {
    const apod = await nasa.getApod('2025-12-25');
    console.log(apod.title, apod.url);
  } catch (error) {
    console.error("SDK Error:", error.message);
  }
}
```
---
### 🧪 Prevent runtime crashes (best practice)
Optional but recommended:
```bash
const apiKey = import.meta.env.VITE_NASA_API_KEY;

if (!apiKey) {
  throw new Error('Missing VITE_NASA_API_KEY');
}

export const nasa = new NasaSDK({ apiKey });
```
---
### ⚛️ React Example (with AbortSignal)
This example demonstrates safe data fetching in React using AbortController
to prevent memory leaks and race conditions.
```bash
import { useEffect, useState } from 'react';
import { nasa } from './api/nasa'; // Initialized SDK instance

function ApodComponent({ selectedDate }: { selectedDate: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    nasa
      .getApod(selectedDate, controller.signal)
      .then(setData)
      .catch(err => {
        if (!(err instanceof DOMException)) {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [selectedDate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return <h2>{data.title}</h2>;
}
```
---
### 🛠️ API Reference
Get APOD for a specific date
```bash
nasa.getApod(date?: string, signal?: AbortSignal)
```
---

### 🏗️ Architecture
The SDK acts as a defensive proxy
1. Validation Layer: Catches bad dates/parameters locally.
2. Retry Engine: Handles transient 500 errors automatically.
3. Schema Layer: Ensures NASA's response matches our TypeScript interfaces exactly.
---
### 🧪 Development
Run Locally
```bash
git clone [https://github.com/anand-1809/nasa-sdk](https://github.com/anand-1809/nasa-sdk)
cd nasa-sdk
npm install
```
---
### 🔐 Environment Variables (Frontend Apps)
If you’re using this SDK in Vite / React:
```bash
VITE_NASA_API_KEY=your_api_key_here
```
Usage 
```bash
const nasa = new NasaSDK({
  apiKey: import.meta.env.VITE_NASA_API_KEY
});
```
---

### 🧪 Running Tests
```bash
npm run test
```
---
### 🧑‍💻 Tech Stack
 * Language: TypeScript
 * Validation: Zod
 * Testing: Vitest
 * Bundler: tsup
 * Runtime: Fetch API

---
### ⭐ Contributing
PRs and suggestions are welcome.
If you find this useful, consider starring the repo ⭐
 