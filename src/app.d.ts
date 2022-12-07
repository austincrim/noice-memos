/// <reference types="@sveltejs/kit" />
/// <reference types="@cloudflare/workers-types" />
declare namespace App {
  // interface Error {}
  // interface Locals {}
  // interface PageData {}
  interface Platform {
    env: {
      memos_bucket: R2Bucket
    }
  }
}
