# 12. Cheat Sheets 🔵 Reference

Print this chapter or keep it open in a tab the morning of an interview.

## OSI model + common ports

![OSI model and common ports](C:/Users/Jacob/.cursor/projects/c-Users-Jacob-Documents-MyRobloxGame-secplus-sensei/assets/osi-model-ports-cheatsheet.png)

## Common ports, alphabetical by use

| Port | Protocol | Use |
|---|---|---|
| 20/21 | FTP | File transfer (unencrypted) |
| 22 | SSH / SFTP | Secure remote access / secure file transfer |
| 23 | Telnet | Remote access (unencrypted, considered insecure) |
| 25 | SMTP | Sending email |
| 53 | DNS | Name resolution |
| 67/68 | DHCP | Automatic IP assignment |
| 80 | HTTP | Unencrypted web |
| 110 | POP3 | Email retrieval (older) |
| 143 | IMAP | Email retrieval (modern) |
| 443 | HTTPS | Encrypted web |
| 445 | SMB | Windows/Samba file sharing |
| 587 | SMTP (submission) | Sending email, modern/authenticated |
| 3389 | RDP | Remote Desktop |

## The 6-step troubleshooting method (memorize this order)

![Troubleshooting flowchart](C:/Users/Jacob/.cursor/projects/c-Users-Jacob-Documents-MyRobloxGame-secplus-sensei/assets/troubleshooting-methodology-flowchart.png)

1. Identify the problem
2. Establish a theory of probable cause
3. Test the theory
4. Establish a plan & implement
5. Verify full functionality
6. Document

## Windows command-line quick reference

| Command | Use |
|---|---|
| `ipconfig /all` | Show full network config |
| `ipconfig /release` + `/renew` | Force a new DHCP lease |
| `ipconfig /flushdns` | Clear DNS cache |
| `ping <host>` | Test basic connectivity |
| `tracert <host>` | See the path/hops to a host |
| `nslookup <host>` | Query DNS directly |
| `net user` | List/manage local user accounts |
| `gpupdate /force` | Force Group Policy to reapply |
| `sconfig` | Text-based Windows Server config menu |

## Linux command-line quick reference

| Command | Use |
|---|---|
| `pwd` | Where am I |
| `ls -la` | List files + permissions |
| `chmod 755 file` | Set permissions (owner rwx, group/other rx) |
| `chown user:group file` | Change file owner |
| `systemctl status <service>` | Check if a service is running |
| `sudo systemctl restart <service>` | Restart a service |
| `ping`, `traceroute`, `dig` | Connectivity / DNS troubleshooting |
| `docker ps` | List running containers |

## CIA triad + AAA (say these without hesitating)

- **CIA:** Confidentiality, Integrity, Availability
- **AAA:** Authentication, Authorization, Accounting

## Severity vs. priority

- **Severity** = how bad the impact is.
- **Priority** = how urgent it is to fix right now (severity + who's affected + deadlines).

## Your quick-brag numbers (for "tell me about your background")

- B.S. Cybersecurity, Full Sail University, Oct 2025
- A.S. Information Technology, Full Sail University, May 2024
- CompTIA Security+ — in progress
- Hands-on labs: Nessus (credentialed + non-credentialed scanning), Active Directory, Windows
  Server 2019 NLB + PowerShell, Samba, Nginx + SSL, WordPress hardening, Mayan EDMS/Docker,
  NIST-aligned policy writing, Python/OpenSSL AES-256 encryption tool
- Portfolio: `jacobbarrera2024-sketch.github.io/secplus-sensei`

---

**[← Back to Start Here](00-START-HERE.md)**
