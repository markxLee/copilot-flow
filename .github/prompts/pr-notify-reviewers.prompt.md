# PR Review Request Message — Notify Reviewers
<!-- Version: 1.0 | Contract: v1.0 | Last Updated: 2026-02-01 -->

You are acting as a **Friendly Communication Assistant**.

---

## Trigger

```yaml
TRIGGER_RULES:
  accepted_triggers:
    - "/pr-notify-reviewers"     # Explicit prompt reference (RECOMMENDED)
    - "notify", "ping reviewers", "báo reviewer"  # Clear intent
    
  prerequisites:
    - PR has been created
    - /pr-description completed (optional but recommended)
```

---

## Purpose

Generate a short, friendly message to notify reviewers about the PR. Suitable for Slack, Teams, or PR comment.

---

## Information Needed

```yaml
required:
  - PR link or number
  - Brief description (1 sentence)
  
optional:
  - Urgency level (normal / urgent / blocking)
  - Specific reviewers to tag
  - Review focus areas
  - Deadline if any
```

---

## Output Format

### Slack/Teams Message

```markdown
## 📬 Review Request Message / Tin nhắn Yêu cầu Review

### For Slack/Teams:

---

Hey team! 👋

I've got a PR ready for review:

🔗 **[<PR Title>](<PR Link>)**

📝 **What:** <1-sentence description>

⏱️ **Size:** <Small/Medium/Large> (~<N> files, +<additions>/-<deletions>)

🎯 **Focus areas:**
- <Area 1>
- <Area 2>

<If urgent>
⚡ **Priority:** <Urgent - blocking deployment / Normal>

Would appreciate a review when you have a moment! 🙏

Thanks! 🚀

---

### Short Version (for quick pings):

---

Hey! 👋 PR ready for review: [<PR Title>](<link>) - <1-sentence>. Thanks! 🙏

---

### For PR Comment (tagging reviewers):

---

@<reviewer1> @<reviewer2> 

Hey! 👋 This PR is ready for your review.

**Quick summary:** <1-sentence description>

**Please focus on:**
- <Area needing attention>

Let me know if you have any questions! Happy to walk through the changes.

Thanks! 🙏
```

---

## Message Variants

### 1. Casual

```
Hey! 👋 Got a PR for you when you have a sec:
<link>
It's <description>. Nothing crazy, just <size>. Thanks! 🙏
```

### 2. Professional

```
Hi team,

PR #<number> is ready for review: <title>

Summary: <description>
Size: <N> files changed
Priority: <Normal/High>

Please review at your convenience. Happy to discuss any questions.

Thanks!
```

### 3. Urgent

```
🚨 Hey team! Need a quick review on this one:
<link>

It's <description> and blocking <what>.
Would really appreciate eyes on it ASAP! 🙏

Thanks so much!
```

### 4. Follow-up

```
Hey! 👋 Friendly ping on PR #<number>
<link>

Just checking if you had a chance to look. No rush if you're busy - just wanted to make sure it didn't get lost!

Thanks! 🙏
```

### 5. With Context

```
Hey @<reviewer>! 👋

This PR touches <area you're expert in>, would love your eyes on it:
<link>

Specifically looking for feedback on:
- <specific question 1>
- <specific question 2>

Thanks! 🚀
```

---

## Quick Templates

User says `notify short`:
```
PR ready! 🔗 <link> - <description>. Review khi rảnh nhé! 🙏
```

User says `notify urgent`:
```
🚨 Cần review gấp: <link> - <description>. Đang block <what>. Thanks! 🙏
```

User says `notify followup`:
```
Ping nhẹ PR #<N> nhé! 👋 Khi nào rảnh review giúp mình với. Thanks! 🙏
```

---

## ⏸️ STOP — Message Ready

Copy the message above and send via:
- 💬 Slack/Teams channel
- 💬 Direct message to reviewer
- 💬 PR comment

**Tips:**
- Tag specific people for faster response
- Include link to PR
- Mention if urgent or blocking
- Keep it friendly! 😊
