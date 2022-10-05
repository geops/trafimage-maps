# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.16.4](https://github.com/geops/trafimage-maps/compare/v1.16.3...v1.16.4) (2022-10-05)


### Bug Fixes

* use a specific aerial style for sbb ([c32f97a](https://github.com/geops/trafimage-maps/commit/c32f97ac2ca193aa088c3d6d6d2ae5a8bc72bad8))

### [1.16.3](https://github.com/geops/trafimage-maps/compare/v1.16.2...v1.16.3) (2022-10-05)


### Bug Fixes

* subscribe stop sequence instead of simply get ([#1036](https://github.com/geops/trafimage-maps/issues/1036)) ([e0aea26](https://github.com/geops/trafimage-maps/commit/e0aea260a6a9ea1b95f16bb0dd2f97f38245ac79))

### [1.16.2](https://github.com/geops/trafimage-maps/compare/v1.16.1...v1.16.2) (2022-09-20)


### Bug Fixes

* add back url parameters to filter trains on punctuality layers ([0e367e7](https://github.com/geops/trafimage-maps/commit/0e367e7a4c7f8b656b4c5c76b896cc9f36973655))
* make punctuality layers queryable ([162d3be](https://github.com/geops/trafimage-maps/commit/162d3be24beb92e611f1d76449cd5b23c8e1a4f3))
* use delay style for full trajectory ([fe51757](https://github.com/geops/trafimage-maps/commit/fe51757f73b2a055aef93de81bbd1b863b5e6819))

### [1.16.1](https://github.com/geops/trafimage-maps/compare/v1.16.0...v1.16.1) (2022-09-20)


### Bug Fixes

* allow to use non-integer zoom ([cf5800f](https://github.com/geops/trafimage-maps/commit/cf5800f470cb501b3cc8868cba9e31ad5114342e))
* allow to use non-integer zoom ([3d11bc4](https://github.com/geops/trafimage-maps/commit/3d11bc4f813751ae4d4221d9f10bffb9b37ef4ce))

## [1.16.0](https://github.com/geops/trafimage-maps/compare/v1.15.0...v1.16.0) (2022-09-20)


### Features

* use mobility-toolbox-js v2 ([#1031](https://github.com/geops/trafimage-maps/issues/1031)) ([76b0071](https://github.com/geops/trafimage-maps/commit/76b0071a8ce287b53aae472ea66eda2081b64f3a))


### Bug Fixes

* **anlageverantwortliche:** only highlight the current author displayed in the overlay ([d1de023](https://github.com/geops/trafimage-maps/commit/d1de023f2debecc059be101614d5996bce4954aa))
* **zweitausbildung:** highlight the first selected line even if the overlay is already open ([87ba017](https://github.com/geops/trafimage-maps/commit/87ba017223892ee7bf77d188925fcd1edeef7e51))

## [1.15.0](https://github.com/geops/trafimage-maps/compare/v1.14.0...v1.15.0) (2022-09-14)


### Features

* use maplibre-gl instead of mapbox-gl ([#1030](https://github.com/geops/trafimage-maps/issues/1030)) ([1a7c3ea](https://github.com/geops/trafimage-maps/commit/1a7c3ea134f90e7db6716463b99a3719c865ec3f))

## [1.14.0](https://github.com/geops/trafimage-maps/compare/v1.13.3...v1.14.0) (2022-08-30)


### Bug Fixes

* **geolocation:** add direction to geolocation marker ([#1025](https://github.com/geops/trafimage-maps/issues/1025)) ([930f570](https://github.com/geops/trafimage-maps/commit/930f570d1eec23a1a6191f52a6455bf459c6f5fd)), closes [#1028](https://github.com/geops/trafimage-maps/issues/1028)

### [1.13.3](https://github.com/geops/trafimage-maps/compare/v1.13.2...v1.13.3) (2022-08-18)


### Bug Fixes

* display international vehicle registration code instead of iso c… ([#1023](https://github.com/geops/trafimage-maps/issues/1023)) ([e0c518c](https://github.com/geops/trafimage-maps/commit/e0c518c85acf72737f3893c8197d9c15b56f907f))
* **handicap:** updated equipment translations ([#1027](https://github.com/geops/trafimage-maps/issues/1027)) ([1d5688b](https://github.com/geops/trafimage-maps/commit/1d5688bd6e70cdd50fb477566b4fbabcc00c5961))

### [1.13.2](https://github.com/geops/trafimage-maps/compare/v1.13.1...v1.13.2) (2022-08-11)


### Bug Fixes

* **BPS:** update BPS topic name ([#1024](https://github.com/geops/trafimage-maps/issues/1024)) ([90b949e](https://github.com/geops/trafimage-maps/commit/90b949ebdc7c8f8a7157047b9809c0fcfe788a98))

### [1.13.1](https://github.com/geops/trafimage-maps/compare/v1.13.0...v1.13.1) (2022-08-05)


### Bug Fixes

* dont reopen overlay of a searched station after zoom changes ([4587234](https://github.com/geops/trafimage-maps/commit/4587234b3a9103b96e536c436945ff6668d7d5ec))

## [1.13.0](https://github.com/geops/trafimage-maps/compare/v1.12.5...v1.13.0) (2022-08-02)


### Features

* replace swissimage by aerial_sbb style ([#1022](https://github.com/geops/trafimage-maps/issues/1022)) ([478c5ba](https://github.com/geops/trafimage-maps/commit/478c5baad0289e8d54863f94733eaf49fb9725da))

### [1.12.5](https://github.com/geops/trafimage-maps/compare/v1.12.4...v1.12.5) (2022-07-26)


### Bug Fixes

* **direktverbindung:** make sure highlighted feature does not appear in featureinfo ([f9b0575](https://github.com/geops/trafimage-maps/commit/f9b0575cc8cf6340e241193ee71c06624f402d0a))
* display consent only once on development environment ([cb1216c](https://github.com/geops/trafimage-maps/commit/cb1216c6c0055336d6e82c628eab63442663c0c0) [bff3650](https://github.com/geops/trafimage-maps/commit/bff3650dea8644e7ab3bbd3f13fbc638563dedec))
* open feature information when we search for a station ([6556293](https://github.com/geops/trafimage-maps/commit/65562938e1ed92fd9c7fe4e531489d40d2946e94))
* remove showcases topic ([#1019](https://github.com/geops/trafimage-maps/issues/1019)) ([5d4699f](https://github.com/geops/trafimage-maps/commit/5d4699fda9630bf3aabe1459911ba5fc68e4aab1))

### [1.12.4](https://github.com/geops/trafimage-maps/compare/v1.12.3...v1.12.4) (2022-07-22)


### Bug Fixes

* deactivate tracking in local development ([db4238e](https://github.com/geops/trafimage-maps/commit/db4238e5e28d897f63663543af79c8ff78da4d96))
* display stops as cancelled when the all journey is cancelled ([8d7c1c1](https://github.com/geops/trafimage-maps/commit/8d7c1c10df6c8efeb07582f1d4271cc17bb922ed))
* netzkarte popup links opens a new window ([521407e](https://github.com/geops/trafimage-maps/commit/521407e299e46f9314e64e82dfb0b4bd77366554))
* only return one platform at a time ([#1018](https://github.com/geops/trafimage-maps/issues/1018)) ([b41d6ba](https://github.com/geops/trafimage-maps/commit/b41d6ba63ce12e6e8f316a2cc1f23df31d377d92))

### [1.12.3](https://github.com/geops/trafimage-maps/compare/v1.12.2...v1.12.3) (2022-07-13)


### Bug Fixes

* **bps:** add translation for topic


### [1.12.2](https://github.com/geops/trafimage-maps/compare/v1.12.1...v1.12.2) (2022-06-29)


### Bug Fixes

* **energie:** fix Energie-LayerInfo layout ([1fc0faa](https://github.com/geops/trafimage-maps/commit/1fc0faaf8b04cfab2b1a1684de486cb227da8404))
* **translations:** corrected typography errors ([2d002fe](https://github.com/geops/trafimage-maps/commit/2d002fec1007948d502a4d9ef0ac0846705b9b4d))

### [1.12.1](https://github.com/geops/trafimage-maps/compare/v1.12.0...v1.12.1) (2022-06-27)


### Bug Fixes

* **station-search:** always show first Swiss station in search results when collapsed ([#1013](https://github.com/geops/trafimage-maps/issues/1013)) ([d196004](https://github.com/geops/trafimage-maps/commit/d196004ba5fbb8dc82913511ea723e2862d6b361))

## [1.12.0](https://github.com/geops/trafimage-maps/compare/v1.11.0...v1.12.0) (2022-06-20)

## [1.11.0](https://github.com/geops/trafimage-maps/compare/v1.8.0...v1.11.0) (2022-06-17)

### Features

- Add open data links ([#1007](https://github.com/geops/trafimage-maps/issues/1007)) ([d6efcfe](https://github.com/geops/trafimage-maps/commit/d6efcfe751b934a8b266bb2a9b1790cb388bff9c))

## [1.10.0](https://github.com/geops/trafimage-maps/compare/v1.5.6...v1.10.0) (2022-06-15)

### Features

- **energie:** added Energie topics (public and internal) ([79c0913](https://github.com/geops/trafimage-maps/commit/79c09137985a1b6dfe6676361c352b6b239426e5))
- add standard-version for conventional commits ([#1009](https://github.com/geops/trafimage-maps/issues/1009)) ([5ed6dcc](https://github.com/geops/trafimage-maps/commit/5ed6dcc8bb42ad8404cfe40257aacaf7fb4bc5d9))

## [1.9.0](https://github.com/geops/trafimage-maps/compare/v1.9.0-beta.0...v1.9.0) (2022-06-15)
