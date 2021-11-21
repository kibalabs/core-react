# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) with some additions:
- For all changes include one of [PATCH | MINOR | MAJOR] with the scope of the change being made.

## [Unreleased]

### Added
- [MINOR] Added `useDeepCompareMemo`
- [MINOR] Added `useDeepCompareCallback`
- [MINOR] Added `useIsCoreRoutingEnabled` for routing to check if core-routing is used.
- [MINOR] Added `usePan`
- [MINOR] Added `useMousePositionRef`
- [MINOR] Added `useScale`
- [MINOR] Added `pointUtil`
- [MINOR] Added default Value  to `useUrlQueryState`
- [MINOR] Added `useDateUrlQueryState`
- [MINOR] Added `MockStorage`

### Changed
- [MINOR] Fix `useDeepCompareEffect` to not include the callback as a dependency
- [MINOR] Updated `useEventListener` to specify dependencies
- [MAJOR] Updated `Link` component in routing to use href and pass-through all other props
- [MAJOR] Changed `useLocalStorageState` to accept a `LocalStorageClient`

### Removed

## [0.6.2] - 2021-07-15

### Added
- [MINOR] Added `useLocation`
- [MINOR] Added `SubRouteOutlet` to render sub-routes within a route

### Changed
- [MINOR] Fixes for routing types

## [0.6.1] - 2021-07-06

### Added
- [MINOR] Added `useDebouncedCallback` for handling frequent state changes
- [MINOR] Added `useWindowSize` for tracking window size
- [MINOR] Added `usePreviousValue` for storing previous value

## [0.6.0] - 2021-02-06

### Added
- [MAJOR] Added `useNavigator` for routing

### Changed
- [MAJOR] Upgrade from @reach/router to react-router v6

### Removed
- [MAJOR] Removed `useHistory` for routing (use `useNavigator` instead)

## [0.5.5] - 2021-01-07

### Added
- [MINOR] Added `propsUtil` with a few methods and exceptions to make life easy for component writers
- [MINOR] Created `IOptionalSingleChildProps` to allow components to require an optional single child prop
- [MINOR] Created `OptionalProppedElement` to allow children from `IMultiChildProps` and `IOptionalSingleChildProps` to accept false values

## [0.5.4] - 2020-12-31

### Changed
- [MINOR] Corrected typings

## [0.5.3] - 2020-12-28

### Added
- [MINOR] Added `IOptionalSingleAnyChildProps`

### Changed
- [MINOR] Made `ISingleAnyChildProps` and `IMultiAnyChildProps` accept `React.ReactNode`

## [0.5.2] - 2020-12-23

### Added
- [MINOR] Updated react requirement to >=16.9 to allow for react 17
- [MINOR] Added `routing.createStaticHistory` to create a static history (useful for testing and SSR)
- [MINOR] Added `pageElement` prop to `Route` to allow using an instantiated page element

## [0.5.1] - 2020-12-16

### Added
- [MINOR] Added `react-is` dependency
- [MINOR] Added optional `history` prop to router to allow external control (useful for testing and SSR)
- [MINOR] Added `getIsRunningOnBrowser` function
- [MINOR] Added `useIsomorphicLayoutEffect` to make life easy for SSR

## [0.5.0] - 2020-11-25

Initial Commit - extracted from everypage
