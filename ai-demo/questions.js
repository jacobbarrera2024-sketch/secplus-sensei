/* Sample Security+ (SY0-701) questions — subset from SecPlus Sensei */
(function (global) {
  "use strict";

  global.SAMPLE_QUESTIONS = [
    {
      id: "q1",
      domain: "General Security Concepts",
      stem: "Which security goal is directly provided by encryption?",
      opts: ["Integrity", "Availability", "Confidentiality", "Non-repudiation"],
      ans: 2,
      exp: "Encryption scrambles data so only authorized parties can read it — confidentiality. Integrity is hashing; non-repudiation is digital signatures."
    },
    {
      id: "q2",
      domain: "Threats, Vulnerabilities & Mitigations",
      stem: "A user's mouse begins moving on its own and files are being copied to a USB drive without their input. This BEST indicates:",
      opts: ["A worm", "An active RAT (remote access trojan)", "A logic bomb", "A rootkit"],
      ans: 1,
      exp: "Someone remotely controlling the machine in real time points to a Remote Access Trojan giving an attacker live control."
    },
    {
      id: "q3",
      domain: "Threats, Vulnerabilities & Mitigations",
      stem: "An attacker inserts <script> into a comment field that runs in other users' browsers. This is:",
      opts: ["CSRF", "SQL injection", "Cross-site scripting (XSS)", "Buffer overflow"],
      ans: 2,
      exp: "Script executing in other users' browsers is stored XSS."
    },
    {
      id: "q4",
      domain: "Architecture & Design",
      stem: "A network zone that hosts public-facing servers while isolating the internal LAN is a:",
      opts: ["VLAN hopping zone", "DMZ / screened subnet", "Air gap", "Honeynet"],
      ans: 1,
      exp: "A DMZ (screened subnet) exposes public services while shielding the internal network."
    },
    {
      id: "q5",
      domain: "Operations & Incident Response",
      stem: "Which platform aggregates and correlates logs from many sources for detection?",
      opts: ["SOAR", "SIEM", "DLP", "MDM"],
      ans: 1,
      exp: "SIEM aggregates and correlates logs. SOAR automates response actions."
    },
    {
      id: "q6",
      domain: "Governance, Risk & Compliance",
      stem: "A system may lose at most 15 minutes of data. Which metric defines this?",
      opts: ["RTO", "RPO", "MTBF", "MTTR"],
      ans: 1,
      exp: "RPO = maximum tolerable data loss measured in time."
    },
    {
      id: "q7",
      domain: "Threats, Vulnerabilities & Mitigations",
      stem: "Which attack tries ONE commonly-used password against MANY different accounts to avoid lockout thresholds?",
      opts: ["Brute force", "Credential stuffing", "Password spraying", "Rainbow table"],
      ans: 2,
      exp: "Password spraying spreads a few common passwords across many accounts."
    },
    {
      id: "q8",
      domain: "Architecture & Design",
      stem: "Which protocol should replace Telnet for secure remote command-line administration?",
      opts: ["FTP", "SSH", "SNMPv1", "HTTP"],
      ans: 1,
      exp: "SSH encrypts remote administrative sessions; Telnet sends everything in cleartext."
    }
  ];
})(typeof window !== "undefined" ? window : global);
