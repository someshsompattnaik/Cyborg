import { Card, PageHeader } from "@/components/ui";

export const metadata = {
  title: "Cyborg Operator Manual",
  description: "Complete usage manual for the Cyborg SOC Threat Intelligence Platform.",
};

export default function ManualPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Documentation"
        title="Cyborg Operator Manual"
        description="A complete field guide for SOC analysts, threat hunters, and detection engineers using the Cyborg platform for threat intelligence, indicators, IOC lookups, and IP reputation."
      />

      <Card className="p-6 sm:p-8">
        <article className="manual-prose max-w-none">
          <p>
            <strong className="text-slate-100">Cyborg</strong> is a dark-themed Security Operations Center
            (SOC) intelligence platform designed for fast triage, enrichment, and case prioritization.
            This manual explains every module, recommended workflows, data model concepts, and practical
            playbooks you can follow during live investigations.
          </p>

          <h2>1. Platform Overview</h2>
          <p>
            Cyborg centralizes the most common SOC intelligence tasks into one console:
          </p>
          <ul>
            <li>
              <strong className="text-slate-200">Command Center</strong> — high-level operational picture
            </li>
            <li>
              <strong className="text-slate-200">Threat Intelligence</strong> — campaign and adversary tracking
            </li>
            <li>
              <strong className="text-slate-200">Indicators</strong> — IOC inventory management
            </li>
            <li>
              <strong className="text-slate-200">IOC Lookup</strong> — multi-source enrichment and correlation
            </li>
            <li>
              <strong className="text-slate-200">IP Reputation</strong> — network source risk scoring
            </li>
            <li>
              <strong className="text-slate-200">Operator Manual</strong> — this guide
            </li>
          </ul>
          <p>
            All data is persisted in PostgreSQL via Drizzle ORM. On first load, Cyborg automatically seeds
            a realistic intelligence corpus so analysts can explore the platform immediately.
          </p>

          <h2>2. Navigation & Interface</h2>
          <h3>2.1 Sidebar (Desktop)</h3>
          <p>
            On large screens, the left sidebar provides persistent access to all modules. The active route
            is highlighted with a cyan glow to keep orientation clear during multi-tab investigations.
          </p>
          <h3>2.2 Mobile Navigation</h3>
          <p>
            On smaller screens, a sticky top bar and horizontal chip menu replace the sidebar. All features
            remain available without horizontal content loss on most pages.
          </p>
          <h3>2.3 Visual Language</h3>
          <ul>
            <li>
              <code>Critical</code> — rose/red accents for immediate action
            </li>
            <li>
              <code>High</code> — orange for priority triage
            </li>
            <li>
              <code>Medium</code> — amber for monitored risk
            </li>
            <li>
              <code>Low / Clean</code> — green/cyan for lower urgency
            </li>
          </ul>

          <h2>3. Command Center</h2>
          <p>
            The Command Center is the landing page and situational awareness board. It answers:{" "}
            <em className="text-slate-300">What is happening right now across our intelligence corpus?</em>
          </p>
          <h3>3.1 KPI Cards</h3>
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Meaning</th>
                <th>How to use it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Threats</td>
                <td>Total campaign records</td>
                <td>Track corpus growth and coverage</td>
              </tr>
              <tr>
                <td>Indicators</td>
                <td>Total IOC records</td>
                <td>Validate detection content depth</td>
              </tr>
              <tr>
                <td>IP Records</td>
                <td>Reputation entries</td>
                <td>Network intelligence coverage</td>
              </tr>
              <tr>
                <td>Lookups</td>
                <td>Historical analyst queries</td>
                <td>Measure investigative activity</td>
              </tr>
              <tr>
                <td>Critical/High Active</td>
                <td>Priority open threats</td>
                <td>Start shift handoff from this number</td>
              </tr>
            </tbody>
          </table>
          <h3>3.2 Recommended Daily Startup</h3>
          <ul>
            <li>Open Command Center and review Critical/High Active count.</li>
            <li>Scan Recent Threat Intelligence for new campaigns since last shift.</li>
            <li>Inspect Recent IOC Lookups for recurring observables (possible active intrusion).</li>
            <li>Jump into Threat Intelligence or IOC Lookup for deeper triage.</li>
          </ul>

          <h2>4. Threat Intelligence Module</h2>
          <p>
            Use this module to track adversary campaigns, intrusion sets, phishing waves, ransomware
            staging activity, and other intelligence objects that are broader than a single IOC.
          </p>
          <h3>4.1 Creating a Threat Record</h3>
          <ol className="ml-5 list-decimal space-y-2 text-slate-400">
            <li>Click <strong className="text-slate-200">Add Threat</strong>.</li>
            <li>
              Enter a clear title (prefer actor + activity + target pattern), e.g.{" "}
              <code>LockBit Affiliate RDP Staging</code>.
            </li>
            <li>Write a concise description with victimology, delivery method, and impact potential.</li>
            <li>Set category (Phishing, C2, Ransomware, BEC, Botnet, Supply Chain, etc.).</li>
            <li>Assign severity and confidence based on evidence quality.</li>
            <li>Add MITRE tactics and tags for searchability.</li>
            <li>Save and immediately link related indicators in the Indicators module.</li>
          </ol>
          <h3>4.2 Severity Guidance</h3>
          <table>
            <thead>
              <tr>
                <th>Severity</th>
                <th>When to use</th>
                <th>SOC response expectation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Critical</td>
                <td>Active exploitation, ransomware staging, confirmed C2</td>
                <td>Immediate containment / paging</td>
              </tr>
              <tr>
                <td>High</td>
                <td>Credential theft, targeted phishing, high-confidence malware</td>
                <td>Same-shift deep investigation</td>
              </tr>
              <tr>
                <td>Medium</td>
                <td>Suspicious campaigns with partial evidence</td>
                <td>Monitor + enrich</td>
              </tr>
              <tr>
                <td>Low / Info</td>
                <td>Noise, weak signals, historical notes</td>
                <td>Catalog for awareness</td>
              </tr>
            </tbody>
          </table>
          <h3>4.3 Lifecycle Status</h3>
          <ul>
            <li>
              <code>active</code> — currently relevant, action required
            </li>
            <li>
              <code>monitoring</code> — under watch, no confirmed impact yet
            </li>
            <li>
              <code>resolved</code> — threat handled / infrastructure taken down
            </li>
            <li>
              <code>false_positive</code> — invalidated intelligence
            </li>
          </ul>
          <h3>4.4 Filtering & Search</h3>
          <p>
            Use free-text search across title/description/category, then narrow by severity and status.
            During incident response, filter <code>active + critical/high</code> first.
          </p>
          <h3>4.5 Updating & Deleting</h3>
          <p>
            Change status from the card controls as investigations progress. Delete only when a record is
            duplicate noise or test data. Prefer marking <code>false_positive</code> to preserve audit history.
          </p>

          <h2>5. Indicators Module</h2>
          <p>
            Indicators of Compromise (IOCs) are atomic observables used in detections, blocklists, and
            pivots. Cyborg supports:
          </p>
          <ul>
            <li>
              <code>ip</code>
            </li>
            <li>
              <code>domain</code>
            </li>
            <li>
              <code>url</code>
            </li>
            <li>
              <code>hash</code>
            </li>
            <li>
              <code>email</code>
            </li>
            <li>
              <code>filename</code>
            </li>
          </ul>
          <h3>5.1 Adding an Indicator</h3>
          <ol className="ml-5 list-decimal space-y-2 text-slate-400">
            <li>Open Indicators and click <strong className="text-slate-200">Add Indicator</strong>.</li>
            <li>Select the correct type (misclassification breaks enrichment quality).</li>
            <li>
              Paste the value. For domains, you may store defanged values like{" "}
              <code>bad[.]example.com</code>.
            </li>
            <li>Document context in description (where seen, campaign, sensor source).</li>
            <li>Set severity/confidence and tags such as <code>c2</code>, <code>phishing</code>, <code>loader</code>.</li>
            <li>Optionally link a Threat ID to keep campaign correlation intact.</li>
          </ol>
          <h3>5.2 Quality Standards for IOCs</h3>
          <ul>
            <li>Prefer canonical values (lowercase domains, full URLs with scheme when known).</li>
            <li>Never store only a screenshot reference — always store the observable itself.</li>
            <li>Include confidence so automation can decide block vs monitor.</li>
            <li>Tag by kill-chain role when possible (delivery, c2, exfil, payload).</li>
          </ul>
          <h3>5.3 Operational Use</h3>
          <p>
            Export mentally into your controls: firewall block (IP), DNS sinkhole (domain), email filter
            (sender/subject lure), EDR hash block (hash), and proxy deny (URL). Cyborg is the source of
            truth; enforcement systems remain downstream.
          </p>

          <h2>6. IOC Lookup Module</h2>
          <p>
            IOC Lookup is the investigation pivot engine. Enter any observable and Cyborg will:
          </p>
          <ul>
            <li>Detect query type (IP, domain, URL, hash, email, unknown)</li>
            <li>Normalize defanged input (e.g. <code>[.]</code> → <code>.</code>)</li>
            <li>Search indicators and threats for matches</li>
            <li>Attach IP reputation when the query is an address</li>
            <li>Assign an overall risk level and store lookup history</li>
          </ul>
          <h3>6.1 How to Run a Lookup</h3>
          <ol className="ml-5 list-decimal space-y-2 text-slate-400">
            <li>Navigate to IOC Lookup.</li>
            <li>Paste an observable from SIEM, EDR, email gateway, firewall, or ticket.</li>
            <li>Click <strong className="text-slate-200">Lookup</strong>.</li>
            <li>Review risk badge, matched indicators, related threats, and reputation panel.</li>
            <li>Use history to re-run prior pivots without retyping.</li>
          </ol>
          <h3>6.2 Interpreting Results</h3>
          <table>
            <thead>
              <tr>
                <th>Result pattern</th>
                <th>Analyst interpretation</th>
                <th>Next action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>High/Critical risk + indicator match</td>
                <td>Known malicious infrastructure/content</td>
                <td>Contain, block, open/expand incident</td>
              </tr>
              <tr>
                <td>Threat match only</td>
                <td>Campaign context without exact IOC hit</td>
                <td>Hunt for sibling IOCs and related hosts</td>
              </tr>
              <tr>
                <td>Synthetic low IP score</td>
                <td>Unknown address with baseline risk</td>
                <td>Enrich externally, check internal telemetry</td>
              </tr>
              <tr>
                <td>No matches</td>
                <td>Not in Cyborg corpus</td>
                <td>Create indicator if suspicious; continue telemetry review</td>
              </tr>
            </tbody>
          </table>
          <h3>6.3 Sample Investigation Flow</h3>
          <ol className="ml-5 list-decimal space-y-2 text-slate-400">
            <li>
              Alert fires for outbound connection to <code>185.220.101.45</code>.
            </li>
            <li>Lookup the IP in Cyborg → critical reputation + Cobalt Strike tags.</li>
            <li>Open related threat campaign and note MITRE tactics.</li>
            <li>Pivot to host isolation, memory capture, and lateral movement hunting.</li>
            <li>Add any newly discovered domains/hashes into Indicators.</li>
            <li>Update threat status and confidence as evidence grows.</li>
          </ol>

          <h2>7. IP Reputation Module</h2>
          <p>
            IP Reputation provides network-centric risk scoring for perimeter, VPN, proxy, and cloud
            telemetry sources.
          </p>
          <h3>7.1 Score Model</h3>
          <table>
            <thead>
              <tr>
                <th>Score</th>
                <th>Risk level</th>
                <th>Guidance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>90–100</td>
                <td>Critical</td>
                <td>Block / high-priority IR</td>
              </tr>
              <tr>
                <td>70–89</td>
                <td>High</td>
                <td>Containment candidate + deep review</td>
              </tr>
              <tr>
                <td>40–69</td>
                <td>Medium</td>
                <td>Monitor, enrich, rate-limit if noisy</td>
              </tr>
              <tr>
                <td>15–39</td>
                <td>Low</td>
                <td>Watchlist / contextual only</td>
              </tr>
              <tr>
                <td>0–14</td>
                <td>Clean</td>
                <td>Likely benign public infrastructure</td>
              </tr>
            </tbody>
          </table>
          <h3>7.2 Creating or Updating Records</h3>
          <p>
            Use <strong className="text-slate-200">Add / Update IP</strong>. If the IP already exists, Cyborg
            upserts the record (score, ASN, ISP, abuse counts, categories, notes). Always include notes for
            auditability — future analysts should understand why a score was assigned.
          </p>
          <h3>7.3 Categories & Context</h3>
          <p>
            Useful category tags include <code>c2</code>, <code>scanning</code>, <code>bruteforce</code>,{" "}
            <code>proxy</code>, <code>tor</code>, <code>malware</code>, and <code>phishing-infra</code>. Combine
            categories with ASN/ISP to detect bulletproof hosting clusters.
          </p>

          <h2>8. Recommended SOC Playbooks</h2>
          <h3>8.1 Phishing Alert</h3>
          <ul>
            <li>Extract sender, reply-to, URLs, attachment hashes/filenames.</li>
            <li>Run each through IOC Lookup.</li>
            <li>If malicious, create/update Threat Intelligence record (category: Phishing).</li>
            <li>Register all new IOCs with high severity and source = Email Gateway.</li>
            <li>Document user impact and remediation in threat description updates.</li>
          </ul>
          <h3>8.2 C2 / Beaconing Alert</h3>
          <ul>
            <li>Lookup destination IP and any JA3/domain companions.</li>
            <li>Check IP reputation score and abuse history.</li>
            <li>If critical/high, isolate host and expand to process tree + persistence.</li>
            <li>Create/update campaign threat with MITRE Command and Control tactics.</li>
          </ul>
          <h3>8.3 Ransomware Early Warning</h3>
          <ul>
            <li>Correlate admin share access, credential dumping, and unusual backup access.</li>
            <li>Add staging indicators (tools, IPs, filenames) immediately.</li>
            <li>Set threat severity to critical and status to active.</li>
            <li>Use Command Center critical count for leadership situational updates.</li>
          </ul>
          <h3>8.4 Shift Handoff</h3>
          <ul>
            <li>Command Center → Critical/High Active summary</li>
            <li>Threats filtered to active</li>
            <li>Lookup history for recurring pivots</li>
            <li>Outstanding IP reputation updates still marked medium/unknown</li>
          </ul>

          <h2>9. Data Model Reference</h2>
          <table>
            <thead>
              <tr>
                <th>Entity</th>
                <th>Key fields</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>threats</td>
                <td>title, severity, status, confidence, mitre_tactics, tags</td>
                <td>Campaign-level intelligence</td>
              </tr>
              <tr>
                <td>indicators</td>
                <td>type, value, severity, confidence, threat_id, tags</td>
                <td>Atomic IOC inventory</td>
              </tr>
              <tr>
                <td>ip_reputations</td>
                <td>ip, score, risk_level, asn, isp, abuse_reports</td>
                <td>Network risk scoring</td>
              </tr>
              <tr>
                <td>lookup_logs</td>
                <td>query, query_type, risk_level, matched, result_summary</td>
                <td>Investigation audit trail</td>
              </tr>
            </tbody>
          </table>

          <h2>10. API Endpoints (for automation)</h2>
          <p>
            Cyborg exposes JSON APIs that can be used by scripts, SOAR workflows, or browser tooling:
          </p>
          <ul>
            <li>
              <code>GET /api/stats</code> — dashboard metrics
            </li>
            <li>
              <code>GET/POST /api/threats</code> — list/create threats
            </li>
            <li>
              <code>PATCH/DELETE /api/threats/:id</code> — update/delete threat
            </li>
            <li>
              <code>GET/POST /api/indicators</code> — list/create indicators
            </li>
            <li>
              <code>PATCH/DELETE /api/indicators/:id</code> — update/delete indicator
            </li>
            <li>
              <code>GET/POST /api/ip-reputation</code> — list/upsert IP reputation
            </li>
            <li>
              <code>GET /api/lookup?q=...</code> — enrich an observable
            </li>
            <li>
              <code>GET /api/lookup?history=1</code> — recent lookup history
            </li>
            <li>
              <code>GET /api/health</code> — service health check
            </li>
          </ul>

          <h2>11. Best Practices & Governance</h2>
          <ul>
            <li>
              <strong className="text-slate-200">Write for the next analyst.</strong> Descriptions should
              explain why something matters, not only what was observed.
            </li>
            <li>
              <strong className="text-slate-200">Separate fact from hypothesis.</strong> Keep confirmed
              telemetry in descriptions; put speculation in notes/tags carefully.
            </li>
            <li>
              <strong className="text-slate-200">Retire stale IOCs.</strong> Old infrastructure can be
              reassigned; periodically re-score IP reputation.
            </li>
            <li>
              <strong className="text-slate-200">Preserve chain of custody.</strong> Prefer status changes
              over hard deletes for production intelligence.
            </li>
            <li>
              <strong className="text-slate-200">Use consistent tags.</strong> Agree on a controlled
              vocabulary (actor, malware family, kill-chain stage, sector).
            </li>
          </ul>

          <h2>12. Troubleshooting</h2>
          <table>
            <thead>
              <tr>
                <th>Symptom</th>
                <th>Likely cause</th>
                <th>Fix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Empty dashboard on first boot</td>
                <td>Seed still running or DB not ready</td>
                <td>Refresh page; verify <code>/api/health</code></td>
              </tr>
              <tr>
                <td>Lookup returns no matches</td>
                <td>Observable not in corpus / over-defanged</td>
                <td>Try normalized form; add indicator manually</td>
              </tr>
              <tr>
                <td>IP save fails</td>
                <td>Missing IP field or invalid payload</td>
                <td>Ensure IP is provided; score 0–100</td>
              </tr>
              <tr>
                <td>Filters show nothing</td>
                <td>Too-narrow severity/status combination</td>
                <td>Clear filters and re-apply one at a time</td>
              </tr>
            </tbody>
          </table>

          <h2>13. Quick Reference Cheatsheet</h2>
          <ul>
            <li>
              <strong className="text-slate-200">New campaign?</strong> Threat Intelligence → Add Threat
            </li>
            <li>
              <strong className="text-slate-200">New observable?</strong> Indicators → Add Indicator
            </li>
            <li>
              <strong className="text-slate-200">Alert pivot?</strong> IOC Lookup → paste observable
            </li>
            <li>
              <strong className="text-slate-200">Source IP risk?</strong> IP Reputation → search/upsert
            </li>
            <li>
              <strong className="text-slate-200">Shift brief?</strong> Command Center KPIs + recent lists
            </li>
          </ul>

          <h2>14. Closing Notes</h2>
          <p>
            Cyborg is built to keep SOC work fast, dark-mode readable, and investigation-centric. Treat it
            as your living intelligence workspace: every alert should leave behind either a new IOC, an
            updated threat record, a reputation adjustment, or a clear false-positive decision. That
            discipline turns individual tickets into durable defensive knowledge.
          </p>
          <p className="text-cyan-300">
            End of manual — operate decisively, document thoroughly, and hunt continuously.
          </p>
        </article>
      </Card>
    </div>
  );
}
