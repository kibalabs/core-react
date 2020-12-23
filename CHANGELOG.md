# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) with some additions:
- For all changes include one of [PATCH | MINOR | MAJOR] with the scope of the change being made.

## [Unreleased]

### Added

### Changed

### Removed

## [0.5.2]

### Added
- [MINOR] Updated react requirement to >=16.9 to allow for react 17
- [MINOR] Added `routing.createStaticHistory` to create a static history (useful for testing and SSR)
- [MINOR] Added `pageElement` prop to `Route` to allow using an instantiated page element

### Changed

### Removed

## [0.5.1]

### Added
- [MINOR] Added `react-is` dependency
- [MINOR] Added optional `history` prop to router to allow external control (useful for testing and SSR)
- [MINOR] Added `getIsRunningOnBrowser` function
- [MINOR] Added `useIsomorphicLayoutEffect` to make life easy for SSR

### Changed

### Removed

## [0.5.0] - 2020-11-25

Initial Commit - extracted from everypage
