# WORKSPACE_CONTEXT.md
# Generated: 2026-01-23
# Schema: v2.0
# Purpose: AI agent workspace reference (not for human reading)

```yaml
# ================================================================
# SECTION 1: METADATA & QUICK LOOKUP
# ================================================================

meta:
  generated: "2026-01-23"
  schema_version: "2.0"
  roots_count: 4
  primary_root: apphub-vision
  impl_root: copilot-flow  # Where ALL workflow docs are stored

roots:
  apphub-vision:
    type: monorepo
    pkg_manager: pnpm
    lang: typescript
    runtime: "node>=20"
    frameworks: [fastify, nextjs, langchain, langgraph, prisma, react]
    instructions: ".github/copilot-instructions.md"
    workflow_docs: copilot-flow  # Redirect to impl_root
    dev_cmd: "pnpm dev"
    build_cmd: "pnpm build"
    test_cmd: "pnpm test"

  reviews-assets:
    type: library
    pkg_manager: npm
    lang: [typescript, scss]
    runtime: "node>=18"
    frameworks: [react, storybook, tailwind, radix-ui]
    instructions: null
    workflow_docs: copilot-flow  # Redirect to impl_root
    dev_cmd: "npm run scss:watch"
    build_cmd: "npm run scss:production"
    test_cmd: null
    ui_library_path: "public/documentation/ui-library"

  boost-pfs-backend:
    type: monorepo
    pkg_manager: npm
    lang: typescript
    runtime: "node>=12"
    frameworks: [express, elasticsearch]
    instructions: ".github/instructions/"
    workflow_docs: copilot-flow  # Redirect to impl_root
    dev_cmd: "npm run dev"
    build_cmd: "npm run build:common"
    test_cmd: "npm run test"

  copilot-flow:
    type: documentation
    pkg_manager: null
    lang: markdown
    runtime: null
    frameworks: []
    instructions: ".github/copilot-instructions.md"
    workflow_docs: self  # This IS the impl_root
    dev_cmd: null
    build_cmd: null
    test_cmd: null

# ================================================================
# SECTION 2: SYSTEM GROUPING
# ================================================================

systems:
  clearer-platform:
    roots: [apphub-vision, reviews-assets, boost-pfs-backend]
    primary: apphub-vision
    description: "Clearer App - AI analytics & automation platform for Shopify"

  copilot-tooling:
    roots: [copilot-flow]
    primary: copilot-flow
    description: "Shared Copilot workflows and prompts for multi-root workspace"

# ================================================================
# SECTION 3: RELATIONSHIPS (Adjacency List)
# ================================================================

relationships:
  reviews-assets:
    - to: apphub-vision
      type: storybook-implementation
      sync: versioned
      via: "@apphubdev/clearer-ui"
      confidence: high
      notes: "UI lib published to GitHub Packages, dashboard imports v1.2.61"

  boost-pfs-backend:
    - to: apphub-vision
      type: microservice-peer
      sync: none
      via: "api-integration"
      confidence: high
      notes: "Discovery feature microservices (SIP - Sync Index Process)"

  apphub-vision:
    - to: reviews-assets
      type: shared-package
      sync: versioned
      via: "@apphubdev/clearer-ui"
      confidence: high

  copilot-flow:
    - to: apphub-vision
      type: shared-tooling
      sync: none
      via: "prompts-and-docs"
      confidence: high
    - to: reviews-assets
      type: shared-tooling
      sync: none
      via: "prompts-and-docs"
      confidence: high
    - to: boost-pfs-backend
      type: shared-tooling
      sync: none
      via: "prompts-and-docs"
      confidence: high

# ================================================================
# SECTION 4: PATH ROUTING
# ================================================================

path_routing:
  - pattern: "apphub-vision/apps/dashboard/**"
    root: apphub-vision
    domain: frontend
    rules: [tryCatch, react-server-components]
    related_roots: [reviews-assets]
    on_change_rebuild: ["@clearer/dashboard"]

  - pattern: "apphub-vision/apps/ai-api/**"
    root: apphub-vision
    domain: backend
    rules: [tryCatch, fastify, langchain]
    related_roots: []
    on_change_rebuild: ["@clearer/ai-api"]

  - pattern: "apphub-vision/packages/**"
    root: apphub-vision
    domain: shared-lib
    rules: [tryCatch, strict-types]
    related_roots: []
    on_change_rebuild: ["dependent-apps"]

  - pattern: "reviews-assets/public/documentation/ui-library/**"
    root: reviews-assets
    domain: design-system
    rules: [react, storybook]
    related_roots: [apphub-vision]
    on_change_rebuild: ["@apphubdev/clearer-ui"]

  - pattern: "reviews-assets/scss/**"
    root: reviews-assets
    domain: static-assets
    rules: [scss]
    related_roots: []
    on_change_rebuild: ["public/css"]

  - pattern: "boost-pfs-backend/packages/**"
    root: boost-pfs-backend
    domain: backend
    rules: [typescript, try-catch]
    related_roots: []
    on_change_rebuild: ["@bc-sip/*"]

  - pattern: "copilot-flow/.github/**"
    root: copilot-flow
    domain: docs
    rules: []
    related_roots: [apphub-vision, reviews-assets, boost-pfs-backend]
    on_change_rebuild: []

# ================================================================
# SECTION 5: CONVENTIONS BY ROOT
# ================================================================

conventions:
  apphub-vision:
    error_handling: "tryCatch utility from @clearer/utils for async"
    imports: "@clearer/* aliases, workspace:* protocol"
    types: "strict mode, interfaces for objects, no any"
    testing: "jest 29.x, ts-jest"
    async: "tryCatch returns {data, error}"
    pkg_install: "pnpm install from root"
    build_order: "db:generate → utils → core → assistant → apps"

  reviews-assets:
    error_handling: "standard try-catch"
    imports: "relative paths within ui-library"
    types: "typescript strict"
    testing: "playwright for e2e"
    async: "standard async/await"
    pkg_install: "npm install in ui-library folder"
    publish: "GitHub Packages @apphubdev/clearer-ui"

  boost-pfs-backend:
    error_handling: "try-catch blocks"
    imports: "@bc-sip/* workspace packages"
    types: "interfaces for objects, explicit returns"
    testing: "jest, AAA pattern"
    async: "standard async/await"
    pkg_install: "npm install from root"
    naming: "camelCase vars, PascalCase types, UPPER_SNAKE constants"

# ================================================================
# SECTION 6: PRE-COMPUTED QUERIES
# ================================================================

queries:
  pkg_manager:
    apphub-vision: pnpm
    reviews-assets: npm
    boost-pfs-backend: npm
    copilot-flow: null

  instructions_path:
    apphub-vision: ".github/copilot-instructions.md"
    reviews-assets: null
    boost-pfs-backend: ".github/instructions/"
    copilot-flow: null

  change_impact:
    "reviews-assets/public/documentation/ui-library/src/**":
      rebuild: ["@apphubdev/clearer-ui"]
      update_files: []
      sync_roots: [apphub-vision]
      action: "publish new version, update dashboard dependency"

    "apphub-vision/packages/utils/**":
      rebuild: ["@clearer/utils", "@clearer/core", "@clearer/assistant"]
      update_files: []
      sync_roots: []
      action: "pnpm utils:build from root"

    "apphub-vision/packages/core/**":
      rebuild: ["@clearer/core", "@clearer/assistant", "@clearer/ai-api"]
      update_files: []
      sync_roots: []
      action: "pnpm core:build from root"

  build_order:
    "@clearer/utils": ["@clearer/utils"]
    "@clearer/core": ["db:generate", "@clearer/core"]
    "@clearer/assistant": ["@clearer/utils", "@clearer/assistant"]
    "@clearer/dashboard": ["db:generate", "@clearer/utils", "@clearer/core", "@clearer/ui-utils", "@clearer/dashboard"]
    "@clearer/ai-api": ["db:generate", "@clearer/utils", "@clearer/core", "@clearer/assistant", "@clearer/ai-api"]

# ================================================================
# SECTION 7: CONFLICT RESOLUTION
# ================================================================

conflicts:
  pkg_manager:
    values:
      apphub-vision: pnpm
      reviews-assets: npm
      boost-pfs-backend: npm
    rule: use-root-specific

  error_handling:
    values:
      apphub-vision: tryCatch
      reviews-assets: try-catch
      boost-pfs-backend: try-catch
    rule: follow-root-instructions

  node_version:
    values:
      apphub-vision: ">=20"
      reviews-assets: ">=18"
      boost-pfs-backend: ">=12"
    rule: use-root-specific

  test_framework:
    values:
      apphub-vision: jest
      reviews-assets: playwright
      boost-pfs-backend: jest
    rule: follow-root-instructions

# ================================================================
# SECTION 8: STALENESS CHECK
# ================================================================

staleness:
  apphub-vision:
    checked: "2026-01-23"
    hashes:
      package.json: "clearer-1.0.0"
      copilot-instructions.md: "2026-01-13"
    watch: [package.json, tsconfig.json, pnpm-workspace.yaml, turbo.json, .github/**]

  reviews-assets:
    checked: "2026-01-23"
    hashes:
      package.json: "null"
      ui-library-package.json: "1.2.67"
    watch: [package.json, public/documentation/ui-library/package.json]

  boost-pfs-backend:
    checked: "2026-01-23"
    hashes:
      package.json: "bc-sip-2.0.0"
    watch: [package.json, .github/instructions/**]

  copilot-flow:
    checked: "2026-01-23"
    hashes: {}
    watch: [.github/**]

# ================================================================
# SECTION 9: CROSS-ROOT WORKFLOWS
# ================================================================

cross_root_workflows:
  # Pattern: Library provides package, Consumer imports it
  library_consumer:
    - library:
        root: reviews-assets
        package: "@apphubdev/clearer-ui"
        build_cmd: "cd reviews-assets && npm run build"
        source_path: "public/documentation/ui-library/"
      consumers:
        - root: apphub-vision
          apps: ["dashboard", "billing"]
          import_pattern: "import { X } from '@apphubdev/clearer-ui'"
      workflow:
        1_change_library: "Edit component in reviews-assets"
        2_build_library: "npm run build in reviews-assets"
        3_update_consumer: "Update imports in apphub-vision if API changed"
        4_test_integration: "pnpm dev in apphub-vision to verify"

  # Pattern: Shared packages within monorepo
  shared_packages:
    - provider:
        root: apphub-vision
        packages: ["@clearer/utils", "@clearer/core", "@clearer/types"]
      consumers:
        - root: apphub-vision
          apps: ["ai-api", "dashboard", "lambda"]
      workflow:
        1_update_package: "Edit in packages/"
        2_build_deps: "pnpm <pkg>:build from root"
        3_check_types: "pnpm build to verify types"

  # Pattern: API provider and consumer
  api_integration:
    - provider:
        root: boost-pfs-backend
        type: "REST API"
        services:
          sip-v3: "${DISCOVERY_SIP_V3_BASE_URL}"      # /sip-api/*
          admin-v2: "${DISCOVERY_ADMIN_V2_BASE_URL}"  # /bc-sf-filter-admin-v2/*
          admin-v3: "${DISCOVERY_ADMIN_V3_BASE_URL}"  # /sip-api/admin/*
          filter: "${DISCOVERY_FILTER_URL}"
          widget-integration: "${DISCOVERY_WIDGET_INTEGRATION_BASE_URL}"
        auth_method: "JWT via clearer-auth-token header"
      consumer:
        root: apphub-vision
        apps: ["dashboard"]
        config_file: "apps/dashboard/helper/boost/api/api.config.json"
        client_file: "apps/dashboard/helper/boost/api/base-api.ts"
      workflow:
        1_update_api: "Modify endpoint in boost-pfs-backend (keep backward compat)"
        2_deploy_backend: "Deploy backend first"
        3_update_config: "Update api.config.json if new endpoint"
        4_update_frontend: "Update API client in apphub-vision"
        5_deploy_frontend: "Deploy frontend after backend is live"

  # Build order when spanning roots
  multi_root_build_order:
    sequence:
      - root: reviews-assets
        cmd: "npm run build"
        reason: "Library must be built first"
      - root: apphub-vision
        cmd: "pnpm build"
        reason: "Consumer builds after library"

  # PR strategy for cross-root changes
  pr_strategies:
    independent:
      description: "Changes can be merged separately"
      use_when: "No breaking changes, can deploy independently"
      example: "reviews-assets PR → merge → apphub-vision PR → merge"

    coordinated:
      description: "Changes must be merged in order"
      use_when: "Breaking changes, sync deploy required"
      example: "PR #1 reviews-assets → merge → PR #2 apphub-vision (links to #1)"

    docs_separate:
      description: "Workflow docs in impl_root, code in other roots"
      use_when: "Standard workflow with docs"
      example: "PR copilot-flow (docs) + PR apphub-vision (code)"

# ================================================================
# END - Total sections: 9
# ================================================================
```
