# 3. Linux & File Sharing 🟡 Should-know

*Where this comes from in your work: Samba file server on Ubuntu (Portfolio III), Kali Linux in your Nessus lab (Portfolio VII), Docker deployments (Mayan EDMS, Ghost).*

## Why interviewers ask this

Most help desk roles are Windows-heavy, but mentioning Linux comfort is a real differentiator
— a lot of entry-level candidates have never touched a terminal outside of a class. You have.

## The concepts, in plain English

### Basic navigation you should be able to do blind

| Command | What it does |
|---|---|
| `pwd` | Print working directory (where am I?) |
| `ls -la` | List files, including hidden ones, with permissions |
| `cd /path` | Change directory |
| `sudo` | Run a command as administrator ("superuser") |
| `chmod 755 file` | Change file permissions |
| `chown user:group file` | Change file owner |
| `systemctl status servicename` | Check if a service (like Samba or Nginx) is running |
| `ping`, `traceroute` | Basic connectivity troubleshooting |

### Linux file permissions (comes up constantly)
Every file has three permission sets: **owner**, **group**, **everyone else** — each with
Read (4), Write (2), Execute (1). `755` = owner gets 7 (rwx), group and everyone else get 5
(r-x). This is the exact model you locked down on your Samba server.

**Interview one-liner:** *"Linux permissions are owner/group/other, each with read-write-execute
— `chmod` sets those, `chown` sets who owns the file."*

### Samba — Windows/Linux file sharing bridge
Samba lets a Linux server share folders that Windows machines can map as a normal network
drive (`\\server\share`), using the SMB protocol Windows already speaks natively. You deployed
this specifically to let Windows and Linux machines share files with locked-down permissions.

**Interview one-liner:** *"Samba makes a Linux file server show up as a normal shared drive on
Windows — it speaks SMB so Windows doesn't need anything special to connect."*

### Docker (containers) — from Mayan EDMS and Ghost
A container packages an application with everything it needs to run, isolated from the host
system, so it behaves the same everywhere. Instead of manually installing a document
management system and all its dependencies, you run one `docker` command and it's up.

**Interview one-liner:** *"Docker containers are like a shipping container for software — the
app and everything it needs travels together, so it runs the same on any machine."*

## Add your screenshot here

- [ ] Terminal output of `ls -la` on your Samba share showing permissions
- [ ] `docker ps` output showing Mayan EDMS / Ghost containers running

## STAR story: Samba file server

> **Situation:** Needed Windows and Linux machines to share files with proper access control,
> not an open free-for-all folder.
> **Task:** Deploy and secure a cross-platform file server.
> **Action:** Installed Samba on Ubuntu, configured shares, and locked down permissions
> per-user so only the right people could read/write specific folders.
> **Result:** A working, secured file share reachable identically from Windows and Linux — the
> same "why can't I access the shared drive" scenario a help desk ticket would cover, except
> I built the access control from scratch instead of just resetting it.

## Quick self-check

- [ ] Can I read a `chmod` number (e.g., 644) and say what it means?
- [ ] Can I explain what Samba does to someone who's never heard of it?
- [ ] Can I explain a container vs. a virtual machine at a high level? *(A VM virtualizes a
  whole OS; a container shares the host OS kernel and just isolates the app — much lighter.)*

**Next:** [4. Security Fundamentals →](04-security-fundamentals.md)
