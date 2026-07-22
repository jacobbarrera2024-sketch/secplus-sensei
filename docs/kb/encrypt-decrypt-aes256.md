# KB Article — How to Encrypt and Decrypt Files with AES-256 (OpenSSL)

> **Type:** Self-directed lab / knowledge base article, written in the style of an internal IT support KB entry. Based on lab work from Full Sail coursework (`Openssl tutorial.docx`, `encrypt_decrypt_gui.py`) and standard OpenSSL usage.

**Audience:** IT support technicians who need to quickly encrypt a sensitive file (for secure transfer or storage) or decrypt a file that was sent encrypted.

## Summary

AES-256 in CBC mode is a fast, widely supported way to encrypt a single file with a password. This article covers the command-line steps and the most common failure points — most "it's not working" tickets on this task come down to one of the two issues in the Troubleshooting section below.

## Encrypting a file

```bash
openssl enc -aes-256-cbc -salt -pbkdf2 -in "secret-file.zip" -out "secret-file.zip.enc" -k "YourStrongPassphrase"
```

- `-aes-256-cbc` — cipher and mode (AES, 256-bit key, CBC block mode)
- `-salt` — adds a random salt so the same file/password doesn't always produce the same ciphertext
- `-pbkdf2` — stretches the passphrase through PBKDF2 before deriving the key (modern OpenSSL requires this to avoid a warning/weak-KDF; **omitting it is the #1 cause of "wrong password" errors when decrypting on a different OpenSSL version**)
- `-k` — the passphrase (for real use, prefer `-kfile` pointing at a file, or let OpenSSL prompt interactively so the password isn't left in shell history)

## Decrypting a file

```bash
openssl enc -d -aes-256-cbc -pbkdf2 -in "secret-file.zip.enc" -out "secret-file.zip" -k "YourStrongPassphrase"
```

Note the `-d` flag for decrypt, and that `-pbkdf2` **must match** whether it was used on encryption — mismatched flags between OpenSSL versions is exactly what produces silent corruption or a `bad decrypt` error.

## Troubleshooting (most common tickets)

| Symptom | Cause | Fix |
|---|---|---|
| `bad decrypt` / `error reading input file` | Wrong password, or `-pbkdf2` flag mismatch between encrypt/decrypt commands | Re-confirm the exact passphrase (case-sensitive); re-run both commands with the same `-pbkdf2` setting |
| Decrypted file is corrupt/won't open | File was transferred in text mode (e.g., some email/FTP clients) and line endings were altered | Always transfer `.enc` files as binary attachments (zip them first if unsure) |
| "Unknown option" error | Older OpenSSL version doesn't support `-pbkdf2` | Drop the flag on both encrypt and decrypt, or upgrade OpenSSL |
| Passphrase visible in shell history | Used `-k` directly on a shared/multi-user machine | Use `-kfile <path>` or omit `-k` entirely so OpenSSL prompts interactively |

## Security notes for the ticket queue

- Never store the passphrase in the same channel as the encrypted file (e.g., same email).
- Treat AES-256 file encryption as **confidentiality in transit/storage**, not authentication — it doesn't prove who sent the file.
- For anything beyond a one-off file transfer, prefer a managed solution (BitLocker, 7-Zip AES-256 archives with a password manager-stored key, or company-approved secure file transfer) over ad hoc OpenSSL commands.

---

[← Back to portfolio](https://jacobbarrera2024-sketch.github.io/secplus-sensei/#it-support)
