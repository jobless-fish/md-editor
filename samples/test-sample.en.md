# Test document

Paste this into the code pane to check that it shows up as-is in the editor on the left. It contains **bold**, *italic*, ~~strikethrough~~, `inline code`, and a [link](https://github.com).

<p align="center">A centered paragraph.</p>

## Lists

- First bullet
- Second bullet
  - Nested item

1. Number one
2. Number two

- [x] Done
- [ ] To do

## Table

| Name | Qty | Price |
| :--- | :---: | ---: |
| Apple | 3 | 1,500 |
| Pear | 1 | 2,000 |

## Alerts

> [!NOTE]
> Something worth knowing.

> [!WARNING]
> Something to watch out for.

## Collapsible section

<details>
<summary>Click to expand</summary>

This content was folded away.

```bash
npm install
```

</details>

---

## Flowchart

```mermaid
flowchart TB
    A(["Start"]) --> B{"Signed in?"}
    B -->|"Yes"| C["Dashboard"]
    B -->|"No"| D["Sign-in page"]
    D --> B
```

## Git graph

```mermaid
%%{init: {"themeVariables": {"git1":"#dc2626","gitBranchLabel1":"#ffffff"}}}%%
gitGraph
    commit id: "init"
    branch develop
    commit id: "login"
    commit id: "payment"
    checkout main
    commit id: "docs"
    merge develop id: "v1.0" tag: "v1.0"
```

## Sequence (code only)

```mermaid
sequenceDiagram
    User->>Server: Sign-in request
    Server-->>User: Issue token
```

> A block quote.
