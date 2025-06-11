await Bun.build({
  entrypoints: ['src/main.ts'],
  outdir: './build',
  minify: true,
  banner: "// {{Wikipedia:USync |repo=https://github.com/fee1-dead/cplus |ref=refs/heads/production |path=main.js}}\n\
// A helper for Special:CheckUser."
});