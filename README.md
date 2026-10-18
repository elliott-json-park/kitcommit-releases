**English** | [한국어](README.ko.md)

# Kit Commit — Official downloads

A pixel kitten that grows with your Claude Code or Codex, or with Claude, ChatGPT and Gemini in your browser. It sits in the corner of your screen, works alongside you, and reminds you about lunch, breaks and bedtime. Connect your AI subscription or a free Gemini key and you can talk with it too.

**Website: [elliott-json-park.github.io/kitcommit-releases](https://elliott-json-park.github.io/kitcommit-releases/)** — see the cat in motion and play with it in your browser.

> **This is the only official place to download Kit Commit.**
> Get it from **[Releases](https://github.com/elliott-json-park/kitcommit-releases/releases)** only. Copies on other websites, file-sharing services or app stores are not official and may have been modified. If you find one, please let us know in [Issues](https://github.com/elliott-json-park/kitcommit-releases/issues).

This repository holds release files only. The source code is private.

## Download

Open the latest release on the **[Releases](https://github.com/elliott-json-park/kitcommit-releases/releases)** page and download:

| Your computer | File |
|---|---|
| Windows 10/11 (64-bit) | `KitCommit-Setup-<version>.exe` |
| Mac (Apple Silicon or Intel) | `KitCommit-<version>.dmg` |

To make sure a file is the real one, compare its SHA-256 checksum with the one written in the release notes.

- Windows (PowerShell): `Get-FileHash KitCommit-Setup-<version>.exe`
- Mac (Terminal): `shasum -a 256 KitCommit-<version>.dmg`

## Installing on Windows

Run `KitCommit-Setup-<version>.exe`. It installs for your account only (no admin rights needed) and opens Kit Commit when it's done.

- The app is not code-signed yet, so Windows may show **"Windows protected your PC"**. Click **More info → Run anyway**.
- **Updates are automatic.** The app checks for a new version in the background, and installs it the next time you quit or restart it (you can also choose **Install and restart** from the tray menu).
- To uninstall, use **Settings → Apps**. Your cat's progress (`%APPDATA%/Kit Commit`) is kept.
- If you used a pre-release test build (a single `.exe` with no installer), just install this one. Your progress carries over.

## Installing on a Mac

This beta is not signed with a (paid) Apple Developer account, so you have to let macOS open it **once**. After that it opens normally.

1. Open `KitCommit-<version>.dmg`
2. Drag the **Kit Commit** icon onto the **Applications** folder next to it
3. Open Kit Commit from the Applications folder → if a warning like "unidentified developer" appears, click **Done (or Cancel)**
4. Open **System Settings → Privacy & Security** and scroll down. Next to "Kit Commit was blocked" there is an **Open Anyway** button. Click it and enter your password
5. Open Kit Commit again and click **Open**

If you see "Kit Commit is damaged and can't be opened", open the **Terminal** app, paste the line below and press Enter. Then open the app again.

```bash
xattr -dr com.apple.quarantine "/Applications/Kit Commit.app"
```

There is no auto-update on Mac yet. When a new version comes out, install the new dmg over the old one the same way. Your cat's progress is kept.

## Privacy

Kit Commit reads your local Claude Code (`~/.claude/projects`) or Codex (`~/.codex/sessions`) history files and keeps **only counts, token numbers, timestamps and tool names**. Conversation content is never stored or sent anywhere. Everything is calculated on your computer.

- **Browser extension (web mode)**: on claude.ai, chatgpt.com and gemini.google.com it only tells the app "sent", "answered", the answer's length and the time. It never sends what you or the AI wrote, and it only talks to the app on your own computer.
- **Talking to your cat**: your chats with the cat are saved on your computer and go only to the AI you connected (your Claude or ChatGPT subscription through Claude Code / Codex CLI, or your own Gemini, Anthropic or OpenAI API key). API keys are encrypted with your operating system's secure storage.

## License

Free to download and use, but **not open source. All rights reserved.** You may not re-upload, sell or modify the app, or reuse its code, pixel art or characters. See [LICENSE](LICENSE).

> **An unofficial fan-made app.** Not affiliated with, made by, or endorsed by Anthropic, OpenAI or Google. Claude and Claude Code are trademarks of Anthropic. ChatGPT and Codex are trademarks of OpenAI. Gemini is a trademark of Google.

## Feedback

Bug reports and ideas are welcome in [Issues](https://github.com/elliott-json-park/kitcommit-releases/issues).
