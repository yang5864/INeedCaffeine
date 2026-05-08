import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import EasterEggReplayButton from "./EasterEggReplayButton.js";

test("renders an accessible easter egg replay button", () => {
  const html = renderToStaticMarkup(EasterEggReplayButton({ onClick: () => {} }));

  assert.match(html, /aria-label="이스터에그 재생하기"/);
  assert.match(html, />이스터에그 재생하기</);
});

test("renders nothing when the replay button is hidden", () => {
  const html = renderToStaticMarkup(EasterEggReplayButton({ visible: false, onClick: () => {} }));

  assert.equal(html, "");
});
