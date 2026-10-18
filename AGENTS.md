# AGENTS.md --- Frontend Engineering Standards

These instructions apply to frontend code in this repository. Follow
existing project conventions when they are consistent with these
standards. Do not assume a framework, package manager, router, styling
system, or testing library until you inspect the repository.

## 1. Operating Principles

-   **Understand before editing.** Inspect the project structure,
    package scripts, framework versions, existing patterns, design
    tokens, tests, and relevant documentation before making changes.
-   **Prefer the smallest complete solution.** Avoid speculative
    abstractions, unnecessary dependencies, premature generalization,
    and unrelated cleanup.
-   **Preserve established behavior.** Do not change public interfaces,
    routes, API contracts, analytics events, or user-visible behavior
    unless the task requires it.
-   **Follow local conventions first.** Extend existing components and
    utilities where appropriate instead of introducing competing
    patterns.
-   **Use evidence, not assumptions.** Verify framework/library APIs
    against installed versions and official documentation when
    uncertain.
-   **Do not hide failures.** Never silence lint/type/test errors,
    disable rules, weaken assertions, or add unsafe casts merely to make
    checks pass.
-   **No unrelated churn.** Keep diffs focused on the requested outcome.

## 2. Required Workflow

For each task:

1.  **Inspect**
    -   Read the root README and relevant nested `AGENTS.md` files.
    -   Inspect `package.json`, lockfile, scripts,
        TypeScript/linter/formatter configuration, and nearby
        implementation/tests.
    -   Identify the actual framework, versions, state/data-fetching
        approach, UI library, and test tools.
2.  **Plan**
    -   Identify the user outcome, affected routes/components,
        loading/error/empty states, accessibility needs, and likely
        regressions.
    -   For multi-step work, state a concise implementation plan before
        making broad changes.
3.  **Implement**
    -   Make the smallest coherent change.
    -   Reuse existing design tokens and components.
    -   Keep business logic, data access, and presentation separated to
        the degree useful for the task; do not create layers without a
        concrete benefit.
4.  **Verify**
    -   Run the most relevant tests and project checks available, such
        as typecheck, lint, unit/integration tests, and production
        build.
    -   Test the changed user flow when browser/E2E tooling is
        available.
    -   Inspect the final diff for regressions, debug code, accidental
        files, and unrelated changes.
5.  **Report**
    -   Summarize what changed and why.
    -   List checks actually run and their results.
    -   Explicitly mention checks not run, failures, assumptions, or
        remaining risks. Never claim a check passed unless it was
        executed successfully.

Do not run destructive commands or rewrite lockfiles/configuration
without a task-related reason.

## 3. Architecture and Code Organization

-   Organize code around the repository's existing architecture. For
    feature-heavy applications, prefer clear feature boundaries over one
    giant shared-components folder.
-   Keep components focused on one coherent responsibility. Extract a
    component when it improves reuse, readability, testability, or
    meaningful separation---not just to reduce line count.
-   Keep domain/business rules out of purely presentational components
    when they need reuse or independent testing.
-   Keep shared utilities genuinely shared. Avoid generic helper layers
    used by only one call site unless they materially clarify complex
    logic.
-   Avoid circular dependencies and unclear import boundaries.
-   Keep modules cohesive; avoid files that become dumping grounds for
    unrelated components, hooks, constants, and types.
-   Use absolute/path aliases only if the repository already supports
    them consistently.
-   Do not create barrel files or re-export layers that obscure
    dependency boundaries or worsen bundle/build performance.
-   Add comments to explain intent, constraints, or non-obvious
    trade-offs---not to narrate straightforward code.

## 4. TypeScript and JavaScript

-   Prefer TypeScript for application code when the project uses it.
-   Avoid `any`. Prefer precise types, `unknown` plus narrowing,
    generics, or validated schemas.
-   Avoid unsafe type assertions. If one is necessary, keep it narrow
    and explain the invariant that makes it safe.
-   Model optional, nullable, loading, and error states explicitly.
-   Narrow external data at boundaries; compile-time types do not
    validate runtime API responses.
-   Prefer discriminated unions for states with distinct valid shapes.
-   Use `const` by default; use mutation only when it improves clarity
    and is safe.
-   Use strict equality and explicit conversions.
-   Handle rejected promises and errors intentionally. Do not leave
    unhandled async work or silently swallow exceptions.
-   Avoid non-null assertions unless a guaranteed invariant is clear and
    documented.
-   Do not duplicate types already exported from a reliable source of
    truth.

## 5. React Rules (Apply Only If the Repository Uses React)

-   Follow the Rules of Hooks. Call hooks unconditionally at the top
    level of React components or custom hooks.
-   Keep state minimal. Derive values from props/state instead of
    storing redundant copies.
-   Keep state as close as practical to the components that own it; lift
    it only when multiple consumers need a shared source of truth.
-   Use effects to synchronize with external systems, not as a default
    mechanism for deriving state or orchestrating ordinary event logic.
-   Give list items stable keys based on identity; do not use array
    indexes when items can be inserted, deleted, or reordered.
-   Keep controlled and uncontrolled input behavior consistent.
-   Avoid premature `memo`, `useMemo`, and `useCallback`. Add
    memoization when it addresses measured or clearly understood work,
    identity-sensitive APIs, or a demonstrated render problem.
-   Keep client-side JavaScript and client components as small as the
    framework permits.
-   In frameworks with server/client component boundaries, keep data
    fetching and secrets on the server where appropriate, and pass only
    the data the client needs.
-   Treat server actions and mutation endpoints as externally invocable
    boundaries: authenticate, authorize, validate input, and handle
    errors inside the action/handler itself.
-   Do not place secrets or privileged server-only modules in client
    bundles.
-   Avoid shared mutable module-level request state in
    SSR/server-rendered applications.

## 6. Data Fetching and Async Work

-   Do not introduce sequential `await` operations when the operations
    are independent. Run independent work concurrently with
    `Promise.all` or an appropriate project utility.
-   Preserve dependency ordering when later work genuinely depends on
    earlier results.
-   Start independent I/O as early as practical and await it only when
    needed.
-   Handle loading, success, empty, error, retry, and
    cancellation/stale-response states as appropriate to the
    interaction.
-   Avoid duplicate requests and race conditions. Prefer the project's
    established query/cache layer.
-   Do not add a new data-fetching library if existing platform or
    project tooling meets the need.
-   Validate and normalize untrusted API data at the boundary.
-   Keep pagination, filtering, sorting, and caching behavior consistent
    with API semantics.
-   Do not expose access tokens, secrets, internal errors, or sensitive
    data in logs or user-facing messages.

## 7. UI, UX, and Design Consistency

-   Inspect existing screens and design tokens before designing a new
    UI.
-   Use the established color, typography, spacing, radius, elevation,
    and breakpoint tokens. Avoid arbitrary one-off values when a token
    exists.
-   Build responsive layouts for narrow and wide viewports; do not
    assume desktop-only interaction.
-   Every meaningful async view should have appropriate loading, empty,
    error, and success states.
-   Use clear labels, useful validation messages, and preserve user
    input when validation fails where practical.
-   Destructive or irreversible actions need appropriate confirmation or
    undo behavior according to product conventions.
-   Prefer native HTML controls and semantic elements where they provide
    the right behavior.
-   Do not add gratuitous animations, gradients, glassmorphism,
    excessive shadows, or generic card grids. Visual styling must serve
    the product and content.
-   Respect `prefers-reduced-motion`; avoid motion that blocks or
    distracts from task completion.
-   Do not replace existing product branding or redesign unrelated areas
    unless asked.
-   Use real product copy and realistic content; avoid placeholder text
    in finished UI.

## 8. Accessibility --- Required

Target WCAG 2.2 AA where applicable and follow the project's
accessibility tooling.

-   Use semantic HTML and correct heading hierarchy.
-   Give form controls programmatic labels; associate help and error
    text with the relevant control.
-   All interactive functionality must be keyboard accessible, with
    visible focus indicators.
-   Never remove focus outlines without an equally visible replacement.
-   Use buttons for actions and links for navigation. Do not create
    clickable non-semantic elements when a native element fits.
-   Provide accessible names for icon-only controls.
-   Ensure dialogs and popovers manage focus appropriately and support
    Escape/close behavior where expected.
-   Provide meaningful alternative text for informative images; use
    empty alt text for decorative images.
-   Do not use color alone to convey meaning. Check text and control
    contrast.
-   Use ARIA only when native semantics are insufficient; keep roles,
    names, states, and properties accurate.
-   Avoid disabling browser zoom.
-   Respect reduced-motion preferences.
-   Test important flows using keyboard navigation; use automated
    accessibility checks when available.

## 9. Performance

Optimize user-perceived performance and measured bottlenecks; do not
micro-optimize blindly.

-   Avoid request waterfalls and unnecessary network round trips.
-   Keep initial JavaScript and route bundles small. Dynamically load
    heavy, non-critical features when beneficial.
-   Avoid importing large libraries for small utilities; prefer platform
    APIs or focused imports where supported.
-   Defer non-essential third-party scripts and widgets.
-   Specify image dimensions or aspect ratios to reduce layout shifts.
    Use the framework's image tooling when appropriate.
-   Do not lazy-load the primary above-the-fold/LCP image by default;
    lazy-load offscreen images when appropriate.
-   Use responsive image sizes and modern formats when supported by the
    project.
-   Avoid layout thrashing and expensive work on high-frequency events.
-   Debounce or throttle expensive search, resize, or scroll work where
    appropriate without harming usability.
-   Avoid unnecessary re-renders, but profile or identify the actual
    cause before adding complexity.
-   Set performance budgets or monitor Core Web Vitals when the project
    has the infrastructure to support them.
-   Treat performance changes as hypotheses to verify, not guaranteed
    improvements.

## 10. Security and Privacy

-   Treat query parameters, form inputs, URL state, local storage, API
    responses, and user-generated content as untrusted.
-   Avoid unsafe HTML injection. If rendering HTML is required, sanitize
    it with a trusted, appropriate sanitizer.
-   Do not store secrets in frontend code, public environment variables,
    browser storage, or logs.
-   Do not assume a hidden UI element or client-side route guard
    provides authorization.
-   Validate user input on the server as well as on the client when a
    server boundary exists.
-   Avoid leaking personal data in analytics, console logs, URLs, error
    messages, and client-side state.
-   Use safe URL handling and avoid open redirects.
-   Preserve CSRF, authentication, authorization, and content-security
    protections already in place.
-   Do not weaken security headers or validation to work around a
    frontend bug.

## 11. Forms and State

-   Use the project's existing form and validation approach.
-   Validate at the right boundary; client-side validation improves UX
    but does not replace server validation.
-   Keep field errors specific, actionable, and associated with fields.
-   Prevent duplicate submissions where appropriate and communicate
    pending states.
-   Preserve entered values when recoverable errors occur.
-   Model server mutations and optimistic updates carefully; provide
    rollback or recovery for failed optimistic changes.
-   Keep URL state in the URL when it should be shareable, bookmarkable,
    or participate in browser navigation.
-   Avoid putting sensitive information in query strings or persistent
    browser storage.

## 12. Testing and Quality Gates

-   Add or update tests for changed behavior, not just implementation
    details.
-   Prefer tests that verify user-visible outcomes and important
    business rules.
-   Cover relevant success, empty, validation, failure, and boundary
    cases.
-   Mock external boundaries selectively; avoid mocking the behavior
    under test.
-   Use integration or end-to-end tests for critical user journeys when
    available.
-   Add regression tests for fixed bugs when a stable test can reproduce
    the failure.
-   Avoid brittle tests tied to incidental markup, CSS classes, or
    internal component structure.
-   Do not delete or weaken tests just to make a change pass.
-   Run the repository's existing scripts rather than inventing new
    commands. If scripts are missing, state that limitation instead of
    silently claiming validation.

## 13. SEO, Metadata, and Web Platform

Apply these rules when the page is public/indexable and the framework
supports them.

-   Provide accurate page titles, descriptions, canonical URLs, and
    social metadata where appropriate.
-   Use semantic links and meaningful link text.
-   Ensure important content is discoverable by the chosen rendering
    strategy.
-   Add structured data only when it accurately represents visible
    content and is supported by the product.
-   Handle not-found and redirect behavior intentionally.
-   Do not expose private, authenticated, or user-specific content to
    indexing.
-   Avoid duplicate metadata and accidental indexing of staging or
    private pages.

## 14. Dependencies and Tooling

-   Inspect existing dependencies before adding another package.
-   Add dependencies only when the benefit justifies bundle,
    maintenance, security, and upgrade costs.
-   Prefer existing utilities, browser APIs, and framework-native
    capabilities when sufficient.
-   Match the existing package manager and lockfile; do not mix package
    managers.
-   Do not upgrade unrelated packages or regenerate the lockfile without
    need.
-   Follow the repository's formatter, lint rules, naming conventions,
    and import ordering.
-   Never bypass hooks or CI quality gates to force a change through.

## 15. Naming and Readability

-   Use descriptive names that communicate intent and domain meaning.
-   Follow existing file and symbol naming conventions.
-   Keep functions small enough to understand; split them when
    responsibilities or control flow become difficult to follow.
-   Prefer guard clauses when they make branching clearer.
-   Avoid deeply nested conditionals, boolean flags with unclear
    meaning, and clever abstractions.
-   Keep comments and documentation synchronized with behavior.
-   Do not add TODOs without a clear reason; for meaningful deferred
    work, explain the constraint and follow the project's tracking
    convention.

## 16. Definition of Done

A frontend task is complete only when all applicable items are true:

-   [ ] The requested user outcome is implemented without unrelated
    changes.
-   [ ] Existing architecture and design tokens are respected.
-   [ ] Loading, empty, error, and success states are handled where
    relevant.
-   [ ] Responsive behavior and accessibility have been considered.
-   [ ] Input validation, authorization boundaries, and privacy
    implications are addressed where relevant.
-   [ ] Tests have been added or updated for meaningful behavior
    changes.
-   [ ] Relevant typecheck, lint, tests, and build checks have been run
    where available.
-   [ ] The final diff has been reviewed for regressions, unsafe
    shortcuts, and accidental changes.
-   [ ] The completion report accurately states what was verified and
    what remains unverified.

## 17. Framework-Specific Guidance

These general rules do not replace framework-specific instructions.
Before applying specialized patterns:

-   **Next.js:** Confirm App Router vs Pages Router and the installed
    version. Follow current official guidance for server/client
    boundaries, caching, routing, metadata, images, and server actions.
-   **React without Next.js:** Follow the installed React version and
    existing router/build setup; do not introduce server-component
    assumptions.
-   **Vue, Svelte, Angular, or other frameworks:** Translate the intent
    of these standards into idiomatic framework patterns; do not apply
    React-specific rules literally.
-   **Tailwind or another utility CSS system:** Reuse configured tokens
    and variants; avoid duplicating design values or adding a second
    styling system.
-   **Component libraries:** Prefer accessible, existing primitives over
    reimplementing them, while preserving product design consistency.

When framework-specific details are important, consult official
documentation and the versions installed in the repository rather than
relying on memory.

## 18. Maintainer References

Use these references as living sources of guidance; verify compatibility
with the project's stack and versions before adopting a rule.

-   Vercel Agent Skills --- React Best Practices:
    https://github.com/vercel-labs/agent-skills
-   Vercel Web Interface Guidelines:
    https://github.com/vercel-labs/web-interface-guidelines
-   Front-End Checklist:
    https://github.com/thedaviddias/front-end-checklist

These references inform the standards; they are not a mandate to adopt
every rule, dependency, or architecture from those projects.
