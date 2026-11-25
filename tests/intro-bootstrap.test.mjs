import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import * as intro from "../src/components/fx/intro-store.ts";

function runIntro(pathname, homePath, { reduced = false, storageBlocked = false, seen = false } = {}) {
  const dataset = {};
  const listeners = new Map();
  const events = [];
  let finish;
  let stored = seen ? "1" : null;
  assert.equal(typeof intro.createIntroScript, "function");
  vm.runInNewContext(intro.createIntroScript(homePath, "(prefers-reduced-motion: reduce)"), {
    document: { documentElement: { dataset }, dispatchEvent: (event) => events.push(event.type) },
    location: { pathname },
    sessionStorage: {
      getItem(key) {
        assert.equal(key, intro.INTRO_STORAGE_KEY);
        if (storageBlocked) throw new Error("Storage denied");
        return stored;
      },
      setItem(key, value) {
        assert.equal(key, intro.INTRO_STORAGE_KEY);
        stored = value;
      },
    },
    matchMedia: () => ({ matches: reduced }),
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: (name) => listeners.delete(name),
    setTimeout: (handler, delay) => { finish = { handler, delay }; },
    Event,
  });
  return { dataset, listeners, events, finish, stored };
}

for (const [pathname, homePath] of [["/", "/"], ["/en", "/en"], ["/en/", "/en"]]) {
  test(`${pathname} shows the home content without a scroll lock or curtain timer`, () => {
    const result = runIntro(pathname, homePath);
    assert.equal(result.dataset.intro, "skip");
    assert.equal(result.listeners.size, 0);
    assert.equal(result.finish, undefined);
    assert.equal(result.stored, "1");
  });
}

test("a direct first visit to an internal page retains its existing intro and unlocks afterward", () => {
  const result = runIntro("/en/blog", "/en");
  assert.equal(result.dataset.intro, "play");
  assert.equal(result.finish.delay, intro.INTRO_OPEN_MS);
  assert.deepEqual([...result.listeners.keys()], ["wheel", "touchmove", "keydown"]);
  result.finish.handler();
  assert.equal(result.listeners.size, 0);
  assert.equal(result.dataset.intro, "done");
  assert.deepEqual(result.events, [intro.INTRO_EVENT]);
});

test("internal page intros skip on returning visits, reduced motion, and unavailable storage", () => {
  for (const options of [{ seen: true }, { reduced: true }, { storageBlocked: true }]) {
    const result = runIntro("/blog", "/", options);
    assert.equal(result.dataset.intro, "skip");
    assert.equal(result.listeners.size, 0);
    assert.equal(result.finish, undefined);
  }
});
