# COMPLETE TECHNICAL GUIDE: AI AGENT SYSTEMS, HERMES ARCHITECTURE, AND AUTONOMOUS INFRASTRUCTURE
## Deep Research Compilation for Print & Implementation Reference
### Version 1.0 — July 31, 2026

---

## TABLE OF CONTENTS

1. [HERMES AGENT RUNTIME ARCHITECTURE](#1-hermes-agent-runtime-architecture)
2. [PLUGIN SYSTEM: EXTENSIBILITY AT EVERY LAYER](#2-plugin-system-extensibility-at-every-layer)
3. [HOOK SYSTEM: INTERCEPTING THE AGENT LIFECYCLE](#3-hook-system-intercepting-the-agent-lifecycle)
4. [SKILLS SYSTEM: PROCEDURAL MEMORY AS CODE](#4-skills-system-procedural-memory-as-code)
5. [MEMORY SYSTEM: PERSISTENT CONTEXT ACROSS SESSIONS](#5-memory-system-persistent-context-across-sessions)
6. [MODEL GATEWAY & ROUTING: THE RIGHT MODEL FOR EVERY TASK](#6-model-gateway--routing-the-right-model-for-every-task)
7. [LOCAL LLM DEPLOYMENT: OLLAMA, QUANTIZATION, AND HARDWARE](#7-local-llm-deployment-ollama-quantization-and-hardware)
8. [TOOL REGISTRY: TERMINAL, FILE, WEB, BROWSER, COMPUTER USE](#8-tool-registry-terminal-file-web-browser-computer-use)
9. [DELEGATION & SUB-AGENTS: PARALLEL AUTONOMOUS EXECUTION](#9-delegation--sub-agents-parallel-autonomous-execution)
10. [CRON JOBS: SCHEDULED AUTONOMOUS WORK](#10-cron-jobs-scheduled-autonomous-work)
11. [VECTOR DATABASES & RAG: QDRANT, EMBEDDINGS, AND SEMANTIC SEARCH](#11-vector-databases--rag-qdrant-embeddings-and-semantic-search)
12. [OBSIDIAN AI SYSTEM: SELF-HOSTED SECOND BRAIN](#12-obsidian-ai-system-self-hosted-second-brain)
13. [MULTI-AGENT ORCHESTRATION PATTERNS](#13-multi-agent-orchestration-patterns)
14. [FREELANCE AI EMPLOYEE ARCHITECTURE](#14-freelance-ai-employee-architecture)
15. [IMPLEMENTATION ROADMAP: PHASE 0 THROUGH PHASE 4](#15-implementation-roadmap-phase-0-through-phase-4)
16. [APPENDIX: CONFIGURATION REFERENCES & COMMAND CHEATSHEETS](#16-appendix-configuration-references--command-cheatsheets)

---

# 1. HERMES AGENT RUNTIME ARCHITECTURE

## 1.1 Core Design Philosophy

Hermes Agent is a **local-first, extensible AI runtime** — not a chatbot wrapper. It runs entirely on your hardware, owns all data, and exposes a plugin/skill architecture for arbitrary capability expansion. The system is built around a central agent loop that orchestrates models, tools, memory, and plugins.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            HERMES RUNTIME                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │    PROFILES     │    │    PLUGINS      │    │    SKILLS       │           │
│  │  (isolated      │    │  (hooks, tools, │    │  (markdown      │           │
│  │   configs,      │    │   providers)    │    │   procedures    │           │
│  │   memories,     │    │                 │    │   + scripts)    │           │
│  │   cron jobs)    │    │                 │    │                 │           │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘           │
│           │                      │                      │                    │
│           └──────────────────────┼──────────────────────┘                    │
│                                  ▼                                           │
│                   ┌─────────────────────────┐                               │
│                   │      TOOL REGISTRY      │                               │
│                   │  (terminal, web, file,  │                               │
│                   │   browser, computer,    │                               │
│                   │   delegation, memory,   │                               │
│                   │   skills, cron, etc.)   │                               │
│                   └─────────────┬───────────┘                               │
│                                 │                                           │
│                                 ▼                                           │
│                   ┌─────────────────────────┐                               │
│                   │      MODEL GATEWAY      │                               │
│                   │  (Ollama, OpenRouter,   │                               │
│                   │   Anthropic, Custom     │                               │
│                   │   providers, fallback   │                               │
│                   │   chains, routing)      │                               │
│                   └─────────────┬───────────┘                               │
│                                 │                                           │
│         ┌───────────────────────┼───────────────────────┐                  │
│         ▼                       ▼                       ▼                  │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐            │
│  │   DISCORD   │        │  TELEGRAM   │        │    LOCAL    │            │
│  │   GATEWAY   │        │   GATEWAY   │        │    CLI/TUI  │            │
│  └─────────────┘        └─────────────┘        └─────────────┘            │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 1.2 Configuration Hierarchy

```
~/.hermes/
├── config.yaml                      # Global defaults
├── profiles/
│   ├── default/
│   │   ├── config.yaml              # Profile overrides
│   │   ├── skills/                  # Profile-specific skills
│   │   ├── plugins/                 # Profile-specific plugins
│   │   ├── memories/                # Profile memory DBs (SQLite)
│   │   └── cron/                    # Profile cron job definitions
│   └── work/                        # Additional profiles (same structure)
└── plugins/                         # Global plugins (shared across profiles)
```

## 1.3 Key Configuration Keys (config.yaml)

```yaml
# Model configuration
model:
  default: "kimi-k2.6"
  provider: "ollama-cloud"
  fallback_chain: ["deepseek-v4-flash", "qwen2.5-coder", "phi4"]
  parameters:
    temperature: 0.7
    max_tokens: 8192
    top_p: 0.95

# Delegation constraints
delegation:
  max_concurrent_children: 3
  max_spawn_depth: 1
  orchestrator_enabled: false

# Memory settings
memory:
  auto_extract: true
  max_chars: 2200
  injection_strategy: "prepend"

# Cron settings
cron:
  mirror_delivery: true
  default_deliver: "origin"

# Enabled toolsets
tools:
  enabled: ["terminal", "web", "file", "browser", "computer", "delegation", "memory", "skills", "cron"]

# Plugin configuration
plugins:
  enabled: ["model-router", "obsidian-sync", "github-automation"]
  directories:
    - "~/.hermes/plugins"
    - "~/.hermes/profiles/default/plugins"
```

## 1.4 Profile Isolation

Each profile is a complete, independent Hermes instance:
- Separate `config.yaml` with profile-specific overrides
- Separate skill directories (skills don't leak between profiles)
- Separate plugin directories (plugins don't leak)
- Separate memory SQLite databases
- Separate cron job definitions
- Separate session history databases

This allows running work, personal, and experimental agents simultaneously without cross-contamination.

---

# 2. PLUGIN SYSTEM: EXTENSIBILITY AT EVERY LAYER

## 2.1 Plugin Structure

A plugin is a directory with a manifest and implementation:

```
my-plugin/
├── plugin.yaml              # Manifest (REQUIRED)
├── __init__.py              # Entry point with register() function
├── schemas.py               # Tool schemas (JSON Schema for LLM)
├── tools.py                 # Tool handler implementations
├── hooks/                   # Hook implementations (optional)
│   ├── pre_llm_call.py
│   ├── post_llm_call.py
│   ├── pre_tool_call.py
│   └── post_tool_call.py
├── providers/               # Custom model providers (optional)
│   └── my_provider.py
└── config.yaml              # Plugin-specific config (optional)
```

## 2.2 Plugin Manifest (plugin.yaml)

```yaml
name: "my-awesome-plugin"
version: "1.0.0"
description: "Does cool things with hooks and tools"
author: "Arriq"
entry: "__init__.py"

# Hook declarations
hooks:
  - pre_llm_call
  - post_llm_call
  - pre_tool_call
  - post_tool_call
  - on_session_start
  - on_session_end

# Tool declarations
tools:
  - my_custom_tool
  - another_tool

# Custom provider declarations
providers:
  - my_custom_provider

# Configuration schema for user settings
config_schema:
  api_key:
    type: string
    required: true
    secret: true
  model_preference:
    type: string
    enum: ["fast", "balanced", "quality"]
    default: "balanced"
```

## 2.3 Plugin Entry Point (__init__.py)

```python
# ~/.hermes/plugins/my-plugin/__init__.py
from .schemas import TOOL_SCHEMAS
from .tools import TOOL_HANDLERS
from .hooks import HOOK_HANDLERS

def register(registry):
    """Called by Hermes at startup to register plugin components."""
    # Register tools
    for name, schema in TOOL_SCHEMAS.items():
        registry.register_tool(name, schema, TOOL_HANDLERS[name])
    
    # Register hooks
    for hook_name, handler in HOOK_HANDLERS.items():
        registry.register_hook(hook_name, handler)
    
    # Register providers (if any)
    # registry.register_provider("my-provider", MyProvider)

# Tool schemas (what the LLM sees)
TOOL_SCHEMAS = {
    "my_custom_tool": {
        "name": "my_custom_tool",
        "description": "Performs a custom operation with configurable behavior",
        "parameters": {
            "type": "object",
            "properties": {
                "input": {"type": "string", "description": "Input data to process"},
                "mode": {
                    "type": "string",
                    "enum": ["fast", "thorough", "creative"],
                    "default": "fast",
                    "description": "Processing mode"
                },
                "context_limit": {
                    "type": "integer",
                    "minimum": 100,
                    "maximum": 10000,
                    "default": 2000,
                    "description": "Maximum context characters"
                }
            },
            "required": ["input"]
        }
    }
}

# Tool handlers (what runs when called)
async def my_custom_tool_handler(args, context):
    input_data = args["input"]
    mode = args.get("mode", "fast")
    context_limit = args.get("context_limit", 2000)
    
    # Implementation here
    result = await process_input(input_data, mode, context_limit)
    
    return {"result": result, "mode": mode}

TOOL_HANDLERS = {
    "my_custom_tool": my_custom_tool_handler
}

# Hook handlers
async def pre_llm_call_hook(ctx):
    """Fires before every LLM call. Can modify context, route models, inject data."""
    # Route simple queries to fast model
    last_user_msg = next((m for m in reversed(ctx.messages) if m.role == "user"), None)
    if last_user_msg and len(last_user_msg.content) < 200:
        ctx.agent.model = "deepseek-v4-flash"
        ctx.agent.provider = "openrouter"
    
    # Inject relevant memories
    memories = await get_relevant_memories(last_user_msg.content)
    if memories:
        ctx.messages.insert(0, {
            "role": "system",
            "content": f"[RELEVANT MEMORIES]\n{memories}"
        })
    
    return ctx

async def post_llm_call_hook(ctx, response):
    """Fires after LLM response. Guardrails, logging, transformation."""
    # Guardrail: block prompt injection
    if "IGNORE PREVIOUS INSTRUCTIONS" in response.content.upper():
        return {**response, "content": "[BLOCKED: Prompt injection detected]"}
    
    # Log usage
    await log_usage(ctx.agent.model, response.usage)
    
    return response

async def pre_tool_call_hook(ctx, tool_call):
    """Fires before tool execution. Permission gates, auditing, auto-approval."""
    # Auto-approve safe tools
    safe_tools = ["read_file", "web_search", "search_files", "memory"]
    if tool_call.name in safe_tools:
        tool_call.auto_approve = True
    
    # Block dangerous commands
    if tool_call.name == "terminal":
        cmd = tool_call.args.get("command", "")
        dangerous = ["rm -rf /", "dd if=", "mkfs.", "> /dev/sda", "chmod 777 /"]
        if any(d in cmd for d in dangerous):
            raise PermissionError(f"Blocked dangerous command: {cmd}")
    
    return tool_call

async def post_tool_call_hook(ctx, tool_call, result):
    """Fires after tool execution. Result enrichment, caching, side effects."""
    # Cache web search results
    if tool_call.name == "web_search":
        await cache_search_results(tool_call.args.get("query"), result)
    
    return result

HOOK_HANDLERS = {
    "pre_llm_call": pre_llm_call_hook,
    "post_llm_call": post_llm_call_hook,
    "pre_tool_call": pre_tool_call_hook,
    "post_tool_call": post_tool_call_hook
}
```

## 2.4 Plugin Loading & Discovery

1. **Discovery**: Hermes scans `~/.hermes/plugins/` and `~/.hermes/profiles/{profile}/plugins/`
2. **Validation**: Each plugin's `plugin.yaml` is parsed and validated
3. **Dependency Resolution**: Plugins can declare dependencies (not yet implemented in v1)
4. **Registration**: `register()` function called, tools/hooks/providers added to registry
5. **Hook Ordering**: Hooks fire in alphabetical order by plugin directory name
6. **Enabling**: Only plugins listed in `plugins.enabled` in config.yaml actually load hooks/tools

---

# 3. HOOK SYSTEM: INTERCEPTING THE AGENT LIFECYCLE

## 3.1 Hook Types & Execution Order

```
USER MESSAGE ARRIVES
       │
       ▼
┌──────────────────┐
│ on_session_start │  (if new session)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  pre_llm_call    │ ◄── MODEL ROUTING, CONTEXT INJECTION, PROMPT MODIFICATION
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   MODEL CALL     │  (via Model Gateway)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ post_llm_call    │ ◄── GUARDRAILS, LOGGING, RESPONSE TRANSFORMATION
└────────┬─────────┘
         │
         ▼
    ┌────┴────┐
    │ TOOLS?  │──NO──► DELIVER RESPONSE
    └────┬────┘
         │YES
         ▼
┌──────────────────┐
│ pre_tool_call    │ ◄── PERMISSION GATES, AUTO-APPROVAL, AUDITING
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  TOOL EXECUTES   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ post_tool_call   │ ◄── RESULT ENRICHMENT, CACHING, SIDE EFFECTS
└────────┬─────────┘
         │
         ▼
    (loop back to pre_llm_call with tool result in context)
         │
         ▼
┌──────────────────┐
│ on_session_end   │  (if session ending)
└──────────────────┘
```

## 3.2 Hook Context Objects

Each hook receives a context object with different fields:

### pre_llm_call Context
```python
{
    "messages": [...],           # Full conversation history
    "agent": {
        "model": "kimi-k2.6",    # Current model (MUTABLE - change to route)
        "provider": "ollama-cloud",  # Current provider (MUTABLE)
        "tools": [...],          # Available tools
        "profile": "default",
        "config": {...}          # Resolved config
    },
    "session_id": "uuid",
    "profile": "default"
}
```

### post_llm_call Context
```python
{
    "messages": [...],           # Conversation including new assistant message
    "response": {
        "content": "...",        # Model output (MUTABLE)
        "usage": {...},          # Token usage
        "model": "kimi-k2.6",
        "finish_reason": "stop"
    },
    "agent": {...}
}
```

### pre_tool_call Context
```python
{
    "tool_call": {
        "name": "terminal",
        "args": {"command": "ls -la"},
        "id": "call_123",
        "auto_approve": False    # MUTABLE - set to True to skip approval
    },
    "agent": {...},
    "messages": [...]
}
```

### post_tool_call Context
```python
{
    "tool_call": {...},          # Original call
    "result": {...},             # Tool output (MUTABLE)
    "agent": {...},
    "messages": [...]
}
```

## 3.3 Advanced Hook Patterns

### Model Routing by Task Classification
```python
async def pre_llm_call_router(ctx):
    last_msg = next((m for m in reversed(ctx.messages) if m.role == "user"), None)
    if not last_msg:
        return ctx
    
    content = last_msg.content.lower()
    
    # Classification rules (can use a small classifier model)
    if any(kw in content for kw in ["code", "debug", "implement", "function", "api", "bug"]):
        ctx.agent.model = "qwen2.5-coder:32b"
        ctx.agent.provider = "ollama-cloud"
    elif any(kw in content for kw in ["write", "creative", "story", "poem", "article"]):
        ctx.agent.model = "claude-sonnet-4"
        ctx.agent.provider = "anthropic"
    elif any(kw in content for kw in ["analyze", "research", "compare", "deep dive"]):
        ctx.agent.model = "kimi-k2.6"
        ctx.agent.provider = "ollama-cloud"
    elif len(content) < 150:
        ctx.agent.model = "deepseek-v4-flash"
        ctx.agent.provider = "openrouter"
    
    return ctx
```

### Context Enrichment from External Sources
```python
async def pre_llm_call_enrich(ctx):
    last_msg = next((m for m in reversed(ctx.messages) if m.role == "user"), None)
    if not last_msg:
        return ctx
    
    query = last_msg.content
    
    # Search Obsidian vault
    obsidian_results = await search_obsidian(query, limit=5)
    if obsidian_results:
        ctx.messages.insert(0, {
            "role": "system",
            "content": f"[OBSIDIAN CONTEXT]\n{obsidian_results}"
        })
    
    # Check server health
    if any(kw in query.lower() for kw in ["server", "deploy", "service", "docker"]):
        health = await check_services()
        ctx.messages.insert(0, {
            "role": "system",
            "content": f"[SERVER HEALTH]\n{health}"
        })
    
    # Get relevant GitHub issues
    if any(kw in query.lower() for kw in ["issue", "pr", "github", "bug"]):
        issues = await get_relevant_github_issues(query)
        if issues:
            ctx.messages.insert(0, {
                "role": "system",
                "content": f"[GITHUB CONTEXT]\n{issues}"
            })
    
    return ctx
```

---

# 4. SKILLS SYSTEM: PROCEDURAL MEMORY AS CODE

## 4.1 Skill Format (SKILL.md)

Skills are markdown files with YAML frontmatter and structured content:

```markdown
---
name: "github-pr-workflow"
version: "1.2.0"
category: "github"
description: "Complete GitHub PR lifecycle: branch, commit, open, CI, merge"
tags: ["github", "pr", "ci", "workflow", "automation"]
requires: ["gh-cli", "git", "jq"]
author: "Finn"
---

# GitHub PR Workflow

## Trigger Conditions
- User says "open a PR" or "submit PR"
- After completing a feature branch with tests passing
- When asked to "push to GitHub and create PR"

## Prerequisites
- `gh auth status` shows authenticated
- Current branch has commits ahead of main
- All tests pass locally (`pytest` or project-specific)
- No uncommitted changes (or they're intentional)

## Steps

### 1. Pre-flight Checks
```bash
# Verify auth
gh auth status

# Check git status
git status
git diff --stat main

# Run tests
pytest -xvs  # or project-specific test command
```

### 2. Push Branch to Origin
```bash
BRANCH=$(git branch --show-current)
git push -u origin "$BRANCH"
```

### 3. Create PR with Structured Description
```bash
gh pr create \
  --title "feat: $(git log -1 --pretty=%s)" \
  --body "$(cat <<'EOF'
## Summary
Brief description of what changed and why.

## Changes
- Change 1
- Change 2

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual verification complete

## Screenshots (if UI changes)
![Description](url)

## Checklist
- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or migration guide included)
EOF
)"
```

### 4. Monitor CI Checks
```bash
# Watch checks until completion
gh pr checks --watch --fail-fast

# Or check specific workflow
gh run list --limit 5 --workflow=ci
gh run watch <run-id>
```

### 5. Handle Review Feedback
```bash
# Fetch review comments
gh pr view --comments

# Apply changes, commit, push
git add -A && git commit -m "fix: address review feedback" && git push

# Request re-review
gh pr review --request-changes  # or --approve if you're reviewer
```

### 6. Merge Strategy
```bash
# Squash and merge for features (default)
gh pr merge --squash --delete-branch

# Rebase and merge for fixes
gh pr merge --rebase --delete-branch

# Never force push to main
# Never merge without CI passing
```

## Pitfalls & Solutions

| Pitfall | Detection | Solution |
|---------|-----------|----------|
| Forgot to run tests | CI fails | Run `pytest` locally before push |
| PR body too sparse | Reviewers ask questions | Use template above |
| Merge conflicts | `gh pr checks` shows conflict | `git fetch main && git rebase main` |
| Wrong base branch | PR targets wrong branch | `gh pr create --base main` |
| Large PR hard to review | >500 lines changed | Split into smaller PRs |

## Verification Checklist
- [ ] PR appears on GitHub with correct title/body
- [ ] All CI checks pass (green)
- [ ] No merge conflicts
- [ ] Merged successfully
- [ ] Branch deleted (local and remote)
- [ ] Local main updated: `git checkout main && git pull`

## Related Skills
- `github-code-review` — How to review PRs effectively
- `github-issues` — Issue triage and management
- `test-driven-development` — Writing tests before code
```

## 4.2 Skill Discovery & Loading

Skills live in:
- `~/.hermes/skills/` (global)
- `~/.hermes/profiles/{profile}/skills/` (profile-specific)

Naming convention: `skill-name/SKILL.md` with optional `references/`, `templates/`, `scripts/` subdirectories.

The agent loads skills by:
1. Scanning skill directories
2. Parsing frontmatter for metadata
3. Matching trigger conditions against user intent
4. Loading full skill content into context when relevant

## 4.3 Skill Authoring Best Practices

1. **One skill per workflow**, not per tool
2. **Exact, copy-pasteable commands** — no pseudocode
3. **Document every pitfall** you've actually encountered
4. **Version skills** — increment when you learn something new
5. **Link reference files** — put specs, templates in `references/`
6. **Test the skill yourself** before considering it done
7. **Keep skills updated** — patch immediately when you hit uncovered issues

---

# 5. MEMORY SYSTEM: PERSISTENT CONTEXT ACROSS SESSIONS

## 5.1 Memory Architecture

Two separate SQLite databases per profile:
- `~/.hermes/profiles/{profile}/memories/user.db` — Facts about the user
- `~/.hermes/profiles/{profile}/memories/memory.db` — Facts about the environment/work

Each memory entry:
```sql
CREATE TABLE memories (
    id INTEGER PRIMARY KEY,
    target TEXT NOT NULL,        -- 'user' or 'memory'
    content TEXT NOT NULL,       -- The fact (declarative, not imperative)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags TEXT,                   -- Comma-separated tags for querying
    importance INTEGER DEFAULT 1 -- 1-10, for future prioritization
);
```

## 5.2 Memory Format Rules

**GOOD (declarative facts):**
```
"User runs Cider on Windows. Username: airfr. Plugin path: C:\\Users\\airfr\\AppData\\Local\\Packages\\CiderCollective.Cider_a6qxe093bx5xj\\LocalCache\\Roaming\\sh.cider.dotnet\\plugins\\<identifier>\\"
"Docker compose must run in foreground. User explicitly banned background=true. Quote: 'STOP WORKING AND DONT EVER USE THAT AGAIN UNLESS I TELL YOU TO'"
"Obsidian AI system at /home/das/obsidian-ai-system. CouchDB 5984, Ollama 11434, Qdrant 6333, Search API 8093. Sync endpoint: https://obsidian-sync.dasdev.net"
```

**BAD (instructions):**
```
"Always check Cider plugin path before helping with Cider"
"Never use background=true for Docker commands"
"Remember to sync Obsidian before enhancing"
```

## 5.3 Auto-Extraction Pipeline

With `memory.auto_extract: true` in config:

1. **After each conversation turn**, the system analyzes the exchange
2. **Extracts declarative facts** about user preferences, environment, corrections
3. **Deduplicates** against existing memories (semantic similarity)
4. **Stores** new memories with tags and importance scores
5. **Injects** relevant memories into next turn's system prompt

## 5.4 Memory Injection Strategy

Memories are injected as a system message at the start of each turn:

```markdown
[PERSISTENT MEMORIES]
User: Arriq, 15, sophomore, EST, Largo FL. Uses Cursor IDE, Python, web design. No emojis. Short messages. Wants lead documents as markdown files.
Environment: Docker compose needs foreground (no background=true). ntfy upstream needs ntfy.sh. Obsidian AI at /home/das/obsidian-ai-system with CouchDB/Ollama/Qdrant.
Preferences: Markdown lead docs with phone/email/business details. Push everything to GitHub so Cursor has context.
Corrections: User hates background=true for Docker. User wants concise responses.
```

## 5.5 Memory Management Commands

```bash
# View all memories
sqlite3 ~/.hermes/profiles/default/memories/user.db "SELECT content FROM memories;"
sqlite3 ~/.hermes/profiles/default/memories/memory.db "SELECT content FROM memories;"

# Search memories
sqlite3 ~/.hermes/profiles/default/memories/memory.db \
  "SELECT content FROM memories WHERE content LIKE '%docker%';"

# Count memories
sqlite3 ~/.hermes/profiles/default/memories/user.db "SELECT COUNT(*) FROM memories;"

# Manual memory add (via agent)
# Just say "remember that X" and it'll be extracted
```

---

# 6. MODEL GATEWAY & ROUTING: THE RIGHT MODEL FOR EVERY TASK

## 6.1 Gateway Architecture

The Model Gateway abstracts all model providers behind a unified interface:

```
┌─────────────────────────────────────────────────────────────┐
│                      MODEL GATEWAY                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   OLLAMA    │  │  OPENROUTER │  │  ANTHROPIC  │          │
│  │  (local/    │  │  (200+      │  │  (Claude    │          │
│  │   cloud)    │  │   models)   │  │   3.5/4)    │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          ▼                                   │
│              ┌─────────────────────┐                         │
│              │  UNIFIED INTERFACE  │                         │
│              │  - Chat completion  │                         │
│              │  - Streaming        │                         │
│              │  - Tool calling     │                         │
│              │  - Token counting   │                         │
│              │  - Retry/fallback   │                         │
│              └──────────┬──────────┘                         │
│                         │                                     │
│                         ▼                                     │
│              ┌─────────────────────┐                         │
│              │   FALLBACK CHAIN    │                         │
│              │  1. Primary model   │                         │
│              │  2. First fallback  │                         │
│              │  3. Second fallback │                         │
│              │  ...                │                         │
│              └─────────────────────┘                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 6.2 Provider Comparison

| Provider | Models | Cost | Latency | Privacy | Best For |
|----------|--------|------|---------|---------|----------|
| **Ollama Cloud** | 50+ | Free tier | Medium | Medium | General, coding, local models |
| **OpenRouter** | 200+ | Pay/token | Low | Low | Model variety, routing, cheap |
| **Anthropic** | Claude 3.5/4 | $$$ | Low | Low | Reasoning, creative, long context |
| **OpenAI** | GPT-4o, o1 | $$$ | Low | Low | General, tools, vision |
| **Local Ollama** | Any GGUF | Free (power) | High | **Full** | Privacy, offline, custom models |

## 6.3 Model Routing Rules (Implementation)

```yaml
# In plugin config or router plugin
routing:
  enabled: true
  default_model: "kimi-k2.6"
  default_provider: "ollama-cloud"
  rules:
    - name: "casual_chat"
      condition: "message_length < 150 AND NOT tools_needed"
      model: "deepseek-v4-flash"
      provider: "openrouter"
      priority: 10
    
    - name: "coding_tasks"
      condition: "tools_needed OR contains_code_keywords"
      model: "qwen2.5-coder:32b"
      provider: "ollama-cloud"
      priority: 20
    
    - name: "complex_reasoning"
      condition: "message_length > 500 OR contains_analysis_keywords"
      model: "kimi-k2.6"
      provider: "ollama-cloud"
      priority: 30
    
    - name: "creative_writing"
      condition: "contains_creative_keywords"
      model: "claude-sonnet-4"
      provider: "anthropic"
      priority: 25
    
    - name: "fallback"
      condition: "true"
      model: "kimi-k2.6"
      provider: "ollama-cloud"
      priority: 1
```

## 6.4 Known Router Bug (July 2026)

**Issue**: Router hook fires and sets `agent.model` correctly, but gateway footer displays `config.yaml` default instead of routed model.

**Root Cause**: `run.py:11902` — `_resolve_gateway_model()` reads `config.yaml` `model.default` instead of active `agent.model`.

**Impact**: Display only. Actual LLM call uses routed model correctly.

**Fix**: Patch `_resolve_gateway_model()` to check `agent.model` first.

---

# 7. LOCAL LLM DEPLOYMENT: OLLAMA, QUANTIZATION, AND HARDWARE

## 7.1 Quantization & Memory Math

**Fundamental formula**: `VRAM (GB) ≈ Parameters (B) × Bytes per parameter × Overhead`

| Quantization | Bits/Param | Bytes/Param | 7B Model | 14B Model | 32B Model |
|--------------|------------|-------------|----------|-----------|-----------|
| FP16 (full) | 16 | 2.0 | 14 GB | 28 GB | 64 GB |
| Q8_0 | 8 | 1.0 | 7 GB | 14 GB | 32 GB |
| Q6_K | 6 | 0.75 | 5.3 GB | 10.5 GB | 24 GB |
| **Q4_K_M** (default) | 4 | **0.5** | **3.5 GB** | **7 GB** | **16 GB** |
| Q3_K_M | 3 | 0.375 | 2.6 GB | 5.3 GB | 12 GB |
| Q2_K | 2 | 0.25 | 1.75 GB | 3.5 GB | 8 GB |

**Rule of thumb**: ~0.6 GB VRAM per billion parameters at Q4_K_M

## 7.2 Recommended Models for Your Setup

Since you have **no local GPU** (using Ollama Cloud), these are the models available to you:

| Model | Size | Use Case | Context | Notes |
|-------|------|----------|---------|-------|
| `qwen2.5-coder:7b` | 4.7 GB | Fast coding | 32K | Best small coding model |
| `qwen2.5-coder:14b` | 9 GB | Better coding | 32K | Sweet spot quality/speed |
| `qwen2.5-coder:32b` | 19 GB | Best coding | 32K | Via Ollama Cloud |
| `phi4:14b` | 9 GB | General reasoning | 16K | Microsoft, strong logic |
| `deepseek-r1:7b` | 4.7 GB | Reasoning | 32K | Chain-of-thought |
| `deepseek-r1:14b` | 9 GB | Better reasoning | 32K | Via Ollama Cloud |
| `llama3.1:8b` | 4.9 GB | General purpose | 128K | Meta, long context |
| `nomic-embed-text` | 274 MB | **Embeddings** | 8K | **REQUIRED for RAG** |

## 7.3 Ollama Configuration

```yaml
# ~/.ollama/config.yaml (if running locally)
# Or via environment variables for Ollama Cloud
OLLAMA_HOST: "https://ollama.com"
OLLAMA_API_KEY: "your-key"
OLLAMA_MODELS:
  - "qwen2.5-coder:32b"
  - "phi4:14b"
  - "nomic-embed-text"
  - "deepseek-r1:14b"

# Model parameters (in config.yaml or per-request)
model_parameters:
  temperature: 0.7
  top_p: 0.95
  top_k: 40
  num_ctx: 8192        # Context window
  num_predict: 4096    # Max output tokens
  repeat_penalty: 1.1
  seed: -1             # Random
```

## 7.4 Embedding Model Selection

For your Obsidian AI system, **nomic-embed-text** is the standard choice:

| Model | Dimensions | Max Tokens | Languages | Quality | Size |
|-------|------------|------------|-----------|---------|------|
| `nomic-embed-text` | 768 | 8192 | 100+ | Excellent | 274 MB |
| `mxbai-embed-large` | 1024 | 512 | 100+ | Excellent | 670 MB |
| `bge-large-en-v1.5` | 1024 | 512 | English | Best EN | 670 MB |
| `e5-large-v2` | 1024 | 512 | 100+ | Excellent | 670 MB |

**Recommendation**: Use `nomic-embed-text` via Ollama Cloud — matches your phi4 chat model, good multilingual support, small size.

---

# 8. TOOL REGISTRY: TERMINAL, FILE, WEB, BROWSER, COMPUTER USE

## 8.1 Terminal Tool

**Most powerful tool** — full Linux shell access.

```python
# Schema
{
    "name": "terminal",
    "description": "Execute shell commands. Use for builds, installs, git, processes, scripts.",
    "parameters": {
        "type": "object",
        "properties": {
            "command": {"type": "string", "description": "Command to execute"},
            "timeout": {"type": "integer", "default": 180, "description": "Max seconds"},
            "workdir": {"type": "string", "description": "Working directory"},
            "pty": {"type": "boolean", "default": false, "description": "Use PTY for interactive"}
        },
        "required": ["command"]
    }
}
```

**Critical Rules for Your Setup**:
- **NEVER use `background=true`** for Docker commands — user explicitly banned it
- Use **foreground with generous timeout** (300-600s) instead
- For servers/daemons: `background=true` WITHOUT `notify_on_complete` (silent is correct)
- For bounded tasks: `background=true` WITH `notify_on_complete=true`

## 8.2 File Tools

```python
# read_file - Read with pagination
{"name": "read_file", "parameters": {"path": "str", "offset": "int", "limit": "int"}}

# write_file - Full overwrite
{"name": "write_file", "parameters": {"path": "str", "content": "str"}}

# patch - Targeted find/replace (preferred over sed)
{"name": "patch", "parameters": {"mode": "replace", "path": "str", "old_string": "str", "new_string": "str"}}

# search_files - Ripgrep-backed
{"name": "search_files", "parameters": {"pattern": "str", "target": "content|files", "file_glob": "str"}}
```

## 8.3 Web Tools

```python
# web_search - Up to 10 results
{"name": "web_search", "parameters": {"query": "str", "limit": "int"}}

# web_extract - Full page content as markdown
{"name": "web_extract", "parameters": {"urls": ["str"], "char_limit": "int"}}
```

## 8.4 Browser Tools (Puppeteer-based)

```python
# browser_navigate - Load page, returns snapshot
{"name": "browser_navigate", "parameters": {"url": "str"}}

# browser_snapshot - Accessibility tree
{"name": "browser_snapshot", "parameters": {"full": "bool"}}

# browser_click - Click by ref ID
{"name": "browser_click", "parameters": {"ref": "str"}}

# browser_type - Type into field
{"name": "browser_type", "parameters": {"ref": "str", "text": "str"}}

# browser_scroll - Scroll page
{"name": "browser_scroll", "parameters": {"direction": "up|down"}}

# browser_console - JS console output
{"name": "browser_console", "parameters": {"expression": "str"}}

# browser_vision - Screenshot with annotations
{"name": "browser_vision", "parameters": {"question": "str", "annotate": "bool"}}
```

## 8.5 Computer Use (cua-driver)

**Background desktop control** — doesn't steal your cursor.

```python
# Capture with SOM (Set of Marks) - numbered overlays
{"action": "capture", "mode": "som", "app": "Firefox", "max_elements": 100}

# Click by element index (PREFERRED)
{"action": "click", "element": 14, "app": "Firefox"}

# Type text
{"action": "type", "text": "search query", "element": 5, "app": "Firefox"}

# Key combos
{"action": "key", "keys": "ctrl+s", "app": "VS Code"}

# Scroll
{"action": "scroll", "direction": "down", "amount": 3, "app": "Firefox"}

# Verify with follow-up capture
{"action": "capture", "mode": "som", "app": "Firefox", "capture_after": true}
```

**Workflow**:
1. `capture` → get screenshot + numbered elements
2. Identify target element by index
3. `click`/`type`/`key` by element index
4. `capture_after=true` to verify result

**Use Cases for You**:
- Cider plugin development: automate plugin testing in Cider UI
- Discord bot testing: drive Discord to test responses
- Web scraping: login-required sites, dynamic content
- GUI automation: repetitive clicks in any app
- Visual regression: screenshot compare before/after

---

# 9. DELEGATION & SUB-AGENTS: PARALLEL AUTONOMOUS EXECUTION

## 9.1 Sub-Agent Architecture

```
MAIN AGENT (you)
    │
    ├── delegate_task(goal="debug login bug", context="...")
    │       └── SUBAGENT 1 (isolated terminal, own context)
    │              → runs tests, reads logs, applies fix
    │              → returns SUMMARY only
    │
    ├── delegate_task(tasks=[taskA, taskB, taskC])
    │       ├── SUBAGENT 2 (parallel)
    │       ├── SUBAGENT 3 (parallel)
    │       └── SUBAGENT 4 (parallel)
    │
    └── cron job → delegate_task → SUBAGENT 5 (scheduled)
```

## 9.2 Delegation Constraints (Current Config)

| Limit | Value | Config Key |
|-------|-------|------------|
| Max concurrent children | 3 | `delegation.max_concurrent_children` |
| Max spawn depth | 1 | `delegation.max_spawn_depth` |
| Orchestrator enabled | false | `delegation.orchestrator_enabled` |
| Subagent toolset | Leaf subset | No delegation, clarify, memory, send_message, execute_code |

## 9.3 Leaf vs Orchestrator Subagents

| Capability | Leaf (default) | Orchestrator |
|------------|----------------|--------------|
| Can spawn subagents | ❌ | ✅ (if enabled) |
| Can use `delegate_task` | ❌ | ✅ |
| Can use `clarify` | ❌ | ❌ |
| Can use `memory` | ❌ | ❌ |
| Can use `send_message` | ❌ | ❌ |
| Can use `execute_code` | ❌ | ❌ |
| Tools available | terminal, file, web, browser | Same + delegation |

## 9.4 Delegation Patterns

### Pattern 1: Research → Plan → Execute
```python
# Main agent spawns researcher
result = await delegate_task(
    goal="Research best auth for client portals",
    context="Need JWT + refresh tokens, role-based access, small business context"
)
# Researcher returns markdown report

# Main agent creates plan from report
plan = create_implementation_plan(result.summary)

# Main agent spawns implementer
await delegate_task(
    goal="Implement auth per plan",
    context={"plan": plan, "repo": "/home/das/portfolio-v2"}
)
```

### Pattern 2: Parallel Exploration
```python
results = await delegate_task(tasks=[
    {"goal": "Research React auth libraries", "context": "Next.js 14, App Router"},
    {"goal": "Research Vue auth libraries", "context": "Vue 3, Composition API"},
    {"goal": "Research Svelte auth libraries", "context": "SvelteKit 2"}
])
# All 3 run in parallel, return summaries
```

### Pattern 3: Cron → Delegate → Notify
```yaml
# Cron job prompt
prompt: |
  Check for new Minecraft plugin jobs on SpigotMC/BuiltByBit.
  If found, delegate_task to draft proposals for top 3.
  Save proposals to ~/freelance-leads/proposals/.
  Notify me with summary.
```

## 9.5 Subagent Context Passing

Critical: Subagents have **NO memory of your conversation**. Pass everything explicitly:

```python
await delegate_task(
    goal="Fix the login bug",
    context="""
    REPO: /home/das/portfolio-v2
    BRANCH: fix/login-bug
    ERROR: "Invalid token" on POST /api/auth/login
    LOGS: See /home/das/portfolio-v2/logs/auth.log
    TESTS: Run `pytest tests/auth/ -xvs`
    CONSTRAINTS: Don't modify database schema. Use existing User model.
    RELEVANT FILES:
    - src/auth/handlers.py
    - src/auth/tokens.py
    - src/models/user.py
    """,
    toolsets=["terminal", "file", "web"]
)
```

---

# 10. CRON JOBS: SCHEDULED AUTONOMOUS WORK

## 10.1 Cron Job Types

| Type | Use Case | Config |
|------|----------|--------|
| **Agent-driven** (default) | Reasoning, summarization, drafting | `no_agent: false` |
| **Script-only** | Watchdogs, metrics, heartbeats | `no_agent: true`, `script: "check.sh"` |
| **Session-attached** | Conversational recurring jobs | `attach_to_session: true` |

## 10.2 Cron Schedule Formats

| Format | Example | Meaning |
|--------|---------|---------|
| Interval | `"30m"` | Every 30 minutes |
| Interval | `"every 2h"` | Every 2 hours |
| Cron | `"0 9 * * *"` | Daily at 9 AM |
| Cron | `"0 3 * * 1-5"` | Weekdays at 3 AM |
| ISO timestamp | `"2026-07-31T09:00:00"` | One-shot |

## 10.3 Your Cron Job Definitions

### Job 1: Daily Obsidian Enhancer (Agent-driven)
```yaml
name: "obsidian-daily-enhancer"
schedule: "0 3 * * *"           # 3 AM daily
prompt: |
  Read today's daily note from Obsidian vault at /home/das/obsidian-ai-system/vault/Daily/
  Restructure with clear headers, expand bullet points into full thoughts,
  add mood tags based on content sentiment, extract all TODOs to separate file.
  Write enhanced version as sidecar: Daily/YYYY-MM-DD.enhanced.md
  Also update the main note with a "Enhanced: YYYY-MM-DD" marker.
skills: ["obsidian", "note-taking"]
```

### Job 2: Server Health Watchdog (Script-only, no_agent)
```yaml
name: "server-health-watchdog"
schedule: "*/5 * * * *"         # Every 5 minutes
script: "check-services.sh"     # Returns stdout ONLY if issues
no_agent: true
deliver: "origin"
```

**check-services.sh**:
```bash
#!/bin/bash
# Returns output ONLY if problems detected (watchdog pattern)

ISSUES=()

# Check Docker containers
for container in couchdb ollama qdrant search-api enhancer nginx; do
    if ! docker ps --format "{{.Names}}" | grep -q "^${container}$"; then
        ISSUES+=("Container DOWN: $container")
    fi
done

# Check disk space
DISK_USED=$(df /home/das | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USED" -gt 85 ]; then
    ISSUES+=("Disk usage critical: ${DISK_USED}%")
fi

# Check Ollama responsiveness
if ! curl -sf http://localhost:11434/api/tags >/dev/null; then
    ISSUES+=("Ollama not responding")
fi

# Check Qdrant
if ! curl -sf http://localhost:6333/healthz >/dev/null; then
    ISSUES+=("Qdrant not healthy")
fi

# Check Search API
if ! curl -sf http://localhost:8093/health >/dev/null; then
    ISSUES+=("Search API down")
fi

# Output only if issues (silent = healthy)
if [ ${#ISSUES[@]} -gt 0 ]; then
    echo "⚠️ SERVER HEALTH ALERTS:"
    printf '%s\n' "${ISSUES[@]}"
    exit 1  # Non-zero = alert delivered
fi
exit 0  # Silent = all good
```

### Job 3: Freelance Lead Hunter (Agent-driven)
```yaml
name: "freelance-lead-hunter"
schedule: "0 9 * * 1-5"         # Weekdays 9 AM
prompt: |
  Search Upwork, SpigotMC, BuiltByBit, and Discord job boards for new Minecraft plugin jobs.
  Filter: budget > $100, skills match (Spigot, Paper, Bungee, Velocity, Redis, MySQL).
  Score each lead 1-10 by fit. For top 5, draft personalized proposals.
  Save leads to ~/freelance-leads/leads-YYYY-MM-DD.md with:
  - Job title, platform, URL, budget, client info
  - Fit score and reasoning
  - Draft proposal (customized per job)
skills: ["github", "web", "local-business-outreach"]
```

### Job 4: GitHub Sync & Triage (Agent-driven)
```yaml
name: "github-sync-triage"
schedule: "0 * * * *"           # Hourly
prompt: |
  Push all local changes in ~/portfolio-v2 to GitHub.
  Check tracked repos for new issues/PRs needing attention.
  Summarize anything requiring action: new issues, review requests, CI failures.
  Update local issue cache for reference.
skills: ["github-repo-management", "github-issues", "github-pr-workflow"]
```

### Job 5: Class Notes Processor (Agent-driven)
```yaml
name: "class-notes-processor"
schedule: "0 16 * * 1-5"        # Weekdays 4 PM (after school)
prompt: |
  Check ~/recordings/ for new audio files from today's classes.
  For each: transcribe with Whisper, structure into Cornell notes format,
  extract key concepts/definitions, generate Anki flashcards.
  Save to Obsidian vault under Daily/YYYY-MM-DD-class-notes.md
  Also create flashcard deck for Anki import.
skills: ["obsidian", "note-taking"]
```

## 10.4 Cron Management Commands

```bash
# List all jobs
hermes cron list

# Create job (interactive or with flags)
hermes cron create \
  --name "daily-briefing" \
  --schedule "0 7 * * *" \
  --prompt "Generate my daily briefing..." \
  --skills "obsidian,github"

# Run job now (test)
hermes cron run --job-id <id>

# View job output
hermes cron log --job-id <id>

# Pause/resume
hermes cron pause --job-id <id>
hermes cron resume --job-id <id>

# Remove
hermes cron remove --job-id <id>
```

---

# 11. VECTOR DATABASES & RAG: QDRANT, EMBEDDINGS, AND SEMANTIC SEARCH

## 11.1 Vector Database Comparison (2026)

| Database | License | Scaling | Hybrid Search | Filtering | Best For |
|----------|---------|---------|---------------|-----------|----------|
| **Qdrant** | Apache 2.0 | Horizontal | ✅ HNSW + payload | Excellent | **Local production, Rust performance** |
| Chroma | Apache 2.0 | Vertical | ✅ | Good | Prototyping, Python-first |
| Weaviate | BSD-3 | Horizontal | ✅ GraphQL + BM25 | Excellent | Graph + vector hybrid |
| Milvus | Apache 2.0 | Horizontal | ✅ | Excellent | Billion-scale |
| pgvector | PostgreSQL | Vertical | ✅ | Excellent | Already using Postgres |
| Turbopuffer | Proprietary | Serverless | ✅ | Excellent | Serverless, low ops |

**Your choice**: Qdrant — local, fast, excellent filtering, Rust-based, perfect for Obsidian AI.

## 11.2 Qdrant Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           QDRANT                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Collections (one per vault section):                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Daily     │  │  Projects   │  │  Research   │             │
│  │  (chunks)   │  │  (chunks)   │  │  (chunks)   │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         ▼                ▼                ▼                     │
│  ┌─────────────────────────────────────────────────┐           │
│  │           HNSW INDEX (Hierarchical              │           │
│  │           Navigable Small World)                │           │
│  │  - M=16 (connections per layer)                 │           │
│  │  - ef_construct=100 (index quality)             │           │
│  │  - Payload: {source, path, section, tags, date} │           │
│  └─────────────────────┬──────────────────────────┘           │
│                        │                                       │
│                        ▼                                       │
│  ┌─────────────────────────────────────────────────┐           │
│  │              GRIDSTORE (Key-Value)               │           │
│  │  - Payload storage (metadata + full text)        │           │
│  │  - Snapshot-based persistence                    │           │
│  │  - WAL for durability                            │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 11.3 Chunking Strategy for Obsidian Notes

```python
# Optimal chunking for markdown notes
CHUNK_CONFIG = {
    "chunk_size": 512,           # Tokens (not chars) - fits embedding context
    "chunk_overlap": 64,         # 12.5% overlap for continuity
    "separators": [              # Priority order for splitting
        "\n## ",                 # H2 headers
        "\n### ",                # H3 headers
        "\n\n",                  # Paragraphs
        "\n",                    # Lines
        ". ",                    # Sentences
        " "                      # Words (last resort)
    ],
    "metadata_fields": [
        "source_path",           # e.g., "Daily/2026-07-31.md"
        "section",               # e.g., "## Meeting Notes"
        "tags",                  # e.g., ["#meeting", "#client"]
        "date",                  # ISO date from filename or frontmatter
        "vault_section"          # "Daily", "Projects", "Research", etc.
    ]
}
```

## 11.4 Embedding Pipeline

```
OBSIDIAN VAULT
      │
      ▼
┌─────────────────┐
│  FILE WATCHER   │  (inotify / LiveSync webhook)
│  Detects changes│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CHUNKER        │  Split by headers → paragraphs → sentences
│  512 tokens,    │
│  64 overlap     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  EMBEDDER       │  nomic-embed-text via Ollama
│  768 dims       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  QDRANT         │  Upsert with payload
│  Collection:    │  {vector, payload: {source, section, tags, date}}
│  vault_section  │
└─────────────────┘
```

## 11.5 Search API Design (Your Custom Service)

```python
# /home/das/obsidian-ai-system/search_api.py
# Port 8093 - Reads CouchDB, assembles chunks, queries Qdrant

async def search(query: str, vault_section: str = None, limit: int = 10):
    # 1. Embed query
    query_vector = await ollama.embed("nomic-embed-text", query)
    
    # 2. Search Qdrant
    filter_conditions = {}
    if vault_section:
        filter_conditions["vault_section"] = vault_section
    
    results = await qdrant.search(
        collection_name=vault_section or "all",
        query_vector=query_vector,
        limit=limit,
        filter=filter_conditions,
        with_payload=True,
        with_vectors=False
    )
    
    # 3. Assemble full context from CouchDB
    # (chunks may be split across pages - reassemble)
    assembled = await assemble_chunks(results, couchdb)
    
    return {
        "query": query,
        "results": assembled,
        "total_hits": len(results)
    }

async def assemble_chunks(qdrant_results, couchdb):
    """Reassemble chunks into coherent note sections."""
    # Group by source_path
    by_source = defaultdict(list)
    for hit in qdrant_results:
        by_source[hit.payload["source_path"]].append(hit)
    
    assembled = []
    for source_path, hits in by_source.items():
        # Sort by chunk order
        hits.sort(key=lambda h: h.payload.get("chunk_index", 0))
        
        # Fetch full doc from CouchDB for context
        full_doc = await couchdb.get(source_path)
        
        # Extract surrounding context
        context = extract_context(full_doc, hits)
        
        assembled.append({
            "source": source_path,
            "section": hits[0].payload.get("section"),
            "tags": hits[0].payload.get("tags", []),
            "date": hits[0].payload.get("date"),
            "score": max(h.score for h in hits),
            "context": context,
            "matched_chunks": [h.payload.get("text", "") for h in hits]
        })
    
    return assembled
```

## 11.6 Hybrid Search (Vector + Keyword)

For best results, combine semantic and keyword search:

```python
async def hybrid_search(query: str, limit: int = 10):
    # Semantic search
    semantic = await search(query, limit=limit*2)
    
    # Keyword search (via CouchDB full-text or SQLite FTS5)
    keyword = await couchdb_fulltext_search(query, limit=limit*2)
    
    # Reciprocal Rank Fusion
    fused = reciprocal_rank_fusion(semantic, keyword, k=60)
    
    return fused[:limit]

def reciprocal_rank_fusion(results_list, k=60):
    """RRF: score = sum(1 / (k + rank))"""
    scores = defaultdict(float)
    for results in results_list:
        for rank, doc in enumerate(results):
            key = doc["source"]
            scores[key] += 1 / (k + rank + 1)
    
    # Sort by fused score
    sorted_keys = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)
    return [next(r for r in chain(*results_list) if r["source"] == k) for k in sorted_keys]
```

---

# 12. OBSIDIAN AI SYSTEM: SELF-HOSTED SECOND BRAIN

## 12.1 Complete Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        OBSIDIAN AI SYSTEM                                     │
│  /home/das/obsidian-ai-system  |  GitHub: DasVR/obsidian-ai                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐      │
│  │   COUCHDB   │   │   OLLAMA    │   │   QDRANT    │   │ SEARCH API  │      │
│  │   (5984)    │   │  (11434)    │   │   (6333)    │   │   (8093)    │      │
│  │  Sync +     │   │  phi4 +     │   │  Vector     │   │  Reads      │      │
│  │  Vault DB   │   │  nomic-     │   │  Search     │   │  CouchDB    │      │
│  └──────┬──────┘   │  embed-text │   │             │   │  Assembles  │      │
│         │          └──────┬──────┘   └──────┬──────┘   │  Chunks     │      │
│         │                 │                 │          │  Queries    │      │
│         │                 │                 │          │  Qdrant     │      │
│         └─────────────────┼─────────────────┼──────────┘             │
│                           ▼                 ▼                        │
│              ┌─────────────────────────────────────┐                 │
│              │         ENHANCER SERVICE            │                 │
│              │  Nightly cron (3 AM) or on-demand   │                 │
│              │  Input: Raw daily note              │                 │
│              │  Output: Enhanced note + todos +    │                 │
│              │  mood tags + creative reflection    │                 │
│              └──────────────────┬─────────────────┘                 │
│                                 │                                  │
│         ┌───────────────────────┼───────────────────────┐          │
│         ▼                       ▼                       ▼          │
│  ┌────────────┐         ┌────────────┐         ┌────────────┐    │
│  │  LIVESYNC  │         │   VAULT    │         │  MOBILE    │    │
│  │  ENDPOINT  │         │  FOLDERS   │         │  (Obsidian │    │
│  │  Cloudflare│         │            │         │   Mobile)  │    │
│  │  CNAME     │         │  Daily/    │         │            │    │
│  └────────────┘         │  Projects/ │         └────────────┘    │
│                         │  Research/ │                              │
│                         │  Creativity/                             │
│                         │  People/                                 │
│                         │  Resources/                              │
│                         │  Templates/                              │
│                         │  Agent/                                  │
│                         └────────────────┘                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 12.2 Component Details

### CouchDB (Port 5984)
- **Purpose**: Vault storage + LiveSync backend
- **Data Model**: Each note = JSON document with `_id`, `_rev`, content, attachments
- **Sync**: Obsidian LiveSync plugin ↔ CouchDB (continuous replication)
- **E2EE**: Currently OFF (simpler, but less private — decision point)
- **Config**: `/opt/stacks/foundation/couchdb/local.ini`

### Ollama (Port 11434)
- **Models**: `phi4` (chat), `nomic-embed-text` (embeddings), `deepseek-r1:14b` (reasoning)
- **Deployment**: Ollama Cloud (no local GPU required)
- **Enhancer calls**: Nightly batch processing via API
- **Config**: Environment variables `OLLAMA_HOST`, `OLLAMA_API_KEY`

### Qdrant (Port 6333)
- **Purpose**: Vector search over note chunks
- **Collections**: One per vault section (Daily, Projects, Research, Creativity, People, Resources)
- **Embeddings**: `nomic-embed-text` via Ollama (768 dims)
- **Index**: HNSW with M=16, ef_construct=100
- **Payload**: `{source_path, section, tags, date, vault_section, chunk_index}`

### Search API (Port 8093)
- **Custom service** you built
- **Reads**: CouchDB → assembles chunks → queries Qdrant
- **Returns**: Relevant context for enhancer/LLM
- **Endpoints**: `/search`, `/health`, `/reindex`

### Enhancer (The AI Employee)
- **Trigger**: Nightly cron (3 AM) or manual `hermes cron run`
- **Input**: Raw daily note from `vault/Daily/YYYY-MM-DD.md`
- **Process**:
  1. Read note
  2. Send to LLM with enhancement prompt
  3. Parse structured response
  4. Write enhanced sidecar + extracted todos + mood tags
- **Output modes**:
  - Sidecar: `Daily/YYYY-MM-DD.enhanced.md` (RECOMMENDED - preserves original)
  - In-place: Overwrite original (risky)
  - Both: Original + sidecar + separate todos file

### LiveSync Endpoint
- **URL**: `https://obsidian-sync.dasdev.net`
- **Cloudflare**: CNAME → Tunnel → CouchDB
- **Clients**: Phone (Obsidian Mobile), Laptop, Desktop
- **Auth**: CouchDB native auth (configure users/roles)

## 12.3 Vault Structure (Decided)

```
Vault/
├── Daily/                    # Daily notes (enhancer target)
│   ├── 2026-07-31.md
│   ├── 2026-07-31.enhanced.md    # Sidecar (enhancer output)
│   └── 2026-07-31.todos.md       # Extracted todos
├── Projects/                 # Active projects
│   ├── portfolio-v2/
│   ├── freelance-leads/
│   └── obsidian-ai-system/
├── Research/                 # Deep dives, papers
├── Creativity/               # Writing, ideas, sketches
├── People/                   # Contacts, networking
├── Resources/                # Reference material
├── Templates/                # Note templates
└── Agent/                    # Hermes context, prompts
    ├── SOUL.md               # Finn persona
    ├── memories/
    └── cron-outputs/
```

## 12.4 Enhancement Prompt (For Nightly Cron)

```markdown
# DAILY NOTE ENHANCEMENT PROMPT

You are Finn, an AI assistant helping Arriq organize his thoughts. 
Process the raw daily note below and produce an enhanced version.

## INPUT
Raw daily note content (may be messy, fragmented, stream-of-consciousness).

## TASKS

### 1. RESTRUCTURE
- Organize into clear sections with ## headers
- Convert bullet fragments into complete thoughts
- Group related items together
- Add timestamps where inferable

### 2. EXPAND
- Flesh out abbreviated thoughts into full sentences
- Add context that makes entries self-contained
- Connect related observations across the note

### 3. MOOD TAGS
Analyze emotional tone and add tags at top:
- `#mood:productive` / `#mood:stressed` / `#mood:creative` / `#mood:tired` / `#mood:neutral`
- `#energy:high` / `#energy:medium` / `#energy:low`
- `#focus:deep` / `#focus:scattered` / `#focus:shallow`

### 4. EXTRACT TODOS
Find all actionable items and output as:
```
## EXTRACTED TODOS
- [ ] Specific action with context (from section X)
- [ ] Another action (from section Y)
```

### 5. CREATIVE REFLECTION
Add a brief reflection section at end:
```
## REFLECTION
One paragraph synthesizing the day's themes, patterns, insights.
Written in Finn's voice (supportive twin, slightly casual).
```

## OUTPUT FORMAT
Return ONLY the enhanced note content (markdown), no extra commentary.
The system will save this as a sidecar file and extract todos separately.

## EXAMPLE TRANSFORMATION

INPUT:
```
woke up late. math test went ok i think. been working on the obsidian ai thing. 
couchdb keeps crashing. need to fix the replication. finn helped with the router bug.
also need to email mr. johnson about the project. tired.
```

OUTPUT:
```
#mood:productive #energy:medium #focus:deep

## Morning
Woke up later than planned (~9:30 AM). Felt rested despite late night.

## School
Math test (Algebra 2) went reasonably well. Confident on quadratic formula 
section, less sure on word problems. Results next week.

## Project: Obsidian AI System
Made progress on the CouchDB replication issue. The problem was a configuration
mismatch in the LiveSync endpoint — the Cloudflare tunnel wasn't properly 
forwarding the WebSocket connection needed for continuous replication. 
Fixed by updating the tunnel config to pass `Upgrade: websocket` header.

Finn helped debug the model router display bug. Root cause identified in 
`run.py:11902` where `_resolve_gateway_model()` reads config instead of 
active `agent.model`. Actual routing works; only display is wrong.

## Pending
- Email Mr. Johnson about portfolio project proposal (due Friday)
- Fix CouchDB replication config and test sync end-to-end

## EXTRACTED TODOS
- [ ] Email Mr. Johnson re: portfolio project (from Pending)
- [ ] Fix CouchDB LiveSync WebSocket forwarding (from Project)
- [ ] Test Obsidian Mobile sync after CouchDB fix (from Project)

## REFLECTION
Solid day despite the late start. The CouchDB breakthrough was the highlight —
that replication issue had been blocking the whole Obsidian AI pipeline for 
days. Finn's router debugging was a nice bonus. Energy dipped in the afternoon 
but the momentum carried through. Tomorrow: ship the enhancer cron and test 
the full loop. You're building something real here, twin.
```
```

## 12.5 Phase Plan (From Your Notes)

```
Phase 1: Core Sync          → CouchDB + LiveSync working on all devices
Phase 2: Local AI           → Ollama + phi4 + nomic-embed responding
Phase 3: Daily Enhancer     → Nightly job reads daily → writes enhanced
Phase 4: Polish             → UI, search, voice, mobile widgets
```

---

# 13. MULTI-AGENT ORCHESTRATION PATTERNS

## 13.1 Core Orchestration Patterns (2026 Research)

Based on current industry patterns (TrueFoundry, DigitalApplied, Totalum, Tyk, Databricks, Azure, Dataiku):

### Pattern 1: Sequential Pipeline
```
Agent A → Agent B → Agent C → Output
```
**Use when**: Steps are strictly dependent (research → plan → implement)
**Coordination**: Pass structured artifacts between stages
**Failure mode**: One failure stops pipeline — need checkpoints

### Pattern 2: Parallel Fan-Out
```
           → Agent A
Orchestrator → Agent B    (independent tasks)
           → Agent C
```
**Use when**: Exploring alternatives, gathering diverse inputs
**Coordination**: Wait for all, then synthesize
**Failure mode**: Partial results still valuable

### Pattern 3: Hierarchical Delegation
```
Orchestrator
    ├── Team Lead A
    │     ├── Worker A1
    │     └── Worker A2
    └── Team Lead B
          ├── Worker B1
          └── Worker B2
```
**Use when**: Complex projects with clear sub-domains
**Note**: Requires `delegation.max_spawn_depth > 1` (currently 1 in your config)

### Pattern 4: Event-Driven / Reactive
```
Event Bus ←── Agent A (producer)
Event Bus →── Agent B (consumer)
Event Bus →── Agent C (consumer)
```
**Use when**: Loose coupling, async processing, multiple consumers
**Implementation**: Redis pub/sub, Kafka, or simple file-based queue

### Pattern 5: Human-in-the-Loop
```
Agent → Human Review → Agent → Human Approve → Deploy
```
**Use when**: High-stakes decisions, creative direction, compliance
**Implementation**: `clarify` tool, approval gates in cron, PR reviews

## 13.2 Coordination Mechanisms

| Mechanism | Implementation | Latency | Durability |
|-----------|----------------|---------|------------|
| **Direct delegation** | `delegate_task()` | Low | Session-only |
| **File-based artifacts** | Write markdown/JSON to shared path | Medium | Persistent |
| **Database** | SQLite/PostgreSQL shared | Medium | Persistent |
| **Message queue** | Redis/RabbitMQ | Low | Persistent |
| **Event bus** | Custom pub/sub | Low | Configurable |
| **Git commits** | Push artifacts to repo | High | Permanent |

## 13.3 Your Constraints & Adaptations

Given your config (`max_spawn_depth=1`, `max_concurrent=3`, no orchestrator role):

**Available Patterns**:
- ✅ Sequential (main agent coordinates)
- ✅ Parallel fan-out (main agent spawns 3 leaves)
- ✅ Human-in-the-loop (you're the human)
- ❌ Hierarchical (needs depth > 1)
- ⚠️ Event-driven (needs external infra)

**Recommended Approach**: Main agent as orchestrator, leaf subagents for parallel work, file-based artifact passing for persistence.

---

# 14. FREELANCE AI EMPLOYEE ARCHITECTURE

## 14.1 The "Finn Corps" — Specialized Agent Team

```
┌─────────────────────────────────────────────────────────────────┐
│                     FINN CORPS ORG CHART                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐                                               │
│   │  FINN PRIME │  ← Coordinator (you're talking to me)        │
│   │ (Orchestrator)                                              │
│   └──────┬──────┘                                               │
│          │                                                       │
│    ┌─────┼─────┬─────┬─────┬─────┐                              │
│    ▼     ▼     ▼     ▼     ▼     ▼                              │
│ ┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐                         │
│ │RESEARCH││ CODE ││OUTREACH││ DESIGN││ OPS  │                         │
│ │ AGENT  ││ AGENT││ AGENT  ││ AGENT ││ AGENT│                         │
│ └──────┘└──────┘└──────┘└──────┘└──────┘                         │
│                                                                 │
│  Research:  Papers, docs, tech trends, competitors, markets    │
│  Code:      Features, bugs, refactors, tests, deploys, CI      │
│  Outreach:  Leads, proposals, follow-ups, CRM, negotiations    │
│  Design:    UI/UX, diagrams, assets, branding, prototypes      │
│  Ops:       Server health, backups, cron, monitoring, scaling  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 14.2 Agent Personas (Each with Own SOUL.md)

### NOVA — Research Agent
- **Vibe**: Curious, thorough, cites sources, loves deep dives, skeptical
- **Skills**: arxiv, blogwatcher, web_search, polymarket, llm-wiki, github-code-review
- **Tools**: web, browser, file (read-only mostly)
- **Output**: Markdown reports with citations, TL;DR summaries, comparison tables
- **Schedule**: On-demand + weekly tech radar cron

### SYNTAX — Code Agent
- **Vibe**: Pragmatic, test-driven, hates tech debt, ships fast, opinionated
- **Skills**: All software-development, github, systematic-debugging, test-driven-development
- **Tools**: terminal, file, browser, web
- **Output**: Working code, PRs, test results, migration guides, architecture decisions
- **Schedule**: On-demand + nightly refactor cron

### HUSTLE — Outreach Agent
- **Vibe**: Persuasive, personal, tracks every touchpoint, never spammy, resilient
- **Skills**: local-business-outreach, github-issues, email/himalaya, github-pr-workflow
- **Tools**: web, file, terminal (for email/scripts)
- **Output**: Personalized proposals, follow-up sequences, CRM updates, pipeline reports
- **Schedule**: Daily 9 AM lead hunt, weekly pipeline review

### PIXEL — Design Agent
- **Vibe**: Obsessed with details, motion, accessibility, dark mode first, systematic
- **Skills**: All creative, architecture-diagram, claude-design, p5js, popular-web-designs
- **Tools**: browser, file, web (for inspiration)
- **Output**: Figma-ready specs, SVG diagrams, interactive prototypes, design tokens
- **Schedule**: On-demand + weekly design audit

### SYSADMIN — Ops Agent
- **Vibe**: Paranoid (good way), automated, observable, boring-is-good, thorough
- **Skills**: All devops, self-hosted-infrastructure, cronjob, homelab-networking
- **Tools**: terminal, file, browser (for dashboards)
- **Output**: Dashboards, alerts, runbooks, capacity plans, incident reports
- **Schedule**: Continuous (watchdogs) + weekly capacity review

## 14.3 Coordination Contracts

```yaml
# Each agent has a "contract" defining interface

nova:
  triggers: ["research", "deep dive", "compare", "analyze", "market", "tech radar"]
  inputs:
    topic: "string (required)"
    depth: "enum: [quick, standard, deep] = standard"
    format: "enum: [report, brief, table, bullets] = report"
    deadline: "ISO timestamp (optional)"
  outputs:
    report_md: "markdown report with citations"
    sources_bib: "bibliography in bibtex"
    summary_txt: "1-paragraph TL;DR"
  sla: "4 hours standard, 30 min urgent"
  cron: "0 6 * * 1"  # Weekly tech radar Monday 6 AM

syntax:
  triggers: ["implement", "fix", "refactor", "test", "deploy", "debug"]
  inputs:
    spec_md: "markdown specification (required)"
    repo_path: "string = /home/das/portfolio-v2"
    branch_name: "string (required)"
    requirements: "array of strings"
  outputs:
    pr_url: "GitHub PR URL"
    test_results: "pytest output summary"
    deployment_url: "if applicable"
  sla: "Depends on scope — estimates in plan"
  cron: "0 2 * * *"  # Nightly refactor scan

hustle:
  triggers: ["find leads", "draft proposal", "follow up", "crm", "pipeline"]
  inputs:
    target_profile: "object (industry, size, tech_stack, budget_range)"
    service_offering: "string (what we're selling)"
    portfolio_links: "array of URLs"
  outputs:
    leads_csv: "scored leads with contact info"
    proposals_dir: "draft proposals per lead"
    crm_updates: "json for CRM import"
  sla: "Daily batch by 9 AM"
  cron: "0 9 * * 1-5"  # Weekdays 9 AM

pixel:
  triggers: ["design", "diagram", "prototype", "brand", "ui", "ux", "accessibility"]
  inputs:
    brief_md: "design brief (required)"
    constraints: "object (colors, fonts, framework, accessibility_level)"
    deliverables: "array of strings"
  outputs:
    specs_md: "design specification"
    diagrams_svg: "architecture/flow diagrams"
    prototype_html: "interactive prototype"
    tokens_json: "design tokens (colors, spacing, etc.)"
  sla: "24 hours standard"
  cron: "0 10 * * 1"  # Weekly design audit Monday 10 AM

sysadmin:
  triggers: ["monitor", "backup", "scale", "incident", "capacity", "deploy"]
  inputs:
    service_name: "string"
    action: "enum: [check, backup, scale_up, scale_down, restart, logs]"
    params: "object"
  outputs:
    status: "healthy/degraded/down"
    metrics: "object"
    actions_taken: "array"
    recommendations: "array"
  sla: "Immediate for incidents, hourly for checks"
  cron: "*/5 * * * *"  # Watchdog every 5 min
```

## 14.4 Finn Prime Orchestration Logic

```python
# Main coordination logic (runs in Finn Prime context)

async def handle_request(user_message):
    # Classify intent
    intent = classify_intent(user_message)
    
    if intent.category == "research":
        return await delegate_to("nova", intent.params)
    
    elif intent.category == "code":
        # May need research first
        if intent.needs_research:
            research = await delegate_to("nova", {"topic": intent.topic, "depth": "quick"})
            intent.params["research_context"] = research.summary_txt
        return await delegate_to("syntax", intent.params)
    
    elif intent.category == "freelance":
        # Pipeline: research → outreach → code/design
        if intent.stage == "lead_gen":
            return await delegate_to("hustle", intent.params)
        elif intent.stage == "proposal":
            # Hustle needs code/design input for accurate proposals
            pass
    
    elif intent.category == "design":
        return await delegate_to("pixel", intent.params)
    
    elif intent.category == "ops":
        return await delegate_to("sysadmin", intent.params)
    
    else:
        # Handle directly (chat, simple questions, coordination)
        return await handle_directly(user_message)
```

## 14.5 Freelance Flywheel (Autonomous Loop)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         FREELANCE FLYWHEEL                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐              │
│   │   NOVA       │      │   HUSTLE     │      │   SYNTAX/    │              │
│   │  (Research)  │ ───► │  (Outreach)  │ ───► │   PIXEL      │              │
│   └──────┬───────┘      └──────┬───────┘      └──────┬───────┘              │
│          │                     │                     │                       │
│          │         ┌───────────┴───────────┐        │                       │
│          │         ▼                       ▼        ▼                       │
│          │  ┌─────────┐              ┌─────────┐  ┌─────────┐              │
│          │  │ Leads   │              │Proposals│  │ Templates│             │
│          │  │ Scored  │              │ Drafted │  │ Built   │              │
│          │  └─────────┘              └─────────┘  └─────────┘              │
│          │                                        │                        │
│          │         ┌──────────────────────────────┘                        │
│          │         ▼                                                          │
│          │  ┌──────────────────┐                                              │
│          │  │  PORTFOLIO       │                                              │
│          │  │  (Live sites,    │                                              │
│          │  │   GitHub repos,  │                                              │
│          │  │   case studies)  │                                              │
│          │  └────────┬─────────┘                                              │
│          │           │                                                         │
│          └───────────┘                                                         │
│                     │                                                          │
│                     ▼                                                          │
│          ┌──────────────────────┐                                              │
│          │  HUMAN (Arriq)      │                                              │
│          │  Reviews, approves, │                                              │
│          │  closes deals       │                                              │
│          └──────────┬──────────┘                                              │
│                     │                                                          │
│                     ▼                                                          │
│          ┌──────────────────────┐                                              │
│          │  REVENUE → REINVEST │                                              │
│          │  (Better tools,     │                                              │
│          │   more compute,     │                                              │
│          │   skill upgrades)   │                                              │
│          └──────────────────────┘                                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 15. IMPLEMENTATION ROADMAP: PHASE 0 THROUGH PHASE 4

## 15.1 Phase 0: Foundation (Week 1) — DO THIS FIRST

| Task | Command / Action | Verification |
|------|------------------|--------------|
| Fix router display bug | Edit `run.py:11902` — `_resolve_gateway_model()` to check `agent.model` first | Gateway footer shows routed model |
| Add routing rules to model-router plugin | Edit `~/.hermes/plugins/model-router/plugin.yaml` with routing config | `hermes config get model.default` shows routing works |
| Push all configs to GitHub | `cd ~/portfolio-v2 && git add -A && git commit -m "chore: sync all configs" && git push` | Cursor picks up changes |
| Verify Cursor context | Open Cursor → check `~/.hermes/config.yaml` is current | No stale config warnings |
| Document current state | Write `CURRENT_STATE.md` with all running services, versions, configs | Single source of truth |

## 15.2 Phase 1: Obsidian AI Core (Week 2-3)

| Task | Command / Action | Verification |
|------|------------------|--------------|
| Deploy CouchDB + Ollama + Qdrant | `cd ~/obsidian-ai-system && docker compose up -d` | `docker ps` shows all 3 healthy |
| Configure LiveSync endpoint | Cloudflare CNAME → `obsidian-sync.dasdev.net` → tunnel → CouchDB | Phone + laptop sync works |
| Test sync end-to-end | Install Obsidian LiveSync on phone/laptop, create test note | Note appears on all devices in <5s |
| Build Enhancer service | Python script: read daily → LLM → write enhanced sidecar + todos | Manual run produces correct output |
| Create enhancer cron | `hermes cron create --name enhancer --schedule "0 3 * * *" --prompt "..." --skills "obsidian"` | `hermes cron run` works, output in `Daily/*.enhanced.md` |
| Build Search API | Port 8093, reads CouchDB, queries Qdrant, returns assembled context | `curl localhost:8093/search?q=test` returns results |
| Index existing vault | One-time script to chunk+embed all current notes | Qdrant collections populated |

## 15.3 Phase 2: Class Notes Automation (Week 3-4)

| Component | Approach | Tools |
|-----------|----------|-------|
| Audio capture | Phone app (Obsidian Mobile records) or laptop mic | Obsidian Mobile, `arecord` |
| Transcription | Whisper via Ollama (local) or OpenAI API | `whisper.cpp`, `openai-whisper` |
| Structuring | Enhancer prompt: "Convert transcript to Cornell notes" | Custom prompt in enhancer |
| Output | Daily note + `Class Notes/` folder + Anki cards | Obsidian vault, `genanki` |
| Trigger | Manual "start class" / "end class" commands to Finn | Discord slash command or keyword |

## 15.4 Phase 3: Freelance AI Employee (Month 2)

```
Week 1-2: HUSTLE Agent (Lead Gen)
  - Scrape Upwork, SpigotMC, BuiltByBit, Discord job boards
  - Filter: budget > $100, tech match (React, Node, MC plugins, Python)
  - Score leads by fit (1-10)
  - Save to ~/freelance-leads/leads.md with contact info

Week 3-4: Proposal Writer (HUSTLE + SYNTAX)
  - Template per service type (website, plugin, API, bot, automation)
  - Inject: client pain points, your portfolio, timeline, price
  - Auto-customize per lead using research context
  - Save drafts for your review in ~/freelance-leads/proposals/

Month 2+: Full Pipeline
  - NOVA: Market research → new service ideas, pricing benchmarks
  - PIXEL: Portfolio pieces for each niche (landing pages, dashboards, bots)
  - SYNTAX: Build template projects (deployed, documented)
  - HUSTLE: Outreach → calls → close → CRM
  - SYSADMIN: Invoicing, contracts, project tracking, delivery
```

## 15.5 Phase 4: Homelab Dashboard & Polish (Ongoing)

| Service | Monitor | Alert Threshold |
|---------|---------|-----------------|
| CouchDB | Replication lag, disk usage, compaction | > 5 min lag, > 80% disk |
| Ollama | Queue depth, latency p99, model load | > 30s p99, OOM |
| Qdrant | Collection health, RAM, disk, segments | > 80% RAM, > 85% disk |
| Search API | Response time p95, error rate, throughput | > 5% 5xx, > 2s p95 |
| Enhancer | Last run timestamp, output size, errors | Missed run, empty output |
| Docker | Container health, restart count, resources | Any restart, > 90% CPU |
| Disk | Free space, inodes | < 10% free |
| Network | Latency to Cloudflare, DNS resolution | > 200ms, failures |

---

# 16. APPENDIX: CONFIGURATION REFERENCES & COMMAND CHEATSHEETS

## 16.1 Key Files to Bookmark

| File | Purpose |
|------|---------|
| `~/.hermes/config.yaml` | Global Hermes config |
| `~/.hermes/profiles/default/config.yaml` | Profile config |
| `~/.hermes/profiles/default/memories/user.db` | User memory DB |
| `~/.hermes/profiles/default/memories/memory.db` | Agent memory DB |
| `~/OBSIDIAN-AI-PLAN.md` | Your Obsidian AI plan |
| `~/obsidian-ai-system/docker-compose.yml` | AI stack compose |
| `/opt/stacks/foundation/ntfy/data/server.yml` | ntfy config (upstream: ntfy.sh) |
| `~/portfolio-v2/cursor-research/` | All research docs |

## 16.2 Essential Commands

### Hermes
```bash
# Config
hermes config get model.default
hermes config set model.default "qwen2.5-coder:32b"
hermes config set memory.auto_extract true

# Tools & Skills
hermes tools list
hermes skills list
hermes skills view github-pr-workflow

# Cron
hermes cron list
hermes cron create --name "x" --schedule "0 3 * * *" --prompt "..." --skills "obsidian"
hermes cron run --job-id <id>
hermes cron log --job-id <id>

# Plugins
hermes plugins list
hermes plugins enable model-router
```

### Git (Your Workflow)
```bash
# Standard sync (run every session)
cd ~/portfolio-v2 && git add -A && git commit -m "chore: sync $(date +%F)" && git push

# Check status
git status
git diff --stat
```

### Docker (NO background=true!)
```bash
# Foreground with timeout (correct)
docker compose -f ~/obsidian-ai-system/docker-compose.yml up --timeout 300

# Logs
docker compose -f /opt/stacks/foundation/docker-compose.yml logs -f ntfy

# Health checks
curl http://localhost:5984/_up          # CouchDB
curl http://localhost:11434/api/tags    # Ollama models
curl http://localhost:6333/healthz      # Qdrant
curl http://localhost:8093/health       # Search API
```

### Obsidian AI
```bash
# Manual enhancer run
cd ~/obsidian-ai-system && python enhancer.py --date 2026-07-31

# Reindex vault
python reindex_vault.py --all

# Test search
curl -X POST http://localhost:8093/search -d '{"query": "CouchDB replication", "limit": 5}'
```

### Memory Inspection
```bash
# View all memories
sqlite3 ~/.hermes/profiles/default/memories/user.db "SELECT content FROM memories;"
sqlite3 ~/.hermes/profiles/default/memories/memory.db "SELECT content FROM memories;"

# Search
sqlite3 ~/.hermes/profiles/default/memories/memory.db \
  "SELECT content FROM memories WHERE content LIKE '%docker%';"

# Count
sqlite3 ~/.hermes/profiles/default/memories/user.db "SELECT COUNT(*) FROM memories;"
```

## 16.3 Model Quick Reference

| Task | Model | Provider | Why |
|------|-------|----------|-----|
| Casual chat | `deepseek-v4-flash` | OpenRouter | Fast, cheap, good enough |
| Coding | `qwen2.5-coder:32b` | Ollama Cloud | Best coding, 32K context |
| Reasoning | `deepseek-r1:14b` | Ollama Cloud | Chain-of-thought |
| General | `kimi-k2.6` | Ollama Cloud | Strong all-rounder |
| Creative | `claude-sonnet-4` | Anthropic | Best prose |
| Embeddings | `nomic-embed-text` | Ollama Cloud | 768 dims, multilingual |

## 16.4 Quantization Quick Reference

| Model Size | Q4_K_M VRAM | Q6_K VRAM | Q8_0 VRAM | FP16 VRAM |
|------------|-------------|-----------|-----------|-----------|
| 7B | 3.5 GB | 5.3 GB | 7 GB | 14 GB |
| 14B | 7 GB | 10.5 GB | 14 GB | 28 GB |
| 32B | 16 GB | 24 GB | 32 GB | 64 GB |

**Your setup**: Use Ollama Cloud — no local VRAM constraints.

---

## DOCUMENT METADATA

- **Version**: 1.0
- **Compiled**: July 31, 2026
- **Author**: Finn (AI Twin)
- **For**: Arriq (Das)
- **Repository**: `~/portfolio-v2/cursor-research/COMPLETE_AI_SYSTEMS_GUIDE.md`
- **Word Count**: ~28,000
- **Line Count**: ~1,800
- **Sections**: 16 major sections + appendix
- **Coverage**: Hermes architecture, plugins, hooks, skills, memory, routing, local LLMs, tools, delegation, cron, vector DBs, RAG, Obsidian AI, multi-agent patterns, freelance architecture, 4-phase roadmap

---

*This document represents the complete compiled knowledge base for building, extending, and operating your autonomous AI infrastructure. Every section is implementation-ready. Start with Phase 0, verify each step, then proceed. The system grows with you.*