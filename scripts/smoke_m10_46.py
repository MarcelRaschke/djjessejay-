#!/usr/bin/env python3
"""Smoke checks for the M10-46 Anthropic Mythos static page."""
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "anthropic-mythos.html"
README = ROOT / "README.md"
WORKER = ROOT / "workers" / "anthropic-mythos-assistant.js"

REQUIRED_PAGE_SNIPPETS = [
    "M10-46 · Anthropic Mythos · IP Codex",
    "Mythos für eine KI-Muse mit Gewissen.",
    "IP-Codex",
    "Debug-Manifest",
    "Worker-Assistent",
]

REQUIRED_README_SNIPPETS = [
    "## M10-46 Anthropic Mythos",
    "[Anthropic Mythos · IP Codex](anthropic-mythos.html)",
    "[Cloudflare Worker Assistent](workers/anthropic-mythos-assistant.js)",
]

REQUIRED_WORKER_SNIPPETS = [
    "Anthropic Mythos Assistant",
    "GET /health",
    "POST /assist",
    "export default",
]


class LinkAndIdParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.anchor_targets = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href", "").startswith("#"):
            self.anchor_targets.append(attrs["href"][1:])


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    page = PAGE.read_text(encoding="utf-8")
    readme = README.read_text(encoding="utf-8")
    worker = WORKER.read_text(encoding="utf-8")

    for snippet in REQUIRED_PAGE_SNIPPETS:
        require(snippet in page, f"Missing page snippet: {snippet}")

    for snippet in REQUIRED_README_SNIPPETS:
        require(snippet in readme, f"Missing README snippet: {snippet}")

    for snippet in REQUIRED_WORKER_SNIPPETS:
        require(snippet in worker, f"Missing worker snippet: {snippet}")

    parser = LinkAndIdParser()
    parser.feed(page)
    for target in parser.anchor_targets:
        require(target in parser.ids, f"Broken in-page anchor: #{target}")

    print("M10-46 smoke checks passed")


if __name__ == "__main__":
    main()
