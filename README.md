# MAKE.FUN news-image-20261120

This competition entry is a deterministic newspaper-style poster for Friday, 20 November 2026. It covers the Shenzhen summit, Russia's strike on Ukraine, the ICJ Myanmar genocide ruling, Anthropic's listing and market losses, Houthi strikes on Riyadh, UK drone aid, and Kenya's last Ebola patient.

[![make.fun · news-image-20261120](https://make.fun/badge/news-image-20261120.svg)](https://make.fun/bounty/news-image-20261120?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)
[![rank](https://make.fun/badge/news-image-20261120/Aji2306/news-image-20261120/rank.svg)](https://make.fun/bounty/news-image-20261120?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)
[![reward](https://make.fun/badge/news-image-20261120/Aji2306/news-image-20261120/reward.svg)](https://make.fun/bounty/news-image-20261120?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)

## Run

```sh
node generate.mjs
mkdir -p out
MAKEFUN_OUTPUT_DIR=out node main.ts
```

`generate.mjs` writes `entry.png` beside the source files. `main.ts` validates it and copies it to `MAKEFUN_OUTPUT_DIR` (default `/output`).

## License

See [LICENSE](LICENSE).
