# Tanstack Query + Legend State Integration Guide

This directory provides documentation to support developers adding Tanstack Query synchronization capabilities with Legendstate to @legendapp/state objects within the `RoutineTrace` application.

## Setup Guide

1. Configure the application's state synchronization with `tanstack-query`. This should be done before implementing any components. Follow the setup instructions detailed in: [Setup Configuration Guide](setup-configuration.md)

2. Next, understand how to implement queries and mutations using `@legendapp/state` objects in combination with the `useObservableSyncedQuery` hook in React components within the app. For this, refer to the implementation examples detailed in the subsequent document: [Component Usage Example](usage-component-example.md)

## Implementation Order

The recommended order of reviewing and implementing these documents is:

1. Study the setup process outlined in the [Setup Configuration](setup-configuration.md) guide first.
2. Then consult the [Component Usage Examples](usage-component-example.md) to understand the integration within React components.

In keeping with the structure of the ReactNative codebase, this setup guide outlines some important aspects to note, including how to install the required packages to begin the integration. In doing so, our application will be able to sync states to remote APIs as efficiently as possible. This setup facilitates communication between our queries/mutations and our legendstate objects within the app.

To get started, **first read the [Setup Configuration](setup-configuration.md) guide**.